# Сервис логов

## Назначение

Сервис `log` собирает audit-события всех микросервисов и предоставляет администраторам API для их просмотра. HTTP-доступ реализуется через API Gateway контроллером `LogsController` из библиотеки `gateway-controllers`.

Сервис работает в двух направлениях:

- **Запись** — подписан на RabbitMQ-события auth-, blog-, event- и profile-сервисов и сохраняет их в PostgreSQL.
- **Чтение** — предоставляет gRPC-методы `GetLogs` и `GetLogsByActor`, доступные только администраторам.

Все HTTP-маршруты используют глобальный префикс `/api`. Swagger-документация доступна по адресу `localhost:3000/api/docs`, контроллер сгруппирован по тегу `LOG / Logs`.

## Реализованный функционал

- Централизованный сбор audit-событий из четырёх микросервисов
- Сохранение события вместе с телом (`logBody`), именем микросервиса, именем сервиса и признаком административного действия
- Пагинированный просмотр всех логов с фильтрацией:
  - по поисковой строке в действии и его описании
  - по микросервису и сервису
  - по диапазону дат
  - по признаку административного действия
- Пагинированный просмотр логов конкретного пользователя (`actorId`)
- Проверка роли `ADMIN` на уровне Gateway и на уровне gRPC-сервиса
- Полная типизация запросов и ответов в соответствии с gRPC-схемой и HTTP-схемой
- Единая валидация DTO через `class-validator`

## Архитектура

```text
auth / blog / event / profile
            │  RabbitMQ (queue: log)
            ▼
      log microservice
            │
            ├── LogDatabaseUtil ──► PostgreSQL (logs)
            │
            └── LogFeatureService ◄── gRPC ◄── API Gateway ◄── HTTP-клиент
```

Запись логов выполняется обработчиками RabbitMQ, чтение — gRPC-методами. Очередь `log` объявлена как durable.

## Маршрутизация

| Группа | Базовый путь    | Swagger-тег |
| ------ | --------------- | ----------- |
| Логи   | `/api/log/logs` | `LOG / Logs` |

Списочные методы используют HTTP-метод `QUERY` и принимают параметры пагинации в теле запроса, а не в query string.

## Авторизация и роли

- **ADMIN** — требуется валидный access-токен пользователя с ролью администратора

Для защищённых методов передаётся заголовок:

```http
Authorization: Bearer <accessToken>
```

`ValidateInputParam` извлекает access-токен из заголовка `Authorization`, а данные сессии — из параметров HTTP-запроса и `User-Agent`. При отсутствии или невалидности токена возвращается `401`, при недостатке прав — `403`.

Оба gRPC-метода дополнительно вызывают `AuthValidateService.validateWithRoles` с ролью `ADMIN`, поэтому прямой вызов gRPC без прав также будет отклонён.

## Методы

| HTTP  | Путь                | gRPC-метод               | Роли  | Назначение                                      |
| ----- | ------------------- | ------------------------ | ----- | ----------------------------------------------- |
| QUERY | `/api/log/logs`     | `LogService/GetLogs`     | ADMIN | Пагинированный список всех логов                |
| QUERY | `/api/log/logs/:id` | `LogService/GetLogsByActor` | ADMIN | Пагинированный список логов пользователя по ID |

### Параметры пагинации

| Поле               | Тип       | Обязательно | Описание                                            |
| ------------------ | --------- | ----------- | --------------------------------------------------- |
| `page`             | number    | нет         | Страница, от 1, по умолчанию 1                      |
| `limit`            | number    | нет         | Количество на странице, от 1, по умолчанию 10       |
| `search`           | string    | нет         | Поиск по `action` и `actionDesc`, длина от 3 до 90  |
| `dateFrom`         | date-time | нет         | Начало диапазона дат создания лога                  |
| `dateTo`           | date-time | нет         | Конец диапазона дат создания лога                   |
| `microserviceName` | string    | нет         | Фильтр по имени микросервиса, длина от 2 до 90      |
| `serviceName`      | string    | нет         | Фильтр по имени сервиса, длина от 2 до 90           |
| `isAdminAction`    | boolean   | нет         | Фильтр по признаку административного действия       |

`microserviceName` и `serviceName` сравниваются без учёта регистра по вхождению подстроки. Поиск по `search` также не учитывает регистр. Сортировка по умолчанию: `createdAt` по убыванию, затем `serviceName`, `microserviceName` и `id` по возрастанию.

Для метода `GetLogsByActor` идентификатор пользователя передаётся в path-параметре `:id` и должен быть валидным UUID v7.

## Формат лога

| Поле               | Тип     | Описание                                                  |
| ------------------ | ------- | --------------------------------------------------------- |
| `id`               | string  | Идентификатор лога                                        |
| `actorId`          | string  | ID пользователя, совершившего действие (может отсутствовать) |
| `action`           | string  | Машиночитаемое имя события                                |
| `actionDesc`       | string  | Человекочитаемое описание события                         |
| `microserviceName` | string  | Микросервис-источник: `AUTH`, `BLOG`, `EVENT`, `PROFILE`  |
| `serviceName`      | string  | Сервис внутри микросервиса                                |
| `isAdminAction`    | boolean | Признак административного действия                        |
| `logBody`          | string  | JSON-тело события, сериализованное в строку               |
| `createdAt`        | string  | Дата и время создания лога                                |

`logBody` хранится в PostgreSQL как `JSON`, а в gRPC-ответе возвращается строкой. Для событий без пользователя (например, запрос на восстановление пароля) `actorId` может отсутствовать.

## Источники событий

Сервис обрабатывает **57** событий: 26 из auth, 7 из blog, 20 из event и 4 из profile.

### Auth — Authorization (6)

| Action                    | `isAdminAction` | Описание                                             |
| ------------------------- | --------------- | ---------------------------------------------------- |
| `user.registered`         | false           | Регистрация нового пользователя                      |
| `user.login`              | false           | Вход в аккаунт                                       |
| `user.logout`             | false           | Выход из аккаунта                                    |
| `user.forgot.password`    | false           | Запрос на восстановление пароля                      |
| `user.restore.password`   | false           | Восстановление пароля                                |
| `user.unblock`            | false           | Автоматическая разблокировка по истечении срока      |

### Auth — Session (4)

| Action                | `isAdminAction` | Описание                              |
| --------------------- | --------------- | ------------------------------------- |
| `sessions.check`      | true            | Администратор запросил сессии пользователя |
| `session.name`        | false           | Пользователь переименовал сессию      |
| `session.delete`      | false           | Пользователь удалил сессию            |
| `all.sessions.delete` | false           | Пользователь удалил все другие сессии |

### Auth — Token (5)

| Action                   | `isAdminAction` | Описание                                |
| ------------------------ | --------------- | --------------------------------------- |
| `tokens.check`           | true            | Администратор запросил список токенов   |
| `token.by.id`            | true            | Администратор запросил токен по ID      |
| `token.revoke`           | true            | Администратор отозвал токен             |
| `token.delete`           | true            | Администратор удалил токен              |
| `inactive.tokens.delete` | true            | Администратор удалил неактивные токены  |

### Auth — User (11)

| Action                 | `isAdminAction` | Описание                                  |
| ---------------------- | --------------- | ----------------------------------------- |
| `users.check`          | true            | Администратор запросил список пользователей |
| `user.by.id`           | true            | Администратор запросил пользователя по ID |
| `user.block`           | true            | Администратор заблокировал пользователя   |
| `user.unblock.early`   | true            | Администратор разблокировал досрочно      |
| `user.promote`         | true            | Повышение до модератора                   |
| `user.demote`          | true            | Понижение с модератора                    |
| `user.change.email`    | false           | Пользователь сменил email                 |
| `user.change.password` | false           | Пользователь сменил пароль                |
| `user.inactive`        | false           | Пользователь деактивировал аккаунт        |
| `user.active`          | true            | Администратор активировал аккаунт         |
| `user.deleted`         | false           | Пользователь удалил аккаунт               |

### Blog (7)

| Action                   | Сервис    | `isAdminAction` | Описание                     |
| ------------------------ | --------- | --------------- | ---------------------------- |
| `blog.tag.create`        | Tag       | true            | Создание тега блога          |
| `blog.tag.delete`        | Tag       | true            | Удаление тега блога          |
| `blog.article.create`    | Article   | true            | Создание статьи              |
| `blog.article.publish`   | Article   | true            | Публикация статьи            |
| `blog.article.unpublish` | Article   | true            | Снятие статьи с публикации   |
| `blog.article.update`    | Article   | true            | Обновление статьи            |
| `blog.article.delete`    | Article   | true            | Удаление статьи              |

### Event — Event (12)

| Action                  | `isAdminAction` | Описание                                |
| ----------------------- | --------------- | --------------------------------------- |
| `event.created`         | false           | Организатор создал мероприятие          |
| `event.updated`         | false           | Организатор обновил мероприятие         |
| `event.published`       | false           | Организатор опубликовал мероприятие     |
| `event.cancelled`       | false           | Организатор отменил мероприятие         |
| `event.finished`        | false           | Организатор завершил мероприятие        |
| `event.join`            | false           | Организатор изменил блокировку записи   |
| `event.deleted`         | false           | Организатор удалил мероприятие          |
| `event.organizer`       | false           | Организатор передал мероприятие         |
| `event.admin.organizer` | true            | Администратор передал мероприятие       |
| `event.admin.delete`    | true            | Администратор удалил мероприятие        |
| `event.admin.check`     | true            | Администратор запросил приватный список |
| `event.admin.check.slug`| true            | Администратор запросил мероприятие по slug |

### Event — Participant (5)

| Action                        | `isAdminAction` | Описание                                  |
| ----------------------------- | --------------- | ----------------------------------------- |
| `participant.join`            | false           | Пользователь вступил в мероприятие        |
| `participant.leave`           | false           | Пользователь покинул мероприятие          |
| `participant.organizer.add`   | false           | Организатор добавил участника             |
| `participant.organizer.delete`| false           | Организатор удалил участника              |
| `participant.organizer.status`| false           | Организатор изменил статус участника      |

### Event — Tag (3)

| Action              | `isAdminAction` | Описание                    |
| ------------------- | --------------- | --------------------------- |
| `event.tag.create`  | true            | Создание тега мероприятия   |
| `event.tag.update`  | true            | Обновление тега мероприятия |
| `event.tag.delete`  | true            | Удаление тега мероприятия   |

### Profile (4)

| Action                      | Сервис     | `isAdminAction` | Описание                              |
| --------------------------- | ---------- | --------------- | ------------------------------------- |
| `profiles.get.advanced`     | Profile    | true            | Администратор запросил список профилей |
| `profile.nickname.advanced` | Profile    | true            | Администратор запросил профиль по никнейму |
| `profile.update`            | Profile    | false           | Пользователь обновил профиль          |
| `reputation.changed`        | Reputation | true            | Администратор изменил репутацию       |

## Форматы ответов

- Список логов: `pagination` и массив `logs`.
- Пагинация: `page`, `limit`, `total`, `totalPages`, `hasNext`, `hasPrev`, а также переданные фильтры `search`, `dateFrom`, `dateTo`, `microserviceName`, `serviceName`, `isAdminAction`.
- Лог: `id`, `actorId`, `action`, `actionDesc`, `microserviceName`, `serviceName`, `isAdminAction`, `logBody`, `createdAt`.

## Модель базы данных

| Модель | Назначение                                                    |
| ------ | ------------------------------------------------------------- |
| `Log`  | Audit-событие: автор, действие, источник, признак админа, тело |

Индексы:

- `createdAt` — для сортировки и фильтрации по датам;
- `(actorId, createdAt)` — для логов конкретного пользователя;
- `(action, createdAt)` — для поиска по действию.

## Интеграция с log-сервисом

`GatewayControllersModule` регистрирует gRPC-клиент `LOG_CLIENT`:

- пакет: `log`
- proto-файл: `proto/log.proto`
- адрес сервиса: переменная окружения `TAVERN_LOG_GRPC_URL`, по умолчанию `log-service:5000`
- используемый gRPC-сервис: `LogService`

Gateway добавляет к gRPC-запросу `ValidateInput` (access-токен и данные сессии) и вызывает соответствующий gRPC-метод. Ответы маппятся в HTTP-формат.

## ENV-переменные

- **TAVERN_LOG_GRPC_PORT** — порт gRPC-сервера (по умолчанию 5000; в `.env.example` — 5003)
- **TAVERN_LOG_DB_URL** — ссылка на базу данных log-сервиса
- **TAVERN_AUTH_DB_URL** — ссылка на базу данных auth-сервиса для валидации токенов
- **TAVERN_JWT_SECRET** — JWT-секрет для проверки access-токенов
- **TAVERN_JWT_ACCESS_TOKEN_TTL** — время жизни access-токена в минутах
- **TAVERN_JWT_REFRESH_TOKEN_TTL** — время жизни refresh-токена в днях
- **TAVERN_RMQ_USER** — пользователь RabbitMQ
- **TAVERN_RMQ_PASSWORD** — пароль RabbitMQ
- **TAVERN_RMQ_URL** — URL RabbitMQ

## ENV-переменные Gateway

- **TAVERN_LOG_GRPC_URL** — адрес log-сервиса для gRPC
- **TAVERN_JWT_SECRET** — JWT-секрет для проверки access-токенов
- **TAVERN_GATEWAY_HTTP_PORT** — порт HTTP Gateway (по умолчанию 3000)

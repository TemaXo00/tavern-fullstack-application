# Сервис профилей

## Реализованный функционал

- Полный цикл работы с профилем пользователя:
  - Создание профиля при регистрации (через RMQ-событие от auth-сервиса)
  - Просмотр своего профиля (расширенный output)
  - Публичный просмотр профиля по никнейму
  - Просмотр профиля по никнейму с расширенными данными (ADMIN / MODERATOR)
  - Обновление данных профиля (никнейм, имя, фамилия, описание, дата рождения, аватар)
- Система репутации на основе event-sourcing:
  - Агрегат `reputationScore` в профиле
  - Логи `Reputation` с action, message, score, createdAt
  - Начисление/списание репутации через `ProfileReputationUtil`
- Система активности на основе event-sourcing:
  - Агрегат `currentActivity` в профиле (`ACTIVE`, `INACTIVE`, `BLOCKED`)
  - Логи `ProfileActivity` со статусом и createdAt
  - Автоматическое обновление статуса через RMQ-события от auth
- Кэширование точечных запросов профилей через Redis:
  - Раздельные ключи для base и advanced output
  - TTL настраивается через ENV
  - Инвалидация при обновлении профиля
  - Fallback на БД при падении Redis
- Полная типизация всех запросов и ответов в соответствии с gRPC-схемой и схемой для HTTP
- Валидация через `AuthCoreModule` — общий SDK с auth-сервисом, без дублирования кода

## ENV-переменные

- **TAVERN_PROFILE_GRPC_PORT** - порт для получения gRPC запросов (по умолчанию 5003)
- **TAVERN_PROFILE_DB_URL** - ссылка на базу данных профилей
- **TAVERN_PROFILE_CACHE_TTL** - TTL кэша профилей в секундах (по умолчанию 300)
- **TAVERN_AUTH_DB_URL** - ссылка на базу данных auth-сервиса (нужна для валидации сессий)
- **TAVERN_JWT_SECRET** - JWT-секрет для валидации токенов
- **TAVERN_JWT_ACCESS_TOKEN_TTL** - время жизни Access токена (должно совпадать с auth)
- **TAVERN_RMQ_USER** - пользователь для RabbitMQ
- **TAVERN_RMQ_PASSWORD** - пароль для RabbitMQ
- **TAVERN_RMQ_URL** - URL для RabbitMQ
- **TAVERN_REDIS_URL** - URL для Redis
- **TAVERN_REDIS_PASSWORD** - пароль для Redis
- **TAVERN_REPUTATION_SCORE_EVENT** - репутация за участие в событии (по умолчанию 60)
- **TAVERN_REPUTATION_SCORE_BLOCK** - репутация за блокировку (по умолчанию -50)
- **TAVERN_REPUTATION_SCORE_EARLY_UNBLOCK** - репутация за досрочную разблокировку (по умолчанию 50)
- **TAVERN_REPUTATION_SCORE_REPORT** - репутация за репорт (по умолчанию -10)

## Безопасность

- Валидация JWT через `AuthValidateService` из общего SDK `@org/auth-core`
- Публичные методы (`GetProfileByNicknameBase`, `GetProfilesBase`) не требуют валидации
- Авторизованные методы (`GetMe`, `UpdateProfile`) требуют валидный access-токен
- Модерские методы (`GetProfileByNicknameAdvanced`, `GetProfilesAdvanced`) требуют роль ADMIN или MODERATOR
- Публичный output (`ProfileBaseOutput`) не содержит приватных полей (id, userId, email, birthDate)
- Уникальность никнейма проверяется только при реальном изменении
- Redis-кэш изолирован по ключам `profile-base:*` и `profile-advanced:*`

## Жизненный цикл профиля

1. **Регистрация в auth** → auth отправляет событие `AUTH_REGISTER` в RMQ → profile создаёт профиль + первый лог активности
2. **Просмотр профиля** → валидация JWT (для авторизованных) → проверка роли (для модерских) → Redis-кэш → БД → маппинг → ответ
3. **Обновление профиля** → валидация JWT → проверка уникальности никнейма → обновление в БД → инвалидация кэша по старому и новому никнейму
4. **Блокировка** → auth отправляет событие `USER_BLOCK` → profile обновляет `currentActivity = BLOCKED`, списывает репутацию, создаёт лог активности и лог репутации
5. **Разблокировка** → auth отправляет событие `USER_UNBLOCK` → profile возвращает `ACTIVE`, начисляет репутацию за досрочную разблокировку
6. **Деактивация** → auth отправляет событие `USER_SET_INACTIVE` → profile обновляет `currentActivity = INACTIVE`
7. **Удаление** → auth отправляет событие `USER_DELETED` → profile удаляет запись (каскадом улетают репутация, активность, соцсети)

## Методы микросервиса

**Примечание:** Auth в "Роли" означает, что метод может вызываться ЛЮБЫМ зарегистрированным пользователем

### ProfileService

| Метод                        | Описание                                | Роли             |
| ---------------------------- | --------------------------------------- | ---------------- |
| GetMe                        | Свой профиль (расширенный)              | Auth             |
| GetProfileByNicknameBase     | Публичный профиль по никнейму           | —                |
| GetProfileByNicknameAdvanced | Расширенный профиль по никнейму         | ADMIN, MODERATOR |
| GetProfilesBase              | Список профилей (базовая пагинация)     | —                |
| GetProfilesAdvanced          | Список профилей (расширенная пагинация) | ADMIN, MODERATOR |
| UpdateProfile                | Обновление данных профиля               | Auth             |

### ActivityService

| Метод                 | Описание                    | Роли             |
| --------------------- | --------------------------- | ---------------- |
| GetMyLogs             | Свои логи активности        | Auth             |
| GetActivityByNickname | Логи активности по никнейму | ADMIN, MODERATOR |

### ReputationService

| Метод                   | Описание                   | Роли |
| ----------------------- | -------------------------- | ---- |
| GetMyLogs               | Свои логи репутации        | Auth |
| GetReputationByNickname | Логи репутации по никнейму | —    |

## RMQ-события от auth

| Событие             | Действие в profile                                                               |
| ------------------- | -------------------------------------------------------------------------------- |
| `AUTH_REGISTER`     | Создание профиля + первый лог активности                                         |
| `USER_BLOCK`        | `currentActivity = BLOCKED`, списание репутации, лог активности + лог репутации  |
| `USER_UNBLOCK`      | `currentActivity = ACTIVE`, начисление репутации, лог активности + лог репутации |
| `USER_SET_INACTIVE` | `currentActivity = INACTIVE`, лог активности                                     |
| `USER_SET_ACTIVE`   | `currentActivity = ACTIVE`, лог активности                                       |
| `USER_EMAIL_CHANGE` | Обновление email в профиле                                                       |
| `USER_DELETED`      | Удаление профиля (каскадом улетают репутация, активность, соцсети)               |

## Кэширование

- **Стратегия**: cache-aside
- **Что кэшируется**: `GetProfileByNicknameBase`, `GetProfileByNicknameAdvanced`
- **Что не кэшируется**: `GetMe`, `GetProfilesBase`, `GetProfilesAdvanced` (сложная инвалидация), activity-логи, reputation-логи
- **Ключи**: `profile-base:${nickname}`, `profile-advanced:${nickname}`
- **TTL**: 300 секунд
- **Инвалидация**: при `UpdateProfile` — по старому и новому никнейму
- **Fallback**: при падении Redis — запрос идёт в БД, сервис продолжает работать
- **Замеры**: latency `GetProfileByNicknameBase` снизилась с 230 мс (первый запрос) до 6-8 мс (cache hit)

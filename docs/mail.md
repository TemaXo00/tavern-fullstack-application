# Сервис почты

## Назначение

Сервис `mail` отвечает за отправку писем пользователям. Он работает как RabbitMQ-консьюмер и не предоставляет gRPC или HTTP API. Шаблоны писем хранятся в `mail-templates/`, рендеринг выполняется через EJS, отправка — через `@nestjs-modules/mailer`.

## Архитектура

- Приложение: `app/server/mail`
- Библиотеки: `app/server-libs/mail-handler`, `app/server-libs/mail-auth-handler`
- Шаблоны: `app/mail-templates/`

`MailHandlerService` формирует контекст письма (добавляет `link` из `TAVERN_WEB_CLIENT_LINK` и текущий год) и отправляет шаблон через `MailerService`. Базовая конфигурация почтового транспорта настраивается через переменные окружения.

## Обработчики событий

### Авторизация (`AUTHORIZATION_MESSAGES`)

| Событие | Шаблон | Описание |
| --- | --- | --- |
| `user.registered` | `auth/register` | Письмо о регистрации |
| `user.login` | `auth/login` | Уведомление о новом входе |
| `user.forgot.password` | `auth/forgot-password` | Письмо для восстановления пароля (передаётся токен) |
| `user.restore.password` | `auth/reset-password` | Уведомление об успешном восстановлении пароля |

### Управление пользователями (`USER_MESSAGES`)

| Событие | Шаблон | Описание |
| --- | --- | --- |
| `user.block` | `auth/block` | Уведомление о блокировке (причина, период блокировки) |
| `user.unblock.early` | `auth/unblock` | Уведомление о разблокировке администратором |
| `user.change.email` | `auth/change-email-old`, `auth/change-email-new` | Уведомления на старый и новый email с данными сессии |
| `user.change.password` | `auth/change-password` | Уведомление о смене пароля с данными сессии |
| `user.active` | `auth/set-active` | Уведомление о восстановлении активности администратором |
| `user.deleted` | `auth/delete` | Уведомление об удалении аккаунта |

## Переменные окружения

| Переменная | Описание | Пример |
| --- | --- | --- |
| `TAVERN_MAIL_FROM` | Адрес отправителя | `noreply@tavern.com` |
| `TAVERN_MAIL_TRANSPORT_HOST` | Хост SMTP | `mailpit` |
| `TAVERN_MAIL_TRANSPORT_PORT` | Порт SMTP | `1025` |
| `TAVERN_MAIL_SECURE_ENABLE` | Использовать TLS | `false` |
| `TAVERN_MAIL_USER` | Логин SMTP | — |
| `TAVERN_MAIL_PASSWORD` | Пароль SMTP | — |
| `TAVERN_WEB_CLIENT_LINK` | Ссылка на веб-клиент (используется в шаблонах) | `http://localhost:4200` |
| `TAVERN_RMQ_URL` / `TAVERN_RMQ_DEV_URL` | Подключение к RabbitMQ | — |

## Развёртывание

Сервис собирается из `docker-files/Mail.Dockerfile`, добавлен в `docker-compose.yml` как `mail-service-dev`, а также интегрирован в скрипты сборки и пуша Docker-образов. Для локальной отладки писем используется [Mailpit](https://github.com/axllent/mailpit) (доступен на `http://localhost:8025`).

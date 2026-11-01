# API Gateway

## Назначение

Единая точка входа для HTTP-клиентов. Принимает REST-запросы, валидирует DTO и роли, маппит запросы в gRPC и проксирует их в микросервисы.

## Зачем gateway, а не прямой gRPC от клиента

- gRPC требует HTTP/2 и специфичных клиентов, браузеры его не умеют
- Gateway отдаёт привычный REST + Swagger-документацию
- Валидация DTO и ролей — на gateway, до вызова микросервиса
- Единая точка для CORS, rate limiting, логов HTTP-запросов

## Реализованный функционал

- Проксирование HTTP → gRPC
- Кастомные декораторы контроллеров и методов
- Автоматическая валидация DTO через `class-validator`
- Извлечение `ValidateInput` из access-токена и данных HTTP-запроса
- Swagger-документация, автогенерируемая из декораторов
- Кастомный `AllExceptionsFilter` для унификации ошибок
- Кастомный `ResponseInterceptor` для унификации успешных ответов
- `GrpcExceptionInterceptor` для преобразования gRPC-статусов в HTTP-коды
- Логирование HTTP-запросов
- CORS, rate limiting, compression, cookie parser

## HTTP-методы

Полный список маршрутов см. в Swagger: `localhost:3000/api/docs`.

Документация по группам маршрутов:

- [Авторизация](auth.md)
- [Профили](profile.md)
- [Мероприятия](event.md)
- [Блог](blog.md)
- [Логи](log.md)

## Кастомные декораторы

### `@HTTPController`

Задаёт путь контроллера и Swagger-тег по имени микросервиса и сервиса.

```ts
@HTTPController({
  microserviceName: 'Blog',
  serviceName: 'Article',
})
export class ArticleController {}
```

В результате маршрут получает префикс `/api/blog/article`, а Swagger-тег — `BLOG / Article`.

### Публичные методы

- `@GETMethod`
- `@QUERYMethod`
- `@POSTMethod`
- `@PUTMethod`
- `@PATCHMethod`
- `@DELETEMethod`

Они объединяют HTTP-декоратор NestJS и `@ApiOperation`, но не требуют авторизации.

### Защищённые методы

- `@GETProtectedMethod`
- `@QUERYProtectedMethod`
- `@POSTProtected`
- `@PUTProtectedMethod`
- `@PATCHProtectedMethod`
- `@DELETEProtectedMethod`

Дополнительно подключают `AuthJWTGuard` и `RolesGuard`, добавляют `@ApiBearerAuth` и проверяют роли.

```ts
@PATCHProtectedMethod({
  path: ':slug/publish',
  summary: 'Publish article',
  operationDesc: 'Publishes an article',
  roles: [Roles.ADMIN],
})
async publishArticle(...) { ... }
```

### `@ValidateInputParam`

Извлекает access-токен из заголовка `Authorization` и формирует `ValidateInput` для gRPC:

```ts
const accessToken = authHeader?.replace('Bearer ', '') || ''

return {
  accessToken,
  session: {
    ip: request.ip,
    device: ...,
    browser: ...,
    os: ...,
  },
}
```

Данные сессии (`device`, `browser`, `os`) определяются из `User-Agent` через `ua-parser-js`, `ip` — из HTTP-запроса. Отдельные заголовки `x-device`, `x-os`, `x-browser`, `x-ip` не используются.

## gRPC-клиенты

`GatewayControllersModule` регистрирует клиентов для всех микросервисов:

| Клиент         | Пакет     | Proto-файл             | ENV                      | Значение по умолчанию   |
| -------------- | --------- | ---------------------- | ------------------------ | ----------------------- |
| `AUTH_CLIENT`    | `auth`    | `proto/auth.proto`    | `TAVERN_AUTH_GRPC_URL`    | `auth-service:5000`    |
| `PROFILE_CLIENT` | `profile` | `proto/profile.proto` | `TAVERN_PROFILE_GRPC_URL` | `profile-service:5000` |
| `EVENT_CLIENT`   | `event`   | `proto/event.proto`   | `TAVERN_EVENT_GRPC_URL`   | `event-service:5000`   |
| `BLOG_CLIENT`    | `blog`    | `proto/blog.proto`    | `TAVERN_BLOG_GRPC_URL`    | `blog-service:5000`    |
| `LOG_CLIENT`     | `log`     | `proto/log.proto`     | `TAVERN_LOG_GRPC_URL`     | `log-service:5000`     |

`GatewayAuthorizationModule` отдельно регистрирует `AUTH_CLIENT` для проверки JWT и ролей.

## Форматы ответов

Успешный ответ оборачивается `ResponseInterceptor`:

```json
{
  "status": "success",
  "date": "01.11.2026",
  "time": "12:00:00",
  "path": "/api/...",
  "data": {},
  "duration": "12ms"
}
```

Ошибка оборачивается `AllExceptionsFilter`:

```json
{
  "status": "error",
  "timestamp": "2026-11-01T12:00:00.000Z",
  "path": "/api/...",
  "method": "GET",
  "message": "Error description",
  "duration": "5ms"
}
```

gRPC-статусы преобразуются в HTTP-коды: `NOT_FOUND` → `404`, `ALREADY_EXISTS` → `409`, `INVALID_ARGUMENT` → `400`, `PERMISSION_DENIED` → `403`, `UNAUTHENTICATED` → `401`, `UNAVAILABLE` → `503`.

## ENV-переменные

- **TAVERN_GATEWAY_HTTP_PORT** — порт HTTP (по умолчанию 3000)
- **TAVERN_GATEWAY_CORS_ORIGINS** — разрешённые origin через запятую
- **TAVERN_GATEWAY_WINDOW_MS_MINUTES** — окно rate limit в минутах (по умолчанию 15)
- **TAVERN_GATEWAY_REQUEST_LIMIT** — количество запросов на окно (по умолчанию 1000)
- **TAVERN_JWT_SECRET** — JWT-секрет для проверки access-токенов
- **TAVERN_AUTH_GRPC_URL** — адрес auth-сервиса
- **TAVERN_PROFILE_GRPC_URL** — адрес profile-сервиса
- **TAVERN_EVENT_GRPC_URL** — адрес event-сервиса
- **TAVERN_BLOG_GRPC_URL** — адрес blog-сервиса
- **TAVERN_LOG_GRPC_URL** — адрес log-сервиса
- **TAVERN_REDIS_URL** — URL Redis
- **TAVERN_REDIS_PASSWORD** — пароль Redis

## Переменные окружения для клиента

Для защищённых HTTP-запросов достаточно заголовка:

```http
Authorization: Bearer <accessToken>
```

Данные сессии gateway формирует самостоятельно из `User-Agent` и IP-адреса запроса.

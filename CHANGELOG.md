# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Planned

- Event microservice (core platform service)
- Chat microservice with WebSocket support on gateway
- File microservice (media upload)
- Log microservice (audit consumers)
- Mail microservice (email delivery)
- Forum microservice
- Blog microservice
- Appeals microservice
- Client libraries for Vue frontend
- End-to-end tests for auth and profile flows
- Unified `docker-compose.yml` for one-command deployment of the entire stack
- CI/CD pipeline (Gitea Actions)
- Grafana + Prometheus monitoring stack

## 0.2.1 - 2026-10-09

### Changed

- Restructured monorepo:
  - `apps/` split into `server/` (NestJS) and `client/` (Vue)
  - `libs/` split into `core-libs/` (shared types, enums, configs), `server-libs/` (NestJS-specific), and future `client-libs/` (Vue-specific)
- Split `gateway-core` into five packages:
  - `@org/gateway-decorators` — method decorators (`@GETProtectedMethod`, `@QUERYProtectedMethod`, etc.)
  - `@org/gateway-dto` — HTTP DTOs
  - `@org/gateway-map` — gRPC ↔ HTTP mapping services
  - `@org/gateway-controllers` — HTTP controllers
  - `@org/gateway-authorization` — auth guards, strategies, cookie service
- Split shared types into three packages:
  - `@org/base-types` — pagination, common primitives
  - `@org/grpc-types` — gRPC contracts (`AuthServiceContract`, `ProfileServiceContract`, etc.)
  - `@org/shared-types` — domain types shared between frontend and backend
- Renamed all server libraries to consistent naming: `<domain>-<layer>` (e.g. `auth-authorization-core`, `profile-profiles-feature`, `profile-reputation-feature`)
- Grouped auth libraries: `auth-authorization-core`, `auth-authorization-feature`, `auth-authorization-utils`, `auth-session-feature`, `auth-token-feature`, `auth-user-feature`
- Grouped profile libraries: `profile-database`, `profile-utils`, `profile-profiles-feature`, `profile-activity-feature`, `profile-reputation-feature`, `profile-rmq-handler`

### Fixed

- Docker builds for all services: updated `COPY` paths to match the new monorepo structure (`apps/server/*` → `server/*`, `libs/*` → `core-libs/*` / `server-libs/*`)
- Db-Migrator Dockerfile: unified path prefixes for both auth and profile Prisma schemas

## 0.2.0 - 2026-10-08

### Added

#### Profile microservice

- Full profile management cycle: creation on registration (via RMQ), view own profile, public view by nickname, advanced view by nickname (ADMIN/MODERATOR), update profile data
- Reputation system based on event-sourcing:
  - `reputationScore` aggregate in `Profile`
  - `Reputation` log table with action, message, score, createdAt
  - Scoring via `ProfileReputationUtil` with configurable scores through ENV
- Activity system based on event-sourcing:
  - `currentActivity` aggregate in `Profile` (`ACTIVE`, `INACTIVE`, `BLOCKED`)
  - `ProfileActivity` log table with status and createdAt
  - Automatic status updates via RMQ events from auth
- Redis caching for point profile queries:
  - Separate cache keys for base and advanced output
  - TTL configurable via ENV (default 300 seconds)
  - Cache invalidation on profile update (old and new nickname)
  - Fallback to database when Redis is unavailable
- Full type safety for gRPC and HTTP contracts
- Validation through `AuthCoreModule` — shared SDK with auth service

#### Activity service

- `GetMyLogs` — own activity logs
- `GetActivityByNickname` — activity logs by nickname (ADMIN/MODERATOR)
- Activity pagination with echo of `activityType` filter

#### Reputation service

- `GetMyLogs` — own reputation logs
- `GetReputationByNickname` — reputation logs by nickname (public)
- Reputation pagination with echo of `action` filter

#### RMQ consumers (from auth)

- `AUTH_REGISTER` — create profile + first activity log
- `USER_BLOCK` — set `BLOCKED`, decrement reputation, create activity and reputation logs
- `USER_UNBLOCK` — set `ACTIVE`, increment reputation, create activity and reputation logs
- `USER_SET_INACTIVE` — set `INACTIVE`, create activity log
- `USER_SET_ACTIVE` — set `ACTIVE`, create activity log
- `USER_EMAIL_CHANGE` — update email in profile
- `USER_DELETED` — delete profile (cascade deletes reputation, activity, socials)

#### Profile SDK

- `ProfileDatabaseUtil` — database operations with query builders
- `ProfileValidationUtil` — domain validations (existence, unique nickname, date ranges, reputation ranges)
- `ProfileReputationUtil` — reputation scoring from ENV
- `ProfileUpdateStatusHelper` — unified status change with reputation and activity logs
- `ProfileCacheUtil` — Redis cache with fallback
- `ProfileMapUtil` — domain ↔ gRPC mapping
- `ProfileMessagesUtil` — RMQ events to log service

#### API Gateway integration

- `ProfileController` — 6 HTTP endpoints for profile operations
- `ActivityController` — 2 HTTP endpoints for activity logs
- `ReputationController` — 2 HTTP endpoints for reputation logs
- `ProfileGatewayMapService` — enum mapping via `Replace<T, R>` (gRPC number ↔ domain string)
- Public, authorized, and moderator-only methods separated via custom decorators

#### Infrastructure

- `services/profile` Dockerfile with multi-stage build (builder / deps / worker)
- Non-root user in Docker container
- `db_migrator` handles both auth and profile databases (5 + 4 migrations)
- Docker Compose test configuration with 7 services (2 PostgreSQL, Redis, RabbitMQ, auth, profile, gateway) + migrator
- Healthchecks for all infrastructure services with `condition: service_healthy`
- `condition: service_completed_successfully` for migrator dependency

#### Documentation

- `docs/profile.md` with implemented features, ENV variables, security, lifecycle, method tables, RMQ events, and caching strategy
- Updated README with link to `docs/profile.md`
- Bruno collection for profile gRPC methods (10 methods in 3 folders: Profile, Activity, Reputation)

### Changed

- `ProfileUpdateStatusHelper` unified into `manipulateBlock` and `manipulateActivity` methods
- `ProfileDatabaseUtil` extended with query builders for reputation and activity
- All enums mapped consistently via `ACTIVITY_TO_GRPC` / `GRPC_TO_ACTIVITY`, `ACTIONS_TO_GRPC` / `GRPC_TO_ACTIONS`
- `ProfileMapUtil` split into `mapBase` and `mapAdvanced` to prevent private field leakage
- `Profile` schema: added `description`, `birthDate` fields
- `Reputation` schema: `Actions` enum without `FRIENDSHIP` (reserved for future)

### Fixed

- Date validation through `DateMapUtil` in advanced pagination filters and `UpdateProfile`
- Enum field names in proto aligned with TypeScript types (`activityType`, `actions`)
- Idempotency in `createProfile` — check existing profile before creation
- `updateManyAndReturn` with status guard to prevent duplicate reputation decrements
- PostgreSQL volume mount path (`/var/lib/postgresql/data`)

## 0.1.0 - 2026-09-27

### Added

#### Authorization microservice

- Full authentication cycle: registration, login, token refresh, logout
- JWT-based access tokens (HS256) and refresh tokens with rotation
- Refresh token hashing with argon2id before storage
- Password hashing with argon2id (timeCost 3, memoryCost 64MB, parallelism 4)
- Session management: create, list, rename, delete, delete all
- Password recovery flow: forgot-password, reset-password via email token
- Token management: paginated list, revoke, delete, cleanup inactive
- User management: block, unblock, promote, demote, change email, change password, deactivate, delete account
- Redis-based session cache with TTL equal to access token TTL
- Role-based access control: USER, ADMIN, MODERATOR
- Session validation by device, OS, and browser fingerprint
- Automatic session cleanup on user block or deactivation

#### API Gateway

- HTTP-to-gRPC proxy layer
- Custom method decorators: `@GETProtectedMethod`, `@PATCHProtectedMethod`, `@DELETEProtectedMethod`, `@QUERYProtectedMethod`, `@PUTProtectedMethod`
- Automatic DTO validation via class-validator
- `@ValidateInputParam` decorator to extract access token and session headers
- Auto-generated Swagger documentation
- Custom ExceptionFilter for unified error responses
- Custom ResponseInterceptor for unified success responses
- HTTP request logging
- Rate limiting via `@nestjs/throttler`
- CORS, compression, cookie parser

#### SDK for other microservices

- `@org/auth-core` package exporting `AuthValidateService`
- Methods: `Validate` and `ValidateWithRoles` for token and role validation
- Shared `AuthCoreModule` importable by any microservice

#### Shared libraries

- `@org/types` with declarative gRPC contracts
- Generic types: `Protected<T>`, `WithSession<T>`, `Replace<T, R>`
- `@org/dto` for HTTP DTOs
- `@org/auth-database` for Prisma client and schema
- `@org/shared-utils` for common utilities (PaginationUtil, StringValidationUtil, DateMapUtil, RmqLoggerUtil)
- `@org/rmq-config` for RabbitMQ configuration
- `@org/bootstrap` for shared bootstrap logic

#### Infrastructure

- Dockerfile for API Gateway (multi-stage, non-root user)
- Dockerfile for Auth Microservice (multi-stage, non-root user)
- Dockerfile for DB migrator (Prisma migrate deploy)
- `docker-compose.infra.yml` with PostgreSQL, Redis, RabbitMQ, and migrator
- Healthchecks for all infrastructure services
- Database migration job with `service_completed_successfully` dependency

#### Tooling

- Nx monorepo with shared libraries
- Workspace setup script: `scripts/dev-workspace.setup.sh`
- Bruno collection for gRPC method testing
- Swagger UI for HTTP method testing
- Strict TypeScript configuration (no `any` in the codebase)
- ESLint + Prettier

#### Documentation

- `README.md` with quick start, manual installation, tech stack, and troubleshooting
- `docs/auth.md` with implemented features, ENV variables, security details, token lifecycle, and method reference
- `docs/gateway.md` with architecture, custom decorators, ENV variables, and client headers

### Security

- Refresh tokens stored as argon2id hashes, never in plain text
- Access tokens signed with HS256 and verified with algorithm whitelist
- Session validation includes device, OS, and browser fingerprint
- Blocked and inactive users have all sessions invalidated
- Redis payload cache keyed by user ID and session ID

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Planned

- Chat microservice with WebSocket support on gateway
- File microservice (media upload)
- Log microservice (audit consumers and log ingestion)
- Blog microservice (article API on top of the prepared database schema)
- Forum microservice
- Appeals microservice
- Remaining Vue client features: event catalog, event page, profile, and admin UI
- End-to-end tests for auth, profile, event, and mail flows
- Grafana + Prometheus monitoring stack

## 0.3.5 - 2026-10-27

### Added

#### Mail microservice

- Mail microservice based on NestJS, RabbitMQ, and `@nestjs-modules/mailer` with EJS templates.
- Central `@org/mail-handler` service for sending templated emails with configurable sender, SMTP transport, and base template variables (`link`, `year`).
- `@org/mail-auth-handler` consumers for auth and user events:
  - Authorization events: `user.registered`, `user.login`, `user.forgot.password`, `user.restore.password`
  - User admin events: `user.block`, `user.unblock.early`, `user.change.email`, `user.change.password`, `user.active`, `user.deleted`
- EJS email templates for auth flows (register, login, forgot/reset password, block, unblock, set active, delete, change email to old/new, change password) with shared partials and theme.
- Mailpit service added to local Docker Compose for email testing.
- Mail microservice added to Docker Compose and CI build/push scripts with a dedicated Dockerfile.
- Mail configuration variables added to environment examples.

### Changed

- Docker Compose and build scripts now include the mail microservice.
- Environment examples extended with mail SMTP/client configuration.

## 0.3.0 - 2026-10-26

### Added

#### Event microservice

- Full event lifecycle management: draft creation, publication, cancellation, completion, join-lock toggling, editing, deletion, and ownership transfer between organizers.
- Public and private event catalogs with search, date range, place range, tag, and status filters (status is available in
  private catalogs). Pagination responses include the applied filters.
- Public, private, and organizer views of an event by slug. Events past their date are automatically moved to `FINISHED` when accessed publicly.
- Participant-aware event lists: public and private events of a specific user, events organized by the current user, and events the current user participates in.
- Event tags with URL-safe unique slugs, descriptions, colors, admin CRUD, paginated search, and a detailed view containing the nearest published events.
- Event participants:
  - joining and leaving with an optional note
  - organizer-side addition and removal
  - participant status changes and participant lists filtered by status
  - a waiting list that is promoted automatically when a place becomes available
- Transactional participation flow with atomic place allocation, waiting-list counters, and a Redis distributed lock per event to prevent overbooking and race conditions.
- Redis caching for public event pages, user event pages, and tag details with configurable TTLs and invalidation on event and participation changes.
- Event user snapshots kept in sync with auth and profile through RabbitMQ: registration, nickname changes, blocking, early
  unblocking, active/inactive state changes, and deletion. Blocking an organizer reassigns their published events to the
  administrator; deletion anonymizes the snapshot.
- RabbitMQ audit messages for event, tag, and participant actions, plus profile notifications for participant status changes.
- Event database schema with 10 migrations covering events, tags, participants, user snapshots, statuses, waiting lists, join locks, and unique slugs.
- Profile integration: participants with status `FIXED` receive an `EVENT` reputation entry.

#### Profile microservice

- Admin-only reputation adjustment endpoint (`AddReputation`) that creates a `CUSTOM` reputation log entry. Administrators
  cannot adjust their own reputation, and the target profile is validated before the change.
- Profile list search now matches both nickname and user ID.
- Participant status events from the event service create reputation entries and invalidate the profile cache.
- Profile pagination ordering is deterministic.

#### API Gateway

- Event HTTP API with 31 endpoints and DTOs:
  - 5 tag endpoints
  - 18 event endpoints
  - 8 participant endpoints
- Gateway mapping between shared HTTP types and gRPC contracts, including enum conversion for event and participant statuses.
- Swagger documentation with per-operation summaries, descriptions, role requirements, and response metadata for event, tag, participant, and reputation controllers.
- Shared route definitions now drive controller paths for auth, profile, and event APIs.
- `AddReputation` endpoint for administrators.

#### Vue client

- Initial Vue 3 + TypeScript + Vite application (`client/web`) with Tailwind CSS, Vue Router, and Pinia.
- Client libraries for auth, main, and admin layouts and pages: a functional registration page, a login page scaffold, and home/admin pages.
- Route guards based on authentication state and roles, with lazy-loaded routes and layout composition.
- API client built on `ofetch` with:
  - bearer token injection
  - automatic token refresh on `401` with single-flight protection
  - request retries for transient server errors
  - unwrapping of the gateway response envelope and normalized error handling
- Pinia auth store with session bootstrap, token refresh, current user/profile loading, logout, and authentication state.
- Composable HTTP helpers for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `QUERY`, plus shared client-side validation messages and rules.

#### Shared libraries

- New `@org/nest-launcher` package replacing `@org/bootstrap`, with unified `monolith()` and `microservice<T>()`
  bootstrappers, configurable HTTP/gRPC/RabbitMQ transports, logging, exception filters, response interceptors, and
  Swagger/validation setup.
- New core libraries:
  - `@org/routes-config` — typed HTTP route constants
  - `@org/rmq-messages` — typed RabbitMQ message contracts and routing keys
  - `@org/validation-config` — shared validation constraints and domain limits
  - `@org/validation-messages` — centralized API and event messages
  - `@org/client-messages` — client-side validation messages
  - `@org/enums` and `@org/base-types` — extended shared enums and primitives
- Expanded `@org/grpc-types` and `@org/shared-types` with auth, profile, event, tag, participant, and reputation contracts.
- `SlugUtil` for URL-safe slugs and pagination utilities shared by auth, profile, and event services.
- Blog and log Prisma schemas with generated clients and database libraries, ready for the corresponding microservices.

#### Infrastructure and tooling

- Unified `docker-compose.yml` for the complete stack: RabbitMQ, Redis, five PostgreSQL databases (auth, profile, event,
  blog, log), auth/profile/event services, gateway, and a database migrator.
- `docker-compose.infra.yml` with only the infrastructure services for local development.
- Event service Dockerfile and database migration support for all five schemas.
- Environment-driven Docker image tags and a shared build/push script; Gitea Actions workflows for code checks, dev image builds, and release tag builds.
- Code quality workflows now generate all database clients and run ESLint, TypeScript type checking, and Prettier checks.
- Root scripts for workspace setup, cache cleanup, database migration, and logging dev output to files.
- Docker images moved to Node.js 26.3, PostgreSQL 18.6, Redis 8.10.2, and RabbitMQ 4.3.6.

#### Documentation

- `docs/event.md` with event, tag, and participant behavior, validation rules, statuses, and API contracts.
- Updated README with the current architecture, Vue client, event service, environment variables, and deployment instructions.
- Bruno collections for event tags, events, participants, and reputation operations.
- Expanded Swagger documentation and `.env.example` files for the new services and databases.

### Changed

- All NestJS applications now start through `@org/nest-launcher`; gRPC and RabbitMQ transports can be enabled independently per microservice.
- Event data model finalized around unique slugs, `DRAFT`/`PUBLISHED`/`CANCELLED`/`FINISHED` statuses, participant
  statuses `WAITLIST`/`RECORDED`/`FIXED`/`NOT_COME`, waiting counters, join locks, and the `isFixed` flag.
- Event ownership checks are performed in the service layer and role checks at the gateway; private event access and administrative actions are audited through RabbitMQ.
- HTTP DTOs for auth, profile, and event use centralized validation rules and messages; Swagger decorators and DTO metadata were aligned across controllers.
- Email is no longer duplicated in the profile and event databases. The corresponding columns were removed from profiles
  and event user snapshots, while auth remains the source of truth for email.
- Event and participant reads use deterministic ordering and echo pagination filters in responses.
- Docker Compose service names, container names, volume paths, and port exposure were aligned for local development;
  development containers no longer publish service ports unless required.
- Database migration paths and gRPC service URLs were aligned with the new service names and Compose topology.

### Fixed

- Profile cache handling around profile updates, advanced profile reads, and RMQ consumers, including invalidation before change notifications.
- RabbitMQ handler module connections and event participant status propagation to the profile service.
- Event status handling and participant counters during joins, leaves, removals, and waitlist promotion.
- Swagger DTO metadata and decorators for event endpoints.
- Pagination filters and responses for public/private events, participants, and participated events.
- Docker networking for the event database and PostgreSQL volume mounts.
- Database migrator image paths and CI image build/push scripts.
- Import paths, TypeScript project references, ESLint configuration, and Prettier formatting across the monorepo.

### Removed

- Placeholder microservices for appeals, chat, content, file, and forum, along with their unused gRPC protos.
- The unused `mail.proto`; the mail service scaffold remains.
- `docker-compose.test.yml`, replaced by `docker-compose.yml`.
- Email fields from the profile and event databases and from event user snapshots.

### Security

- Event access is guarded by authentication, role checks, organizer ownership checks, and service-level validation.
- Participant places are allocated atomically under a Redis lock, preventing oversubscription and duplicate participation.
- Blocked or inactive users cannot be added to events; blocking an organizer reassigns published events to an administrator.
- Administrative reputation adjustments require the `ADMIN` role, reject self-adjustment, and emit audit messages.

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

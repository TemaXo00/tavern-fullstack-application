FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY server/log ./server/log
COPY proto/log.proto ./proto/log.proto
COPY proto/log ./proto/log
COPY proto/shared ./proto/shared

COPY server-libs/auth-authorization-core ./server-libs/auth-authorization-core
COPY server-libs/auth-authorization-utils ./server-libs/auth-authorization-utils
COPY server-libs/shared-utils ./server-libs/shared-utils
COPY server-libs/auth-database ./server-libs/auth-database

COPY server-libs/log-database ./server-libs/log-database
COPY server-libs/log-util ./server-libs/log-util
COPY server-libs/log-feature ./server-libs/log-feature
COPY server-libs/log-auth-handler ./server-libs/log-auth-handler
COPY server-libs/log-blog-handler ./server-libs/log-blog-handler
COPY server-libs/log-event-handler ./server-libs/log-event-handler
COPY server-libs/log-profile-handler ./server-libs/log-profile-handler

COPY core-libs/nest-launcher ./core-libs/nest-launcher
COPY core-libs/base-types ./core-libs/base-types
COPY core-libs/grpc-types ./core-libs/grpc-types
COPY core-libs/enums ./core-libs/enums
COPY core-libs/rmq-config ./core-libs/rmq-config
COPY core-libs/rmq-messages ./core-libs/rmq-messages
COPY core-libs/validation-config ./core-libs/validation-config
COPY core-libs/validation-messages ./core-libs/validation-messages

RUN npm ci
RUN npm run log-db:generate
RUN npm run auth-db:generate
RUN npm run nx:sync
RUN npx nx build log

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/server/log/dist ./dist
COPY --from=builder /app/proto ./proto

COPY --from=builder /app/server-libs/auth-authorization-utils/dist ./node_modules/@org/auth-authorization-utils
COPY --from=builder /app/server-libs/auth-authorization-core/dist ./node_modules/@org/auth-authorization-core
COPY --from=builder /app/server-libs/shared-utils/dist ./node_modules/@org/shared-utils
COPY --from=builder /app/server-libs/auth-database/dist ./node_modules/@org/auth-database

COPY --from=builder /app/server-libs/log-database/dist ./node_modules/@org/log-database
COPY --from=builder /app/server-libs/log-util/dist ./node_modules/@org/log-util
COPY --from=builder /app/server-libs/log-feature/dist ./node_modules/@org/log-feature
COPY --from=builder /app/server-libs/log-auth-handler/dist ./node_modules/@org/log-auth-handler
COPY --from=builder /app/server-libs/log-blog-handler/dist ./node_modules/@org/log-blog-handler
COPY --from=builder /app/server-libs/log-event-handler/dist ./node_modules/@org/log-event-handler
COPY --from=builder /app/server-libs/log-profile-handler/dist ./node_modules/@org/log-profile-handler

COPY --from=builder /app/core-libs/nest-launcher/dist ./node_modules/@org/nest-launcher
COPY --from=builder /app/core-libs/base-types/dist ./node_modules/@org/base-types
COPY --from=builder /app/core-libs/grpc-types/dist ./node_modules/@org/grpc-types
COPY --from=builder /app/core-libs/enums/dist ./node_modules/@org/enums
COPY --from=builder /app/core-libs/rmq-config/dist ./node_modules/@org/rmq-config
COPY --from=builder /app/core-libs/rmq-messages/dist ./node_modules/@org/rmq-messages
COPY --from=builder /app/core-libs/validation-config/dist ./node_modules/@org/validation-config
COPY --from=builder /app/core-libs/validation-messages/dist ./node_modules/@org/validation-messages

COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]

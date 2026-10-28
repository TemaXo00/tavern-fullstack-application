FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY server/blog ./server/blog
COPY proto/blog.proto ./proto/blog.proto
COPY proto/blog ./proto/blog
COPY proto/shared ./proto/shared

COPY server-libs/auth-authorization-core ./server-libs/auth-authorization-core
COPY server-libs/auth-authorization-utils ./server-libs/auth-authorization-utils
COPY server-libs/shared-utils ./server-libs/shared-utils
COPY server-libs/auth-database ./server-libs/auth-database

COPY server-libs/blog-database ./server-libs/blog-database
COPY server-libs/blog-utils ./server-libs/blog-utils
COPY server-libs/blog-tag-feature ./server-libs/blog-tag-feature
COPY server-libs/blog-article-feature ./server-libs/blog-article-feature
COPY server-libs/blog-rmq-handler ./server-libs/blog-rmq-handler

COPY core-libs/nest-launcher ./core-libs/nest-launcher
COPY core-libs/base-types ./core-libs/base-types
COPY core-libs/grpc-types ./core-libs/grpc-types
COPY core-libs/enums ./core-libs/enums
COPY core-libs/rmq-config ./core-libs/rmq-config
COPY core-libs/rmq-messages ./core-libs/rmq-messages
COPY core-libs/validation-config ./core-libs/validation-config
COPY core-libs/validation-messages ./core-libs/validation-messages

RUN npm ci
RUN npm run blog-db:generate
RUN npm run auth-db:generate
RUN npm run nx:sync
RUN npx nx build blog

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/server/blog/dist ./dist
COPY --from=builder /app/proto ./proto

COPY --from=builder /app/server-libs/auth-authorization-utils/dist ./node_modules/@org/auth-authorization-utils
COPY --from=builder /app/server-libs/auth-authorization-core/dist ./node_modules/@org/auth-authorization-core
COPY --from=builder /app/server-libs/shared-utils/dist ./node_modules/@org/shared-utils
COPY --from=builder /app/server-libs/auth-database/dist ./node_modules/@org/auth-database

COPY --from=builder /app/server-libs/blog-database/dist ./node_modules/@org/blog-database
COPY --from=builder /app/server-libs/blog-utils/dist ./node_modules/@org/blog-utils
COPY --from=builder /app/server-libs/blog-tag-feature/dist ./node_modules/@org/blog-tag-feature
COPY --from=builder /app/server-libs/blog-article-feature/dist ./node_modules/@org/blog-article-feature
COPY --from=builder /app/server-libs/blog-rmq-handler/dist ./node_modules/@org/blog-rmq-handler

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

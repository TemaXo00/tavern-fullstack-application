FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY server/gateway ./server/gateway
COPY proto ./proto

COPY server-libs/auth-authorization-core ./server-libs/auth-authorization-core
COPY server-libs/auth-utils ./server-libs/auth-utils
COPY server-libs/auth-database ./server-libs/auth-database
COPY server-libs/shared-utils ./server-libs/shared-utils

COPY core-libs/bootstrap ./core-libs/bootstrap
COPY core-libs/base-types ./core-libs/base-types
COPY core-libs/grpc-types ./core-libs/grpc-types
COPY core-libs/shared-types ./core-libs/shared-types
COPY core-libs/enums ./core-libs/enums

COPY server-libs/gateway-decorators ./server-libs/gateway-decorators
COPY server-libs/gateway-dto ./server-libs/gateway-dto
COPY server-libs/gateway-map ./server-libs/gateway-map
COPY server-libs/gateway-controllers ./server-libs/gateway-controllers
COPY server-libs/gateway-authorization ./server-libs/gateway-authorization

RUN npm ci
RUN npm run auth-db:generate
RUN npm run nx:sync
RUN npx nx build gateway

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/server/gateway/dist ./dist
COPY --from=builder /app/proto ./proto

COPY --from=builder /app/server-libs/auth-authorization-core/dist ./node_modules/@org/auth-authorization-core
COPY --from=builder /app/server-libs/auth-utils/dist ./node_modules/@org/auth-utils
COPY --from=builder /app/server-libs/auth-database/dist ./node_modules/@org/auth-database
COPY --from=builder /app/server-libs/shared-utils/dist ./node_modules/@org/shared-utils

COPY --from=builder /app/core-libs/bootstrap/dist ./node_modules/@org/bootstrap
COPY --from=builder /app/core-libs/base-types/dist ./node_modules/@org/base-types
COPY --from=builder /app/core-libs/grpc-types/dist ./node_modules/@org/grpc-types
COPY --from=builder /app/core-libs/shared-types/dist ./node_modules/@org/shared-types
COPY --from=builder /app/core-libs/enums/dist ./node_modules/@org/enums

COPY --from=builder /app/server-libs/gateway-decorators/dist ./node_modules/@org/gateway-decorators
COPY --from=builder /app/server-libs/gateway-dto/dist ./node_modules/@org/gateway-dto
COPY --from=builder /app/server-libs/gateway-map/dist ./node_modules/@org/gateway-map
COPY --from=builder /app/server-libs/gateway-controllers/dist ./node_modules/@org/gateway-controllers
COPY --from=builder /app/server-libs/gateway-authorization/dist ./node_modules/@org/gateway-authorization

COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]

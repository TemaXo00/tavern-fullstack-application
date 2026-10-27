FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY server/mail ./server/mail
COPY mail-templates ./mail-templates

COPY server-libs/mail-handler ./server-libs/mail-handler
COPY server-libs/mail-auth-handler ./server-libs/mail-auth-handler

COPY core-libs/nest-launcher ./core-libs/nest-launcher
COPY core-libs/rmq-messages ./core-libs/rmq-messages
COPY core-libs/base-types ./core-libs/base-types
COPY core-libs/grpc-types ./core-libs/grpc-types

RUN npm ci
RUN npm run nx:sync
RUN npx nx build mail

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/server/mail/dist ./dist
COPY --from=builder /app/mail-templates ./mail-templates

COPY --from=builder /app/server-libs/mail-handler/dist ./node_modules/@org/mail-handler
COPY --from=builder /app/server-libs/mail-auth-handler/dist ./node_modules/@org/mail-auth-handler

COPY --from=builder /app/core-libs/nest-launcher/dist ./node_modules/@org/nest-launcher
COPY --from=builder /app/core-libs/rmq-messages/dist ./node_modules/@org/rmq-messages
COPY --from=builder /app/core-libs/base-types/dist ./node_modules/@org/base-types
COPY --from=builder /app/core-libs/grpc-types/dist ./node_modules/@org/grpc-types

COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]

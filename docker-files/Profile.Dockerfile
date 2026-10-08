FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY services/profile ./services/profile
COPY proto/profile.proto ./proto/profile.proto
COPY proto/profile ./proto/profile
COPY proto/shared ./proto/shared
# Authorization deps
COPY libs/auth-core ./libs/auth-core
COPY libs/auth-core-utils ./libs/auth-core-utils
COPY libs/auth-database ./libs/auth-database
COPY libs/shared-utils ./libs/shared-utils
# Application deps
COPY libs/bootstrap ./libs/bootstrap
COPY libs/types ./libs/types
# Microservices deps
COPY libs/rmq-config ./libs/rmq-config
# Profile Deps
COPY libs/profile-database ./libs/profile-database
COPY libs/profile-utils ./libs/profile-utils
COPY libs/profile-feature ./libs/profile-feature
COPY libs/profile-rmq-feature ./libs/profile-rmq-feature
COPY libs/activity-feature ./libs/activity-feature
COPY libs/reputation-feature ./libs/reputation-feature

RUN npm ci
RUN npm run profile-db:generate
RUN npm run auth-db:generate
RUN npm run nx:sync
RUN npx nx build profile

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/profile/dist ./dist
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/libs/auth-core/dist ./node_modules/@org/auth-core
COPY --from=builder /app/libs/auth-core-utils/dist ./node_modules/@org/auth-core-utils
COPY --from=builder /app/libs/auth-database/dist ./node_modules/@org/auth-database
COPY --from=builder /app/libs/profile-database/dist ./node_modules/@org/profile-database
COPY --from=builder /app/libs/shared-utils/dist ./node_modules/@org/shared-utils
COPY --from=builder /app/libs/bootstrap/dist ./node_modules/@org/bootstrap
COPY --from=builder /app/libs/types/dist ./node_modules/@org/types
COPY --from=builder /app/libs/rmq-config/dist ./node_modules/@org/rmq-config
COPY --from=builder /app/libs/profile-utils/dist ./node_modules/@org/profile-utils
COPY --from=builder /app/libs/profile-feature/dist ./node_modules/@org/profile-feature
COPY --from=builder /app/libs/profile-rmq-feature/dist ./node_modules/@org/profile-rmq-feature
COPY --from=builder /app/libs/activity-feature/dist ./node_modules/@org/activity-feature
COPY --from=builder /app/libs/reputation-feature/dist ./node_modules/@org/reputation-feature
COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]

FROM node:26.3-alpine

WORKDIR /app

RUN npm install --no-package-lock prisma@7.9.1 dotenv

COPY scripts/migrator.sh ./migrator.sh

COPY app/server-libs/auth-database/prisma ./auth-database/prisma
COPY app/server-libs/auth-database/prisma.config.ts ./auth-database/prisma.config.ts

COPY app/server-libs/profile-database/prisma ./profile-database/prisma
COPY app/server-libs/profile-database/prisma.config.ts ./profile-database/prisma.config.ts

COPY app/server-libs/event-database/prisma ./event-database/prisma
COPY app/server-libs/event-database/prisma.config.ts ./event-database/prisma.config.ts

COPY app/server-libs/blog-database/prisma ./blog-database/prisma
COPY app/server-libs/blog-database/prisma.config.ts ./blog-database/prisma.config.ts

COPY app/server-libs/log-database/prisma ./log-database/prisma
COPY app/server-libs/log-database/prisma.config.ts ./log-database/prisma.config.ts

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app && \
    chmod +x migrator.sh

USER nodejs

CMD ["./migrator.sh"]

#!/bin/sh

npx prisma migrate deploy --config ./auth-database/prisma.config.ts
npx prisma migrate deploy --config ./profile-database/prisma.config.ts
npx prisma migrate deploy --config ./event-database/prisma.config.ts
npx prisma migrate deploy --config ./blog-database/prisma.config.ts
npx prisma migrate deploy --config ./log-database/prisma.config.ts

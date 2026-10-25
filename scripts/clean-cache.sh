#!/bin/bash

cd app

rm -rf client/*/dist
rm -rf client-libs/*/dist
rm -rf core-libs/*/dist
rm -rf server/*/dist
rm -rf server-libs/*/dist

rm -rf server-libs/*-database/src/generated

rm -rf .nx
npm run nx:clean
rm -rf node_modules

npm ci
npm run auth-db:generate
npm run profile-db:generate
npm run event-db:generate
npm run blog-db:generate
npm run log-db:generate

#!/bin/bash

cd app

rm -rf client/*/dist
rm -rf client-libs/*/dist
rm -rf core-libs/*/dist
rm -rf server/*/dist
rm -rf server-libs/*/dist

rm -rf .nx
npm run nx:clean
rm -rf node_modules

npm ci

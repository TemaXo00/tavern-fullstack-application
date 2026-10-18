#!/usr/bin/env bash

set -euo pipefail

DOCKER_REGISTRY="${1:-}"
DOCKER_APPS_VERSION="${2:-}"

if [[ -z "$DOCKER_REGISTRY" || -z "$DOCKER_APPS_VERSION" ]]; then
  echo "Usage: $0 <DOCKER_REGISTRY> <DOCKER_APPS_VERSION>" >&2
  exit 1
fi

SERVICES=(
  "auth:Auth.Dockerfile:./app"
  "profile:Profile.Dockerfile:./app"
  "event:Event.Dockerfile:./app"
  "migrator:Db-Migrator.Dockerfile:."
  "gateway:Gateway.Dockerfile:./app"
)

echo "TAVERN Docker Containers Builder & Pusher"
echo "--------------------------------"

FAILED=()

for entry in "${SERVICES[@]}"; do
  IFS=':' read -r NAME DOCKERFILE CONTEXT <<< "$entry"
  IMAGE="${DOCKER_REGISTRY}/temaxo00/tavern-${NAME}:${DOCKER_APPS_VERSION}"

  echo "Build TAVERN ${NAME} Microservice"

  if docker build -f "docker-files/${DOCKERFILE}" -t "$IMAGE" "$CONTEXT"; then
    echo "${NAME} built successfully"
  else
    echo "${NAME} build failed"
    FAILED+=("$NAME")
    continue
  fi

  echo "Push TAVERN ${NAME} Microservice"

  if docker push "$IMAGE"; then
    echo "${NAME} pushed successfully"
  else
    echo "${NAME} push failed"
    FAILED+=("$NAME")
  fi
done

echo "--------------------------------"

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "Failed services: ${FAILED[*]}" >&2
  exit 1
fi

echo "All microservices built and pushed successfully!"

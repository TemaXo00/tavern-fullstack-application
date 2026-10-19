#!/usr/bin/env bash

set -euo pipefail

DOCKER_REGISTRY="${1:-}"
DOCKER_APPS_FIRST_TAG="${2:-}"
DOCKER_APPS_SECOND_TAG="${3:-}"

if [[ -z "$DOCKER_REGISTRY" || -z "$DOCKER_APPS_FIRST_TAG" || -z "$DOCKER_APPS_SECOND_TAG" ]]; then
  echo "Usage: $0 <DOCKER_REGISTRY> <DOCKER_APPS_FIRST_TAG> <DOCKER_APPS_SECOND_TAG>" >&2
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
  FIRST_IMAGE="${DOCKER_REGISTRY}/temaxo00/tavern-${NAME}:${DOCKER_APPS_FIRST_TAG}"
  SECOND_IMAGE="${DOCKER_REGISTRY}/temaxo00/tavern-${NAME}:${DOCKER_APPS_SECOND_TAG}"

  echo "Build TAVERN ${NAME} Microservice"

  if docker build -f "docker-files/${DOCKERFILE}" -t "$FIRST_IMAGE" -t "$SECOND_IMAGE" "$CONTEXT"; then
    echo "${NAME} built successfully"
  else
    echo "${NAME} build failed"
    FAILED+=("$NAME")
    continue
  fi

  echo "Push TAVERN ${NAME} Microservice"

  docker push "$FIRST_IMAGE"
  docker push "$SECOND_IMAGE"
done

echo "--------------------------------"

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "Failed services: ${FAILED[*]}" >&2
  exit 1
fi

echo "All microservices built and pushed successfully!"

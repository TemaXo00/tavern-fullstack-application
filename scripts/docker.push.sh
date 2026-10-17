#!/usr/bin/env bash

set -euo pipefail

DOCKER_REGISTRY="${1:-}"
DOCKER_APPS_VERSION="${2:-}"

if [[ -z "$DOCKER_REGISTRY" || -z "$DOCKER_APPS_VERSION" ]]; then
  echo "Usage: $0 <DOCKER_REGISTRY> <DOCKER_APPS_VERSION>" >&2
  exit 1
fi

SERVICES=(
  "auth"
  "profile"
  "event"
  "migrator"
  "gateway"
)

echo "TAVERN Docker Containers Pusher"
echo "--------------------------------"

FAILED=()

for NAME in "${SERVICES[@]}"; do
  IMAGE="${DOCKER_REGISTRY}/temaxo00/tavern-${NAME}:${DOCKER_APPS_VERSION}"

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

echo "All microservices pushed successfully!"

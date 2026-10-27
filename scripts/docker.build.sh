#!/usr/bin/env bash

set -euo pipefail

DOCKER_REGISTRY="${1:-}"
DOCKER_APPS_VERSION="${2:-}"

if [[ -z "$DOCKER_REGISTRY" || -z "$DOCKER_APPS_VERSION" ]]; then
  echo "Usage: $0 <DOCKER_REGISTRY> <DOCKER_APPS_VERSION>" >&2
  exit 1
fi

SERVICES=(
  "Auth:Auth.Dockerfile"
  "Profile:Profile.Dockerfile"
  "Event:Event.Dockerfile"
  "Mail:Mail.Dockerfile"
  "Migrator:Db-Migrator.Dockerfile"
  "Gateway:Gateway.Dockerfile"
)

echo "TAVERN Docker Containers Builder"
echo "--------------------------------"

FAILED=()

for entry in "${SERVICES[@]}"; do
  NAME="${entry%%:*}"
  DOCKERFILE="${entry##*:}"
  IMAGE="${DOCKER_REGISTRY}/temaxo00/tavern-$(echo "$NAME" | tr '[:upper:]' '[:lower:]'):${DOCKER_APPS_VERSION}"

  echo "Build TAVERN ${NAME} Microservice"

  if docker build -f "docker-files/${DOCKERFILE}" -t "$IMAGE" ./app; then
    echo "${NAME} built successfully"
  else
    echo "${NAME} build failed"
    FAILED+=("$NAME")
  fi
done

echo "--------------------------------"

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "Failed services: ${FAILED[*]}" >&2
  exit 1
fi

echo "All microservices built successfully!"

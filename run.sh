#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here"
if [ ! -f .env ]; then cp .env.sample .env; fi
docker compose up --build -d
echo "Frontend: http://localhost:3000"
echo "Gateway : http://localhost:8080"
echo "Postgres: localhost:5432"

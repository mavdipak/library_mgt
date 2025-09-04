# Library Service – Infra Guide

## Running Locally

1. Copy `.env.sample` -> `.env` and edit if needed.
2. Start all services:
   ```bash
   ./run.sh
   ```
3. Access:
   - Frontend: http://localhost:3000
   - Gateway:  http://localhost:8080
   - Postgres: localhost:5432

## Running Tests

### Unit Tests
Run Python unit tests inside the server container or locally:
```bash
pytest server/tests
```

### End-to-End Test Script
Make sure backend + gateway are running:
```bash
./tests/e2e.sh
```
This will:
- Check `/health` and `/ready`
- List members and books
- Borrow a book
- List loans
- Return a book
- List fines

## CI/CD
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
  - Unit tests (`pytest`)
  - End-to-end tests (`tests/e2e.sh`)
  - Docker build & push (only if tests pass)

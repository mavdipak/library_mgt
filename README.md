# 📚 Neighborhood Library Service

A full-stack microservice app to manage a neighborhood library, built with React (frontend), Express (gateway), Python gRPC (backend), and Postgres (database).

## Quickstart

1. Copy .env.sample to .env and edit if needed.
2. Start services:
   docker compose up --build -d
3. Open frontend: http://localhost:3000
4. Gateway API: http://localhost:8080



# sample data is available for testing  in db/init.sql at the end
that data will be inserted autometically with first run

or you can install it by directly getting into postgres container.
docker compose exec db psql -U libadmin -d librarydb


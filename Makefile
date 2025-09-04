.PHONY: up down logs build

up:
	docker compose up --build -d

down:
	docker compose down -v

logs:
	docker compose logs -f

build:
	docker compose build

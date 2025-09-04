# 📚 Neighborhood Library Service

A full-stack microservice app to manage a neighborhood library, built with **React (frontend)**, **Express (gateway)**, **Python gRPC (backend)**, and **Postgres (database)**.

---

## 🏗️ Architecture

React (Frontend, port 3000)
↓
Express Gateway (REST API, port 8080)
↓
Python gRPC Server (port 50051)
↓
Postgres Database (port 5432)

markdown

---

## 🚀 Features

- 👤 Manage members (create, list)  
- 📚 Manage books (create, list)  
- 📖 Borrow/Return books  
- ⏰ Track due dates and fines  
- ✅ Health checks (`/health`)  
- 🐳 Dockerized (multi-container with Compose)  

---

## 🔌 REST API (via Gateway)

Base URL: `http://localhost:8080`

| Endpoint         | Method | Description              | Example Request / Response |
|------------------|--------|--------------------------|-----------------------------|
| `/members`       | GET    | List all members         | `{"members":[{"id":1,"name":"Alice"}]}` |
| `/members`       | POST   | Create new member        | → `{"id":1,"name":"Alice"}` |
| `/books`         | GET    | List all books           | `{"books":[{"id":1,"title":"1984"}]}` |
| `/books`         | POST   | Add new book             | → `{"id":1,"title":"1984"}` |
| `/borrow`        | POST   | Borrow a book            | → `{"loan_id":5,"due_date":"2025-09-17"}` |
| `/return`        | POST   | Return a borrowed book   | → `{"fine":10}` |
| `/loans`         | GET    | List active loans        | `{"loans":[...]}` |
| `/health`        | GET    | Health check             | `{"status":"ok"}` |

---

## 🖥️ Backend (Python gRPC)

- **gRPC service** with Python 3.11  
- Business logic for members, books, loans, fines  
- **Configurable env vars**:
  - `LOAN_DAYS` → default 14 days  
  - `FINE_PER_DAY` → default 5  

---

## 🌐 Gateway (Node.js / Express)

- REST → gRPC translation  
- Uses `grpc` and `@grpc/proto-loader`  
- `cors` enabled for frontend communication  
- `/health` endpoint for probes  

---

## 🎨 Frontend (React + Tailwind)

Pages:
- 🔑 **Login** → pick a member to log in  
- ➕ **Create Member** → register new members  
- 📖 **Borrow Book** → borrow from available books  
- 📦 **Return Book** → return borrowed books  

Configured with:
```env
REACT_APP_API_BASE=http://localhost:8080
🗄️ Database (Postgres)
Tables:

members: id, name, email

books: id, title, author, available

loans: id, member_id, book_id, due_date, returned, fine

Seed data can be added via db/init.sql.

🛠️ Development
Start the stack
bash

docker compose up --build
Stop & cleanup
bash

docker compose down -v
Logs
bash

docker compose logs -f server
docker compose logs -f gateway
End-to-end test
bash

./tests/e2e.sh
✅ Example Workflow
Start stack with docker compose up.

Open frontend → http://localhost:3000.

Add a new member via Create Member.

Log in as that member.

Borrow a book.

Return it → fine is calculated if overdue.

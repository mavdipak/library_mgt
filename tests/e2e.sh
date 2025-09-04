#!/usr/bin/env bash
set -e

echo "🔍 Checking health..."
curl -s http://localhost:8080/health

echo "🔍 Checking readiness..."
curl -s http://localhost:8080/ready

echo "📚 Listing members..."
curl -s http://localhost:8080/members | jq

echo "📖 Listing books..."
curl -s http://localhost:8080/books | jq

echo "🛒 Borrowing book id=2 for member=1..."
curl -s -X POST http://localhost:8080/borrow -H "Content-Type: application/json"   -d '{"member_id":1,"book_id":2}' | jq

echo "📋 Listing loans..."
curl -s http://localhost:8080/members/1/loans | jq

echo "🔙 Returning loan id=1..."
curl -s -X POST http://localhost:8080/return -H "Content-Type: application/json"   -d '{"loan_id":1}' | jq

echo "💰 Listing fines..."
curl -s http://localhost:8080/members/1/fines | jq

echo "👤 Creating member..."
curl -s -X POST http://localhost:8080/members -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}' | jq


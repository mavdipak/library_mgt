FROM python:3.11-alpine AS builder
RUN apk add --no-cache build-base
WORKDIR /app
COPY server/requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.11-alpine
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=builder /install /usr/local

# Copy proto and generate stubs
COPY proto/ /app/proto/
RUN python -m grpc_tools.protoc -I/app/proto \
    --python_out=/app --grpc_python_out=/app \
    /app/proto/library.proto


# ✅ Copy server code *afterwards* but do not wipe /app
COPY server/ /app/server/

# Make sure Python can import from /app
ENV PYTHONPATH=/app

EXPOSE 50051
CMD ["python", "-m", "server.server"]


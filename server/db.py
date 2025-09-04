import os, time
from psycopg2 import pool

DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "librarydb")
DB_USER = os.getenv("DB_USER", "libadmin")
DB_PASS = os.getenv("DB_PASS", "libpass")

MAX_RETRIES = 5
WAIT = 2

connection_pool = None
for attempt in range(MAX_RETRIES):
    try:
        connection_pool = pool.SimpleConnectionPool(
            1, 20,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
        )
        if connection_pool:
            print("✅ Postgres connection pool created")
        break
    except Exception as e:
        print(f"DB connection failed (attempt {attempt+1}/{MAX_RETRIES}): {e}")
        time.sleep(WAIT * (attempt + 1))
else:
    raise RuntimeError("❌ Could not connect to DB after retries")

def get_conn():
    return connection_pool.getconn()

def put_conn(conn):
    connection_pool.putconn(conn)

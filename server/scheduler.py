from apscheduler.schedulers.background import BackgroundScheduler
from server.services.loans import calculate_fine
from server.db import get_conn, put_conn
from datetime import datetime

def check_overdues():
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, member_id, due_date FROM loans WHERE return_date IS NULL")
            rows = cur.fetchall()
            for loan_id, member_id, due_date in rows:
                fine = calculate_fine(due_date)
                if fine > 0:
                    # insert or update fine for loan - simple upsert by loan_id
                    cur.execute("""
                        INSERT INTO fines (member_id, loan_id, amount)
                        VALUES (%s,%s,%s)
                        ON CONFLICT (loan_id) DO UPDATE SET amount = EXCLUDED.amount
                    """, (member_id, loan_id, fine))
            conn.commit()
    finally:
        put_conn(conn)

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_overdues, 'interval', hours=24, next_run_time=datetime.utcnow())
    scheduler.start()

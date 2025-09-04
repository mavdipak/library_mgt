from datetime import datetime, timedelta
from server.db import get_conn, put_conn
import os

LOAN_DAYS = int(os.getenv("LOAN_DAYS", 14))
FINE_PER_DAY = int(os.getenv("FINE_PER_DAY", 5))

def borrow_book(member_id, book_id):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            borrow_date = datetime.utcnow()
            due_date = borrow_date + timedelta(days=LOAN_DAYS)
            cur.execute(
                "INSERT INTO loans (member_id, book_id, borrow_date, due_date) VALUES (%s,%s,%s,%s) RETURNING id",
                (member_id, book_id, borrow_date, due_date)
            )
            loan_id = cur.fetchone()[0]
            cur.execute("UPDATE books SET available=false WHERE id=%s", (book_id,))
            conn.commit()
            return {"loan_id": loan_id, "borrow_date": borrow_date.isoformat(), "due_date": due_date.isoformat()}
    finally:
        put_conn(conn)

def calculate_fine(due_date):
    if due_date is None:
        return 0
    today = datetime.utcnow()
    if today > due_date:
        return (today - due_date).days * FINE_PER_DAY
    return 0

def return_book(loan_id):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT member_id, book_id, due_date FROM loans WHERE id=%s AND return_date IS NULL", (loan_id,))
            row = cur.fetchone()
            if not row:
                return {"error": "Loan not found or already returned"}
            member_id, book_id, due_date = row
            fine = calculate_fine(due_date)
            if fine > 0:
                cur.execute("INSERT INTO fines (member_id, loan_id, amount) VALUES (%s,%s,%s)", (member_id, loan_id, fine))
            cur.execute("UPDATE loans SET return_date=%s WHERE id=%s", (datetime.utcnow(), loan_id))
            cur.execute("UPDATE books SET available=true WHERE id=%s", (book_id,))
            conn.commit()
            return {"loan_id": loan_id, "fine": fine}
    finally:
        put_conn(conn)

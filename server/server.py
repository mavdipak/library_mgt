import grpc
from concurrent import futures
import time

import library_pb2
import library_pb2_grpc

from server.services.loans import borrow_book, return_book, calculate_fine
from server.db import get_conn, put_conn


class LibraryService(library_pb2_grpc.LibraryServiceServicer):
    def BorrowBook(self, request, context):
        result = borrow_book(request.member_id, request.book_id)
        return library_pb2.BorrowBookResponse(
            loan_id=result['loan_id'],
            borrow_date=result['borrow_date'],
            due_date=result['due_date']
        )

    def ReturnBook(self, request, context):
        result = return_book(request.loan_id)
        if 'error' in result:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(result['error'])
            return library_pb2.ReturnBookResponse(loan_id=0, fine=0)
        return library_pb2.ReturnBookResponse(loan_id=request.loan_id, fine=result.get('fine',0))

    def ListMembers(self, request, context):
        conn = get_conn()
        members = []
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, email FROM members")
                for row in cur.fetchall():
                    members.append(library_pb2.Member(id=row[0], name=row[1], email=row[2]))
        finally:
            put_conn(conn)
        return library_pb2.ListMembersResponse(members=members)

    def ListBooks(self, request, context):
        conn = get_conn()
        books = []
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, title, author, available FROM books")
                for row in cur.fetchall():
                    books.append(library_pb2.Book(id=row[0], title=row[1], author=row[2], available=row[3]))
        finally:
            put_conn(conn)
        return library_pb2.ListBooksResponse(books=books)

    def ListLoans(self, request, context):
        conn = get_conn()
        loans = []
        try:
            with conn.cursor() as cur:
                cur.execute("""SELECT id, member_id, book_id, borrow_date, due_date, return_date
                               FROM loans WHERE member_id=%s AND return_date IS NULL""", (request.member_id,))
                for row in cur.fetchall():
                    borrow_date = row[3].isoformat() if row[3] else ''
                    due_date = row[4].isoformat() if row[4] else ''
                    return_date = row[5].isoformat() if row[5] else ''
                    loans.append(library_pb2.Loan(id=row[0], member_id=row[1], book_id=row[2],
                                                  borrow_date=borrow_date, due_date=due_date, return_date=return_date))
        finally:
            put_conn(conn)
        return library_pb2.ListLoansResponse(loans=loans)

    def ListFines(self, request, context):
        conn = get_conn()
        fines = []
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, member_id, loan_id, amount, paid FROM fines WHERE member_id=%s", (request.member_id,))
                for row in cur.fetchall():
                    fines.append(library_pb2.Fine(id=row[0], member_id=row[1], loan_id=row[2], amount=row[3], paid=row[4]))
        finally:
            put_conn(conn)
        return library_pb2.ListFinesResponse(fines=fines)

    def PayFine(self, request, context):
        conn = get_conn()
        total_paid = 0
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, amount FROM fines WHERE member_id=%s AND paid=false", (request.member_id,))
                rows = cur.fetchall()
                total_paid = sum(r[1] for r in rows)
                cur.execute("UPDATE fines SET paid=true WHERE member_id=%s AND paid=false", (request.member_id,))
                conn.commit()
        finally:
            put_conn(conn)
        return library_pb2.PayFineResponse(success=True, total_paid=total_paid)

    def ListOverdueBooks(self, request, context):
        conn = get_conn()
        overdue_loans = []
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, member_id, book_id, borrow_date, due_date, return_date FROM loans WHERE return_date IS NULL")
                for row in cur.fetchall():
                    fine = calculate_fine(row[4])
                    if fine > 0:
                        borrow_date = row[3].isoformat() if row[3] else ''
                        due_date = row[4].isoformat() if row[4] else ''
                        return_date = row[5].isoformat() if row[5] else ''
                        overdue_loans.append(library_pb2.Loan(id=row[0], member_id=row[1], book_id=row[2],
                                                              borrow_date=borrow_date, due_date=due_date, return_date=return_date))
        finally:
            put_conn(conn)
        return library_pb2.ListOverdueBooksResponse(overdue_loans=overdue_loans)

    def CreateMember(self, request, context):
        conn = get_conn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO members (name, email) VALUES (%s,%s) RETURNING id",
                    (request.name, request.email)
                )
                member_id = cur.fetchone()[0]
                conn.commit()
                return library_pb2.CreateMemberResponse(
                    id=member_id,
                    name=request.name,
                    email=request.email
                )
        finally:
            put_conn(conn)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    library_pb2_grpc.add_LibraryServiceServicer_to_server(LibraryService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print('✅ gRPC LibraryService running on port 50051')
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    from server.scheduler import start_scheduler
    start_scheduler()
    serve()

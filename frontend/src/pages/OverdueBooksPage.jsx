import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function OverdueBooksPage() {
  const [overdue, setOverdue] = useState([]);
  useEffect(() => {
    apiFetch('/books/overdue').then(data => setOverdue(data.overdue_loans || []));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Overdue Books</h2>
      {overdue.length === 0 ? <p>No overdue books 🎉</p> : (
        <table>
          <thead><tr><th>Loan ID</th><th>Member</th><th>Book</th><th>Due</th></tr></thead>
          <tbody>
            {overdue.map(l => <tr key={l.id}><td>{l.id}</td><td>{l.member_id}</td><td>{l.book_id}</td><td>{l.due_date}</td></tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OverdueBooksPage;

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function BorrowBookPage({ memberId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch('/books').then(data => setBooks(data.books || []));
  }, []);

  const borrow = (bookId) => {
    setLoading(true);
    apiFetch('/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId, book_id: bookId }),
    }).then(data => {
      alert(`Borrowed! Due on ${data.due_date}`);
      setBooks(books.map(b => b.id === bookId ? { ...b, available: false } : b));
    }).finally(() => setLoading(false));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Borrow a Book</h2>
      <ul>
        {books.map(b => (
          <li key={b.id}>
            {b.title} — {b.author} {b.available ? <button onClick={() => borrow(b.id)}>Borrow</button> : '(Not Available)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BorrowBookPage;

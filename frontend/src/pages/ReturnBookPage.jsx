import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function ReturnBookPage({ memberId }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLoans = () => {
    apiFetch(`/members/${memberId}/loans`).then(data => setLoans(data.loans || []));
  };

  useEffect(() => {
    if (!memberId) return;
    loadLoans();
  }, [memberId]);

  const returnBook = (loanId) => {
    setLoading(true);
    apiFetch('/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loan_id: loanId })
    }).then(data => {
      alert(data.fine > 0 ? `Returned with fine: $${data.fine}` : 'Returned successfully!');
      loadLoans();
    }).finally(() => setLoading(false));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">My Borrowed Books</h2>
      {loans.length === 0 ? <p>No active loans 🎉</p> : (
        <ul>
          {loans.map(l => (
            <li key={l.id}>
              Book #{l.book_id} — Due: {l.due_date} <button onClick={() => returnBook(l.id)}>Return</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReturnBookPage;

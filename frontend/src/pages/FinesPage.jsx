import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function FinesPage({ memberId }) {
  const [fines, setFines] = useState([]);
  useEffect(() => {
    if (!memberId) return;
    apiFetch(`/members/${memberId}/fines`).then(data => setFines(data.fines || []));
  }, [memberId]);

  const payFines = () => {
    apiFetch(`/members/${memberId}/pay`, { method: 'POST' }).then(data => {
      alert(`Paid total: ${data.total_paid}`);
      setFines([]);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Outstanding Fines</h2>
      {fines.length === 0 ? <p>No fines 🎉</p> : (
        <>
          <ul>
            {fines.map(f => <li key={f.id}>Loan #{f.loan_id} → ${f.amount} {f.paid ? '(paid)' : ''}</li>)}
          </ul>
          <button onClick={payFines}>Pay All</button>
        </>
      )}
    </div>
  );
}

export default FinesPage;

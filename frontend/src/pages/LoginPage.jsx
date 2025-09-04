import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export default function LoginPage({ onLogin }) {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch('/members');
        setMembers(res.members || res || []);
      } catch (e) {
        setError('Failed to load members. Please try again.');
      }
    }
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return setError('Please select a member');
    onLogin && onLogin(selected);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select a member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

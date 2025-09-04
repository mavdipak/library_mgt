import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

function CreateMemberPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiFetch('/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    alert(`Member created: ${res.name} (${res.email})`);
    setName('');
    setEmail('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Create Member</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 mr-2"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">Add</button>
      </form>
    </div>
  );
}

export default CreateMemberPage;

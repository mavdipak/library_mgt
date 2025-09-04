import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg transition ${active ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">📚 Library</h1>
      <div className="space-x-2">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/create-member">Create Member</NavLink>
        <NavLink to="/borrow">Borrow</NavLink>
        <NavLink to="/return">Return</NavLink>
      </div>
    </nav>
  );
}

import React from 'react';
import { useAuth } from '../context/AuthContext';

// keeping this simple - just a welcome + quick role based note
// students can wire this up to actual stats (attendance %, upcoming results etc.) later
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Welcome, {user?.name}</h2>
      <p>You're logged in as <strong>{user?.role}</strong>.</p>
      <div className="card-grid">
        <div className="stat-card">
          <h3>Role</h3>
          <p>{user?.role}</p>
        </div>
        <div className="stat-card">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

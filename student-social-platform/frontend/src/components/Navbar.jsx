import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    // quick poll every 30s so the badge stays roughly up to date -
    // swap for websockets/SSE if you want real time later
    const fetchCount = () => api.get('/notifications/unread-count').then(({ data }) => setUnread(data.count));
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="brand">CampusConnect</Link>

      <div className="nav-links">
        <Link to="/">Feed</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/notifications">
          Notifications {unread > 0 && <span className="unread-dot">{unread}</span>}
        </Link>
        <Link to={`/profile/${user.username}`}>My Profile</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;

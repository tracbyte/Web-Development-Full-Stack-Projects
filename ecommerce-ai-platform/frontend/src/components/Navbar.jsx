import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">ShopAI</Link>

      <div className="nav-links">
        <Link to="/products">Products</Link>
        {user && <Link to="/cart">Cart ({itemCount})</Link>}
        {user && <Link to="/orders">My Orders</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>

      <div className="nav-auth">
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

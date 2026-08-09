import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const [address, setAddress] = useState(user?.address || '');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      // no payment gateway hooked up here - this just records the order.
      // plug in stripe/razorpay before the api.post call when you build this out
      await api.post('/orders', { shippingAddress: address });
      await refreshCart();
      navigate('/orders');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <h2>Checkout</h2>
      <form className="auth-form" onSubmit={handlePlaceOrder} style={{ maxWidth: '400px' }}>
        <label>Shipping Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
        />
        <p>Order total: <strong>${total.toFixed(2)}</strong></p>
        <button type="submit" disabled={placing}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;

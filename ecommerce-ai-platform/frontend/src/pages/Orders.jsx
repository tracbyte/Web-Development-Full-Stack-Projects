import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => setOrders(data));
  }, []);

  if (orders.length === 0) {
    return <div className="page"><h2>My Orders</h2><p>You haven't placed any orders yet.</p></div>;
  }

  return (
    <div className="page">
      <h2>My Orders</h2>
      {orders.map((o) => (
        <div className="order-card" key={o._id}>
          <div className="order-header">
            <span>Order #{o._id.slice(-6).toUpperCase()}</span>
            <span className={`badge ${o.status}`}>{o.status}</span>
          </div>
          <ul>
            {o.items.map((item, idx) => (
              <li key={idx}>{item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</li>
            ))}
          </ul>
          <p>Total: <strong>${o.totalAmount.toFixed(2)}</strong></p>
          <small>Placed on {new Date(o.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Orders;

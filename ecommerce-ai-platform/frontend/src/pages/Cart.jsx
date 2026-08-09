import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <h2>Your Cart</h2>
        <p>Your cart is empty. <Link to="/products">Browse products</Link></p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Your Cart</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.name}</td>
              <td>${item.product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                  style={{ width: '60px' }}
                />
              </td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button className="danger-btn" onClick={() => removeFromCart(item.product._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;

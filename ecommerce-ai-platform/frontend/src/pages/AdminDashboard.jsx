import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyProductForm = { name: '', description: '', price: '', category: '', tags: '', stock: '', imageUrl: '' };

// single page admin panel - products, categories and order status all in one place.
// kept intentionally basic, split into separate routes/pages once this grows
const AdminDashboard = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryName, setCategoryName] = useState('');

  const fetchAll = async () => {
    const [{ data: p }, { data: c }, { data: o }] = await Promise.all([
      api.get('/products'),
      api.get('/categories'),
      api.get('/orders')
    ]);
    setProducts(p);
    setCategories(c);
    setOrders(o);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    await api.post('/products', {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      tags: productForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
    });
    setProductForm(emptyProductForm);
    fetchAll();
  };

  const handleDeleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchAll();
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    await api.post('/categories', { name: categoryName });
    setCategoryName('');
    fetchAll();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchAll();
  };

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      <div className="tab-bar">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <>
          <form className="inline-form" onSubmit={handleProductSubmit}>
            <input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
            <input placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
            <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
            <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required>
              <option value="">Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Tags (comma separated)" value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} />
            <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
            <input placeholder="Image URL" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
            <button type="submit">Add Product</button>
          </form>

          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Stock</th><th>Rating</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.ratingAverage || '—'}</td>
                  <td><button className="danger-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'categories' && (
        <>
          <form className="inline-form" onSubmit={handleCategorySubmit}>
            <input placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            <button type="submit">Add Category</button>
          </form>
          <ul className="simple-list">
            {categories.map((c) => <li key={c._id}>{c.name}</li>)}
          </ul>
        </>
      )}

      {tab === 'orders' && (
        <table className="data-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;

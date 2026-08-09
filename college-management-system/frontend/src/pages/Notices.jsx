import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', audience: 'all' });
  const [showForm, setShowForm] = useState(false);

  const fetchNotices = async () => {
    const { data } = await api.get('/notices');
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/notices', form);
    setForm({ title: '', description: '', audience: 'all' });
    setShowForm(false);
    fetchNotices();
  };

  const canPost = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="page">
      <div className="page-header">
        <h2>Notices</h2>
        {canPost && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Notice'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <select name="audience" value={form.audience} onChange={handleChange}>
            <option value="all">Everyone</option>
            <option value="students">Students only</option>
            <option value="faculty">Faculty only</option>
          </select>
          <button type="submit">Post</button>
        </form>
      )}

      <div className="notice-list">
        {notices.map((n) => (
          <div className="notice-card" key={n._id}>
            <h3>{n.title}</h3>
            <p>{n.description}</p>
            <small>Posted by {n.postedBy?.name} on {new Date(n.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;

import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  name: '', email: '', password: '', rollNumber: '', department: '', semester: '', contactNumber: ''
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await api.get('/students');
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/students', form);
    setForm(emptyForm);
    setShowForm(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this student?')) return;
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Students</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="rollNumber" placeholder="Roll number" value={form.rollNumber} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="semester" type="number" min="1" max="8" placeholder="Semester" value={form.semester} onChange={handleChange} required />
          <input name="contactNumber" placeholder="Contact number" value={form.contactNumber} onChange={handleChange} />
          <button type="submit">Save</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.rollNumber}</td>
                <td>{s.user?.name}</td>
                <td>{s.user?.email}</td>
                <td>{s.department}</td>
                <td>{s.semester}</td>
                <td>
                  <button className="danger-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;

import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  name: '', email: '', password: '', employeeId: '', department: '', designation: '', contactNumber: ''
};

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const fetchFaculty = async () => {
    const { data } = await api.get('/faculty');
    setFacultyList(data);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/faculty', form);
    setForm(emptyForm);
    setShowForm(false);
    fetchFaculty();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this faculty member?')) return;
    await api.delete(`/faculty/${id}`);
    fetchFaculty();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Faculty</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Faculty'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
          <input name="contactNumber" placeholder="Contact number" value={form.contactNumber} onChange={handleChange} />
          <button type="submit">Save</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map((f) => (
            <tr key={f._id}>
              <td>{f.employeeId}</td>
              <td>{f.user?.name}</td>
              <td>{f.user?.email}</td>
              <td>{f.department}</td>
              <td>{f.designation}</td>
              <td>
                <button className="danger-btn" onClick={() => handleDelete(f._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Faculty;

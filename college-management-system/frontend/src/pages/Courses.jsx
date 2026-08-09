import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', code: '', department: '', semester: '', credits: 3 };

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchCourses = async () => {
    const { data } = await api.get('/courses');
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/courses', form);
    setForm(emptyForm);
    setShowForm(false);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this course?')) return;
    await api.delete(`/courses/${id}`);
    fetchCourses();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Courses</h2>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Course name" value={form.name} onChange={handleChange} required />
          <input name="code" placeholder="Course code" value={form.code} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="semester" type="number" min="1" max="8" placeholder="Semester" value={form.semester} onChange={handleChange} required />
          <input name="credits" type="number" placeholder="Credits" value={form.credits} onChange={handleChange} />
          <button type="submit">Save</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Credits</th>
            {user?.role === 'admin' && <th></th>}
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.code}</td>
              <td>{c.name}</td>
              <td>{c.department}</td>
              <td>{c.semester}</td>
              <td>{c.credits}</td>
              {user?.role === 'admin' && (
                <td>
                  <button className="danger-btn" onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;

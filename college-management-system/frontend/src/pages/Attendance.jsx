import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ student: '', course: '', status: 'present' });

  const fetchRecords = async () => {
    const { data } = await api.get('/attendance');
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/attendance', { ...form, date: new Date() });
    fetchRecords();
  };

  const canMark = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="page">
      <h2>Attendance</h2>

      {canMark && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="student" placeholder="Student ID" value={form.student} onChange={handleChange} required />
          <input name="course" placeholder="Course ID" value={form.course} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <button type="submit">Mark Attendance</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Course</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.student?.rollNumber}</td>
              <td>{r.course?.code}</td>
              <td>
                <span className={`badge ${r.status}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

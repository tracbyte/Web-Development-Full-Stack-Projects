import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Results = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({ student: '', course: '', semester: '', marksObtained: '', maxMarks: 100 });

  const fetchResults = async () => {
    const { data } = await api.get('/results');
    setResults(data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/results', form);
    fetchResults();
  };

  const canAdd = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="page">
      <h2>Results</h2>

      {canAdd && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input name="student" placeholder="Student ID" value={form.student} onChange={handleChange} required />
          <input name="course" placeholder="Course ID" value={form.course} onChange={handleChange} required />
          <input name="semester" type="number" placeholder="Semester" value={form.semester} onChange={handleChange} required />
          <input name="marksObtained" type="number" placeholder="Marks obtained" value={form.marksObtained} onChange={handleChange} required />
          <input name="maxMarks" type="number" placeholder="Max marks" value={form.maxMarks} onChange={handleChange} />
          <button type="submit">Add Result</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.student?.rollNumber}</td>
              <td>{r.course?.code}</td>
              <td>{r.semester}</td>
              <td>{r.marksObtained}/{r.maxMarks}</td>
              <td>{r.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;

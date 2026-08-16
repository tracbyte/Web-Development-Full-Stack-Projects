import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Explore = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const { data } = await api.get('/users', { params: { search } });
    setResults(data);
    setSearched(true);
  };

  return (
    <div className="page">
      <h2>Explore</h2>
      <form className="inline-form" onSubmit={handleSearch}>
        <input
          placeholder="Search by name, username or college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="user-list">
        {results.map((u) => (
          <Link to={`/profile/${u.username}`} className="user-list-item" key={u._id}>
            <div className="avatar-sm">
              {u.avatarUrl ? <img src={u.avatarUrl} alt="" /> : u.name[0]}
            </div>
            <div>
              <strong>{u.name}</strong>
              <p className="muted">@{u.username} {u.college && `· ${u.college}`}</p>
            </div>
          </Link>
        ))}
        {searched && results.length === 0 && <p>No users found.</p>}
      </div>
    </div>
  );
};

export default Explore;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard">Dashboard</NavLink>
      {user?.role === 'admin' && <NavLink to="/students">Students</NavLink>}
      {user?.role === 'admin' && <NavLink to="/faculty">Faculty</NavLink>}
      <NavLink to="/courses">Courses</NavLink>
      <NavLink to="/attendance">Attendance</NavLink>
      <NavLink to="/results">Results</NavLink>
      <NavLink to="/notices">Notices</NavLink>
    </aside>
  );
};

export default Sidebar;

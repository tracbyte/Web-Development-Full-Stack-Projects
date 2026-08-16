import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const labelFor = (n) => {
  if (n.type === 'like') return 'liked your post';
  if (n.type === 'comment') return 'commented on your post';
  return 'started following you';
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      await api.put('/notifications/mark-read');
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>Notifications</h2>
      {notifications.length === 0 && <p>Nothing yet - notifications show up here.</p>}

      {notifications.map((n) => (
        <div className={`notification-card ${n.read ? '' : 'unread'}`} key={n._id}>
          <Link to={`/profile/${n.sender.username}`}>
            <strong>{n.sender.name}</strong>
          </Link>{' '}
          {labelFor(n)}
          {n.post && (
            <Link to={`/post/${n.post._id}`} className="muted"> — view post</Link>
          )}
          <div className="muted small">{new Date(n.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;

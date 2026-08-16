import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// used on the feed, profile page and post detail page
const PostCard = ({ post, onDeleted }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    const { data } = await api.post(`/posts/${post._id}/like`);
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    onDeleted?.(post._id);
  };

  const canDelete = user && (user._id === post.user._id || user.role === 'admin');

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user.username}`} className="post-author">
          <div className="avatar-sm">
            {post.user.avatarUrl ? <img src={post.user.avatarUrl} alt="" /> : post.user.name[0]}
          </div>
          <div>
            <strong>{post.user.name}</strong>
            <span className="muted"> @{post.user.username}</span>
          </div>
        </Link>
        {canDelete && <button className="link-btn" onClick={handleDelete}>Delete</button>}
      </div>

      <Link to={`/post/${post._id}`}>
        <p className="post-content">{post.content}</p>
        {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="" />}
      </Link>

      <div className="post-actions">
        <button className={liked ? 'liked' : ''} onClick={handleLike}>
          ♥ {likesCount}
        </button>
        <Link to={`/post/${post._id}`}>💬 {post.commentsCount}</Link>
      </div>
    </div>
  );
};

export default PostCard;

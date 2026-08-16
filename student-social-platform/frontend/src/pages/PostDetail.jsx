import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const fetchAll = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/comments/post/${id}`)
    ]);
    setPost(p);
    setComments(c);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await api.post('/comments', { post: id, text });
    setText('');
    fetchAll();
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    fetchAll();
  };

  const handlePostDeleted = () => navigate('/');

  if (!post) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <PostCard post={post} onDeleted={handlePostDeleted} />

      <section className="comments-section">
        <h3>Comments</h3>
        <form className="inline-form" onSubmit={handleComment}>
          <input
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
          />
          <button type="submit">Comment</button>
        </form>

        {comments.map((c) => (
          <div className="comment-card" key={c._id}>
            <strong>{c.user.name}</strong> <span className="muted">@{c.user.username}</span>
            <p>{c.text}</p>
            <button className="link-btn" onClick={() => handleDeleteComment(c._id)}>Delete</button>
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet.</p>}
      </section>
    </div>
  );
};

export default PostDetail;

import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    const { data } = await api.get('/posts/feed');
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post('/posts', { content, imageUrl });
    setContent('');
    setImageUrl('');
    fetchFeed();
  };

  const handleDeleted = (id) => setPosts(posts.filter((p) => p._id !== id));

  return (
    <div className="page">
      <form className="post-composer" onSubmit={handlePost}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
        />
        <input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {loading ? (
        <p>Loading feed...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet - follow some people from Explore, or just start posting.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} onDeleted={handleDeleted} />)
      )}
    </div>
  );
};

export default Feed;

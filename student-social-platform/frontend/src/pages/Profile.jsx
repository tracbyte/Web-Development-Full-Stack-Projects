import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', college: '', avatarUrl: '' });

  const fetchProfile = async () => {
    const { data } = await api.get(`/users/${username}`);
    setProfile(data);
    setEditForm({ bio: data.bio, college: data.college, avatarUrl: data.avatarUrl });

    const { data: userPosts } = await api.get(`/posts/user/${data._id}`);
    setPosts(userPosts);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const isOwnProfile = currentUser?.username === username;
  const isFollowing = profile?.followers?.includes(currentUser?._id);

  const handleFollow = async () => {
    await api.post(`/users/${profile._id}/follow`);
    fetchProfile();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await api.put('/users/me', editForm);
    setEditing(false);
    fetchProfile();
  };

  const handleDeleted = (id) => setPosts(posts.filter((p) => p._id !== id));

  if (!profile) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <div className="profile-header">
        <div className="avatar-lg">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : profile.name[0]}
        </div>
        <div className="profile-info">
          <h2>{profile.name} <span className="muted">@{profile.username}</span></h2>
          {profile.college && <p className="muted">{profile.college}</p>}
          <p>{profile.bio || 'No bio yet.'}</p>
          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{profile.followers.length}</strong> followers</span>
            <span><strong>{profile.following.length}</strong> following</span>
          </div>

          {isOwnProfile ? (
            <button onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit Profile'}</button>
          ) : (
            <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
          )}
        </div>
      </div>

      {editing && (
        <form className="inline-form" onSubmit={handleSaveProfile}>
          <textarea
            placeholder="Bio"
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            maxLength={200}
          />
          <input
            placeholder="College"
            value={editForm.college}
            onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
          />
          <input
            placeholder="Avatar image URL"
            value={editForm.avatarUrl}
            onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
          />
          <button type="submit">Save</button>
        </form>
      )}

      <h3>Posts</h3>
      {posts.map((post) => <PostCard key={post._id} post={post} onDeleted={handleDeleted} />)}
    </div>
  );
};

export default Profile;

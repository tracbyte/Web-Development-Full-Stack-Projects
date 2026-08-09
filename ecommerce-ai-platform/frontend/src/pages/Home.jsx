import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductStrip from '../components/ProductStrip';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // works for guests too - backend returns trending products when there's no user
      const { data } = await api.get('/recommendations/for-you');
      setRecommended(data);
      setLoading(false);
    };
    fetchRecommendations();
  }, [user]);

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>Welcome to ShopAI</h1>
        <p>Suggestions that actually get better the more you shop.</p>
      </div>

      {loading ? (
        <p>Loading suggestions...</p>
      ) : (
        <ProductStrip
          title={user ? 'Recommended for you' : 'Trending right now'}
          products={recommended}
        />
      )}
    </div>
  );
};

export default Home;

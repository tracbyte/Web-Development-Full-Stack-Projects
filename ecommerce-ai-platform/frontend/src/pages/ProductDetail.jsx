import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductStrip from '../components/ProductStrip';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    const [{ data: p }, { data: r }, { data: rv }] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/recommendations/related/${id}`),
      api.get(`/reviews/product/${id}`)
    ]);
    setProduct(p);
    setRelated(r);
    setReviews(rv);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, 1);
    setMessage('Added to cart');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    await api.post('/reviews', { product: id, ...reviewForm });
    setReviewForm({ rating: 5, comment: '' });
    fetchAll();
  };

  if (!product) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="image-placeholder">No image</div>
          )}
        </div>
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="stock-note">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          {message && <p className="success-text">{message}</p>}
          <button onClick={handleAddToCart} disabled={product.stock === 0}>
            Add to Cart
          </button>
        </div>
      </div>

      <ProductStrip title="You might also like" products={related} />

      <section className="reviews-section">
        <h3>Reviews</h3>
        {user && (
          <form className="inline-form" onSubmit={handleReviewSubmit}>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <input
              placeholder="Write a review..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
            <button type="submit">Submit Review</button>
          </form>
        )}

        {reviews.map((r) => (
          <div className="review-card" key={r._id}>
            <strong>{r.user?.name}</strong> — {'★'.repeat(r.rating)}
            <p>{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p>No reviews yet - be the first.</p>}
      </section>
    </div>
  );
};

export default ProductDetail;

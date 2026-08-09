import React from 'react';
import { Link } from 'react-router-dom';

// reusable card used on Home, product listing and the recommendation strips
const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="product-price">${product.price.toFixed(2)}</p>
        {product.ratingCount > 0 && (
          <p className="product-rating">★ {product.ratingAverage} ({product.ratingCount})</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

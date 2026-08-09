import React from 'react';
import ProductCard from './ProductCard';

// horizontal-ish grid used for "Recommended for you" / "Related products" sections
const ProductStrip = ({ title, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="product-strip">
      <h3>{title}</h3>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductStrip;

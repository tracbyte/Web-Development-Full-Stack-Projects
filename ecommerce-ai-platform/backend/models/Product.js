const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    // free text tags help the content based recommender match similar products
    // even across different categories, e.g. "wireless", "gaming", "budget"
    tags: [{ type: String, lowercase: true, trim: true }],
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: '' },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    // bumped every time someone views the product - a cheap popularity signal
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

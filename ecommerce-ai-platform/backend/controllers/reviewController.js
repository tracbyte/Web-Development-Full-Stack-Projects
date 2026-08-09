const Review = require('../models/Review');
const Product = require('../models/Product');

// keeps the product's average rating in sync whenever reviews change
const recalculateRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const ratingCount = reviews.length;
  const ratingAverage = ratingCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
    : 0;

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: ratingAverage.toFixed(1),
    ratingCount
  });
};

const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    const review = await Review.create({
      product,
      user: req.user._id,
      rating,
      comment
    });

    await recalculateRating(product);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await recalculateRating(review.product);
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview, getProductReviews, deleteReview };

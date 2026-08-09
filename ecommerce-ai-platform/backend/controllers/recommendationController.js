const { getRelatedProducts, getPersonalizedRecommendations } = require('../services/recommendationService');

// @desc   "you might also like" for a specific product page
// @route  GET /api/recommendations/related/:productId
const relatedProducts = async (req, res) => {
  try {
    const products = await getRelatedProducts(req.params.productId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   personalized "recommended for you", works for guests too (shows trending)
// @route  GET /api/recommendations/for-you
const forYou = async (req, res) => {
  try {
    const products = await getPersonalizedRecommendations(req.user);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { relatedProducts, forYou };

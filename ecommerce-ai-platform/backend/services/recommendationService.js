const Product = require('../models/Product');
const Order = require('../models/Order');
const { getAISuggestions } = require('./aiService');

// "related products" for a product detail page - same category first,
// then anything sharing tags, sorted by rating so decent stuff floats up
const getRelatedProducts = async (productId, limit = 6) => {
  const product = await Product.findById(productId);
  if (!product) return [];

  const related = await Product.find({
    _id: { $ne: productId },
    $or: [{ category: product.category }, { tags: { $in: product.tags } }]
  })
    .sort({ ratingAverage: -1, views: -1 })
    .limit(limit);

  return related;
};

// personalized "recommended for you" list for a logged in user.
// looks at what they've bought before and what categories they've viewed,
// then tries the AI service first (if configured) and falls back to a
// straightforward "more from categories you like" query.
const getPersonalizedRecommendations = async (user, limit = 8) => {
  if (!user) {
    // guest - just show trending/popular products
    return Product.find().sort({ views: -1, ratingAverage: -1 }).limit(limit);
  }

  const pastOrders = await Order.find({ user: user._id }).populate('items.product');
  const purchasedProductIds = pastOrders.flatMap((o) => o.items.map((i) => i.product?._id?.toString()));

  const interestedCategories = user.viewedCategories?.length
    ? user.viewedCategories
    : pastOrders.flatMap((o) => o.items.map((i) => i.product?.category)).filter(Boolean);

  // try the AI service for a smarter pass, purely additive - if it fails
  // or isn't configured we just skip straight to the rule based query below
  if (interestedCategories.length) {
    const context = `User has shown interest in categories: ${interestedCategories.join(', ')}. Suggest relevant product keywords.`;
    const aiKeywords = await getAISuggestions(context);

    if (aiKeywords && aiKeywords.length) {
      const aiMatches = await Product.find({
        _id: { $nin: purchasedProductIds },
        $text: { $search: aiKeywords.join(' ') }
      }).limit(limit);

      if (aiMatches.length) return aiMatches;
    }
  }

  // rule based fallback - products from categories the user cares about,
  // excluding stuff they already bought
  const filter = interestedCategories.length
    ? { category: { $in: interestedCategories }, _id: { $nin: purchasedProductIds } }
    : { _id: { $nin: purchasedProductIds } };

  let recommendations = await Product.find(filter).sort({ ratingAverage: -1 }).limit(limit);

  // not enough matches? top up with generally popular products
  if (recommendations.length < limit) {
    const extra = await Product.find({
      _id: { $nin: [...purchasedProductIds, ...recommendations.map((r) => r._id.toString())] }
    })
      .sort({ views: -1 })
      .limit(limit - recommendations.length);
    recommendations = [...recommendations, ...extra];
  }

  return recommendations;
};

module.exports = { getRelatedProducts, getPersonalizedRecommendations };

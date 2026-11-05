/**
 * Portify AI — Portfolio Business Service
 * Encapsulates MongoDB data operations and ownership queries away from HTTP controllers.
 */

const { Portfolio } = require('../models/Portfolio');
const User = require('../models/User');
const { generateUniqueSlug } = require('../utils/slugify');
const { ALLOWED_UPDATE_FIELDS } = require('../constants');

/**
 * Fetch all portfolios belonging to a user (Dashboard History)
 */
const getUserPortfolios = async (userId) => {
  return Portfolio.find({ user: userId })
    .sort({ updatedAt: -1 })
    .select('title slug theme isPublished extractionSource analytics createdAt updatedAt personalInfo.fullName personalInfo.headline');
};

/**
 * Fetch a single portfolio ensuring strict ownership verification (BOLA/IDOR protection)
 */
const getPortfolioById = async (portfolioId, userId) => {
  return Portfolio.findOne({
    _id: portfolioId,
    user: userId,
  });
};

/**
 * Update an existing portfolio with allowed fields only (Mass-assignment protection)
 */
const updatePortfolio = async (portfolioId, userId, updates) => {
  const portfolio = await Portfolio.findOne({
    _id: portfolioId,
    user: userId,
  });

  if (!portfolio) {
    return null;
  }

  // Handle unique slug updates
  if (updates.slug && updates.slug !== portfolio.slug) {
    updates.slug = await generateUniqueSlug(updates.slug, portfolio._id);
  }

  // Apply whitelisted fields only
  ALLOWED_UPDATE_FIELDS.forEach((field) => {
    if (updates[field] !== undefined) {
      portfolio[field] = updates[field];
    }
  });

  await portfolio.save();
  return portfolio;
};

/**
 * Delete a user-owned portfolio and decrement user's counter
 */
const deletePortfolio = async (portfolioId, userId) => {
  const portfolio = await Portfolio.findOneAndDelete({
    _id: portfolioId,
    user: userId,
  });

  if (!portfolio) {
    return null;
  }

  await User.findByIdAndUpdate(userId, {
    $inc: { portfolioCount: -1 },
  });

  return portfolio;
};

/**
 * Retrieve public portfolio by slug (guests see published only; owners can view private drafts)
 */
const getPublicPortfolio = async (slug, isOwner = false) => {
  const query = { slug: slug.toLowerCase() };
  if (!isOwner) {
    query.isPublished = true;
  }

  const portfolio = await Portfolio.findOne(query).populate('user', 'name');

  if (portfolio && portfolio.isPublished && !isOwner) {
    Portfolio.findByIdAndUpdate(portfolio._id, {
      $inc: { 'analytics.views': 1 },
      $set: { 'analytics.lastViewedAt': new Date() },
    }).exec();
  }

  return portfolio;
};

/**
 * Update portfolio avatar URL
 */
const updateAvatar = async (portfolioId, userId, avatarDataUri) => {
  return Portfolio.findOneAndUpdate(
    { _id: portfolioId, user: userId },
    { $set: { 'personalInfo.avatarUrl': avatarDataUri } },
    { new: true, runValidators: true }
  );
};

/**
 * Remove portfolio avatar
 */
const deleteAvatar = async (portfolioId, userId) => {
  return Portfolio.findOneAndUpdate(
    { _id: portfolioId, user: userId },
    { $set: { 'personalInfo.avatarUrl': '' } },
    { new: true, runValidators: true }
  );
};

module.exports = {
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio,
  updateAvatar,
  deleteAvatar,
};


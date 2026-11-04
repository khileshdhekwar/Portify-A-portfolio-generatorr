const { Portfolio } = require('../models/Portfolio');
const User = require('../models/User');
const { generatePortfolioZip } = require('../services/zipService');
const { generateQRDataUrl } = require('../services/qrService');
const { generateUniqueSlug } = require('../utils/slugify');
const config = require('../config/env');

/**
 * Get all portfolios for the logged-in user (History)
 * GET /api/portfolios
 */
const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title slug theme isPublished extractionSource analytics createdAt updatedAt personalInfo.fullName personalInfo.headline');

    res.json({
      success: true,
      count: portfolios.length,
      portfolios,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single portfolio by ID (Owner only)
 * GET /api/portfolios/:id
 */
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or you are not authorized to view it.',
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update portfolio (Owner only)
 * PUT /api/portfolios/:id
 */
const updatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or you do not have permission to edit it.',
      });
    }

    const updates = req.body;

    // If slug is being updated, verify uniqueness
    if (updates.slug && updates.slug !== portfolio.slug) {
      updates.slug = await generateUniqueSlug(updates.slug, portfolio._id);
    }

    // Apply allowed updates
    const allowedFields = [
      'title',
      'slug',
      'theme',
      'isPublished',
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'customSections',
      'themeSettings',
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        portfolio[field] = updates[field];
      }
    });

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio updated successfully.',
      portfolio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete portfolio (Owner only)
 * DELETE /api/portfolios/:id
 */
const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or already deleted.',
      });
    }

    // Decrement user's count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { portfolioCount: -1 },
    });

    res.json({
      success: true,
      message: 'Portfolio deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public access to portfolio by unique slug
 * GET /api/portfolios/public/:slug
 */
const getPublicPortfolio = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const portfolio = await Portfolio.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
    }).populate('user', 'name');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or it is currently private.',
      });
    }

    // Increment view count asynchronously
    Portfolio.findByIdAndUpdate(portfolio._id, {
      $inc: { 'analytics.views': 1 },
      $set: { 'analytics.lastViewedAt': new Date() },
    }).exec();

    res.json({
      success: true,
      portfolio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Download complete standalone portfolio as ZIP
 * GET /api/portfolios/:id/zip
 */
const downloadPortfolioZip = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or unauthorized.',
      });
    }

    const publicUrl = `${config.clientUrl}/p/${portfolio.slug}`;
    const zipBuffer = await generatePortfolioZip(portfolio.toObject(), publicUrl);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="portify-${portfolio.slug}.zip"`,
      'Content-Length': zipBuffer.length,
    });

    res.send(zipBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Get QR code data for a portfolio
 * GET /api/portfolios/:id/qr
 */
const getPortfolioQR = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found.',
      });
    }

    const publicUrl = `${config.clientUrl}/p/${portfolio.slug}`;
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    res.json({
      success: true,
      publicUrl,
      qrDataUrl,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio,
  downloadPortfolioZip,
  getPortfolioQR,
};

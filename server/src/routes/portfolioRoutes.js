const express = require('express');
const router = express.Router();
const {
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio,
  downloadPortfolioZip,
  getPortfolioQR,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

// Public route for viewing live portfolios (accessible without auth)
router.get('/public/:slug', getPublicPortfolio);

// Authenticated user portfolio routes
router.use(protect);
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);
router.get('/:id/zip', downloadPortfolioZip);
router.get('/:id/qr', getPortfolioQR);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviews,
  checkUserReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .post(protect, createReview)
  .get(protect, admin, getAllReviews);

router.get('/product/:productId', getProductReviews);

router.get('/check/:productId', protect, checkUserReview);

router.delete('/:id', protect, deleteReview);

module.exports = router;
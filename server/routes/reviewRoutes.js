import express from 'express';
import {
  addReview,
  getReviewsForBook,
  deleteReview
} from '../controllers/reviewController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addReview);                     // Add review
router.get('/:bookId', getReviewsForBook);                       // View reviews for a book
router.delete('/:id', authMiddleware, adminMiddleware, deleteReview); // Admin can delete

export default router;

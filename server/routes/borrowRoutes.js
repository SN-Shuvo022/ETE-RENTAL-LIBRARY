import express from 'express';
import {
  borrowBook,
  returnBook,
  getBorrowHistory
} from '../controllers/borrowController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/borrow
router.post('/', authMiddleware, borrowBook);  // Borrow book
router.put('/return/:id', authMiddleware, returnBook);  // Return book
router.get('/', authMiddleware, getBorrowHistory); // Get borrow history

export default router;

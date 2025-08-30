import express from 'express';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// 👇 Anyone can view books
router.get('/', getBooks);

// 👇 Only logged-in admins can manage books
router.post('/', authMiddleware, adminMiddleware, addBook);
router.put('/:id', authMiddleware, adminMiddleware, updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

export default router;
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';

export const borrowBook = async (req, res) => {
  const { bookId } = req.body;
const userId = req.user.id; // Get from token


  try {
    const book = await Book.findById(bookId);
    if (!book || !book.available)
      return res.status(400).json({ message: 'Book not available' });

    const borrow = new Borrow({ userId, bookId });
    await borrow.save();

    // Update book availability
    book.available = false;
    await book.save();

    res.status(201).json({ message: 'Book borrowed successfully', borrow });
  } catch (err) {
    res.status(500).json({ message: 'Failed to borrow book', error: err.message });
  }
};

export const returnBook = async (req, res) => {
  const { id } = req.params; // The borrow record ID

  try {
    // Find the borrow record by ID
    const borrow = await Borrow.findById(id);
    if (!borrow || borrow.returned) {
      return res.status(400).json({ message: 'Invalid borrow record or already returned' });
    }

    // Mark the borrow record as returned
    borrow.returned = true;
    borrow.returnDate = new Date();
    await borrow.save();

    // Update the book's availability
    const book = await Book.findById(borrow.bookId);
    book.available = true;
    await book.save();

    res.json({ message: 'Book returned successfully', borrow });
  } catch (err) {
    res.status(500).json({ message: 'Failed to return book', error: err.message });
  }
};



export const getBorrowHistory = async (req, res) => {
  try {
    const borrows = await Borrow.find().populate('userId bookId');
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrow history' });
  }
};

import Book from '../models/Book.js';

// GET all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'name' }
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// POST new book
export const addBook = async (req, res) => {
  const { title, author, genre, coverImage } = req.body;

  try {
    const book = new Book({ title, author, genre, coverImage });
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book' });
  }
};

// PUT update book
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await Book.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// DELETE book
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const addReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const review = await Review.create({ userId, bookId, rating, comment });
        // ✅ Push review to book
    await Book.findByIdAndUpdate(bookId, {
      $push: { reviews: review._id }
    });
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

export const getReviewsForBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const reviews = await Review.find({ bookId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

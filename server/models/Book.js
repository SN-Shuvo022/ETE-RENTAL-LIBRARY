import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  genre: String,
  coverImage: String,
  available: {
    type: Boolean,
    default: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;

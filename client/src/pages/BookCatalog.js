import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookCatalog.css';
import { useNavigate } from 'react-router-dom';

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [selectedSemester, setSelectedSemester] = useState('All');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/books');
        setBooks(res.data);
        setFilteredBooks(
          selectedSemester === 'All'
            ? res.data
            : res.data.filter((book) => book.semester === selectedSemester)
        );
      } catch {
        alert('Error loading books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedSemester]);

  const handleSemesterChange = (e) => {
    const sem = e.target.value;
    setSelectedSemester(sem);
  };

  const handleBorrow = async (bookId) => {
    if (!token) return alert('Please log in');

    try {
      await axios.post(
        '/api/borrow',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Book borrowed successfully!');
      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, available: false } : book
        )
      );
      setFilteredBooks((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, available: false } : book
        )
      );
    } catch {
      alert('Borrow failed');
    }
  };

  const handleReturn = async (bookId) => {
    if (!token) return alert('Please log in');

    try {
      const borrowRes = await axios.get('/api/borrow', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const activeBorrow = borrowRes.data.find(
        (b) => b.bookId && b.bookId._id === bookId && !b.returned
      );

      if (!activeBorrow) {
        alert('No active borrow record found for this book');
        return;
      }

      await axios.put(
        `/api/borrow/return/${activeBorrow._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Book returned successfully!');
      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, available: true } : book
        )
      );
      setFilteredBooks((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, available: true } : book
        )
      );
    } catch {
      alert('Failed to return book');
    }
  };

  const handleReviewSubmit = async (bookId) => {
    if (!token) return alert('Please log in');

    try {
      await axios.post(
        '/api/reviews',
        {
          bookId,
          rating: ratings[bookId] || 1,
          comment: reviews[bookId] || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Review submitted!');
      setReviews((prev) => ({ ...prev, [bookId]: '' }));
      setRatings((prev) => ({ ...prev, [bookId]: 1 }));

      // Refresh books to get updated review list
      const res = await axios.get('/api/books');
      setBooks(res.data);
      setFilteredBooks(
        selectedSemester === 'All'
          ? res.data
          : res.data.filter((book) => book.semester === selectedSemester)
      );
    } catch {
      alert('Failed to submit review');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="catalog-container">
      {/* ✅ HEADER */}
      <header className="catalog-header">
        <h1 onClick={() => navigate('/')}>📚 ETE Rental Library</h1>
        <nav className="catalog-nav">
          <button onClick={() => navigate('/')}>🏠 Home</button>
          {token && (
            <>
              <button onClick={() => navigate(role === 'admin' ? '/admin' : '/user')}>
                🧑‍💻 {role === 'admin' ? 'Admin Panel' : 'User Panel'}
              </button>
              <button onClick={handleLogout}>🚪 Logout</button>
            </>
          )}
        </nav>
      </header>

      {/* ✅ FILTER */}
      <div className="filter-container">
        <label htmlFor="semester-select">🎓 Filter by Semester:</label>
        <select
          id="semester-select"
          value={selectedSemester}
          onChange={handleSemesterChange}
        >
          <option value="All">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>{sem}th Semester</option>
          ))}
        </select>
      </div>

      {/* ✅ BOOK LIST */}
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="book-list">
          {filteredBooks.map((book) => (
            <div key={book._id} className="book-item">
              <img src={book.coverImage} alt={book.title} className="book-image" />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Semester:</strong> {book.semester}th</p>
                <p className={`status ${book.available ? 'available' : 'borrowed'}`}>
                  {book.available ? '✅ Available' : '❌ Borrowed'}
                </p>

                {book.available ? (
                  <button className="borrow-btn" onClick={() => handleBorrow(book._id)}>
                    Borrow
                  </button>
                ) : (
                  <button className="return-btn" onClick={() => handleReturn(book._id)}>
                    Return
                  </button>
                )}

                {/* ✅ Review Input */}
                <div className="review-section">
                  <textarea
                    value={reviews[book._id] || ''}
                    onChange={(e) =>
                      setReviews((prev) => ({
                        ...prev,
                        [book._id]: e.target.value
                      }))
                    }
                    placeholder="Write a review..."
                  />
                  <select
                    value={ratings[book._id] || 1}
                    onChange={(e) =>
                      setRatings((prev) => ({
                        ...prev,
                        [book._id]: Number(e.target.value)
                      }))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button className="review-btn" onClick={() => handleReviewSubmit(book._id)}>
                    Submit
                  </button>
                </div>

                {/* ✅ Show Reviews */}
                <div className="review-list">
                  <h4>Reviews:</h4>
                  {book.reviews?.length ? (
                    book.reviews.map((rev, i) => (
                      <p key={i}>
                        <strong>{rev.userId?.name}</strong>: {rev.comment} ⭐{rev.rating}
                      </p>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FOOTER */}
      <footer className="catalog-footer">
        <p>&copy; 2025 ETE Rental Library | Designed by Shahril Nazim</p>
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPanel.css';

export default function UserPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState({});
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ✅ Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data || {});  // Set the user data
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    if (token) {  // Only attempt to fetch if there's a token available
      fetchUser();
    } else {
      console.error('Token is missing');
    }
  }, [token]);

  // ✅ Fetch borrow history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/borrow', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userBorrows = res.data.filter(b => b.userId?._id === userId);
        setBorrowHistory(userBorrows);
      } catch (err) {
        console.error('Failed to fetch borrow history');
      }
    };

    fetchHistory();
  }, [token, userId]);

  // ✅ Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/books');
        const allReviews = [];

        res.data.forEach(book => {
          book.reviews?.forEach(review => {
            if (review.userId?._id === userId) {
              allReviews.push({
                bookTitle: book.title,
                comment: review.comment,
                rating: review.rating
              });
            }
          });
        });

        setMyReviews(allReviews);
      } catch (err) {
        console.error('Failed to fetch reviews');
      }
    };

    fetchReviews();
  }, [token, userId]);

  return (
    <div className="user-container">
      <h2 className="user-heading">👤 User Panel</h2>

      {/* ✅ Show user info */}
      {user?.name && (
        <div className="user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <div className="user-grid">
        <div className="user-card">
          <h3>📚 Browse Books</h3>
          <button onClick={() => navigate('/books')} className="user-button">Go</button>
        </div>
        <div className="user-card">
          <h3>📖 My Borrow History</h3>
          {borrowHistory.length === 0 ? (
            <p>No books borrowed yet.</p>
          ) : (
            <ul className="history-list">
              {borrowHistory.map((b, i) => (
                <li key={i}>
                  <strong>{b.bookId?.title}</strong> — {b.returned ? '✅ Returned' : '❌ Not Returned'}
                  <br />
                  <small>Borrowed: {new Date(b.borrowDate).toLocaleDateString()}</small>
                  {b.returned && b.returnDate && (
                    <><br /><small>Returned: {new Date(b.returnDate).toLocaleDateString()}</small></>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="user-card">
          <h3>✍️ My Reviews</h3>
          {myReviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul className="review-list">
              {myReviews.map((r, i) => (
                <li key={i}>
                  <strong>{r.bookTitle}</strong> — {r.comment} ⭐{r.rating}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/')} className="user-home-btn">🏠 Home</button>
        <button onClick={handleLogout} className="user-logout-btn">🚪 Logout</button>
      </div>

      {/* ✅ FOOTER */}
      <footer className="catalog-footer">
        <p>&copy; 2025 ETE Rental Library | Designed BY SN</p>
      </footer>
    </div>
  );
}

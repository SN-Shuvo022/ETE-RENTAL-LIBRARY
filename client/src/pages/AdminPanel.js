import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [users, setUsers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('addBook');

  const token = localStorage.getItem('token');

  // 🔁 useEffect now safely calls the correct fetch logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const res = await axios.get('/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(res.data);
        } else if (activeTab === 'borrowed') {
          const res = await axios.get('/api/borrow', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBorrowedBooks(res.data);
        } else if (activeTab === 'deleteBook' || activeTab === 'viewBooks') {
          const res = await axios.get('/api/books', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBooks(res.data);
        }
      } catch (err) {
        alert('Failed to fetch data');
        console.error(err);
      }
    };

    fetchData();
  }, [activeTab, token]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/books',
        { title, author, genre, coverImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Book added!');
      setTitle('');
      setAuthor('');
      setGenre('');
      setCoverImage('');
    } catch (err) {
      alert('Failed to add book');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      alert('Book deleted successfully!');
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  return (
    <div className="admin-container">
      <h2>📘 Admin Dashboard</h2>

      {/* ✅ Navigation Tabs */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('addBook')} className={activeTab === 'addBook' ? 'active' : ''}>📗 Add Book</button>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>📋 View Users</button>
        <button onClick={() => setActiveTab('borrowed')} className={activeTab === 'borrowed' ? 'active' : ''}>📚 Borrowed Books</button>
        <button
             onClick={() => setActiveTab('deleteBook')}
             className={`delete-tab ${activeTab === 'deleteBook' ? 'active' : ''}`}
              >
          🗑 Delete Books
        </button>



        <button onClick={() => setActiveTab('viewBooks')} className={activeTab === 'viewBooks' ? 'active' : ''}>📖 View All Books</button>
      </div>

      {/* ✅ Content Section */}
      <div className="admin-section">
        {activeTab === 'addBook' && (
          <form onSubmit={handleAddBook} className="admin-form">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" required />
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
            <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
            <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Cover Image URL" required />
            <button type="submit">Add Book</button>
          </form>
        )}

        {activeTab === 'users' && (
          <div className="admin-list">
            <h3>👥 All Users</h3>
            <ul>
              {users.map((u) => (
                <li key={u._id}>
                  <strong>{u.name}</strong> — {u.email} ({u.role})
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'borrowed' && (
          <div className="admin-list">
            <h3>📖 Borrowed Books</h3>
            <ul>
              {borrowedBooks.map((b) => (
                <li key={b._id}>
                  <strong>{b.bookId?.title}</strong> borrowed by {b.userId?.name} on {new Date(b.borrowDate).toLocaleDateString()} {' '}
                  {b.returned ? '✅ Returned' : '❌ Not returned'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'deleteBook' && (
          <div className="admin-list">
            <h3>🗑 Book List (Delete)</h3>
            <ul>
              {books.map((book) => (
                <li key={book._id}>
                  <strong>{book.title}</strong> — {book.author} [{book.genre}]
                  <button className="delete-btn" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'viewBooks' && (
          <div className="admin-list">
            <h3>📖 All Books</h3>
            <ul>
              {books.map((book) => (
                <li key={book._id}>
                  <strong>{book.title}</strong> — {book.author} [{book.genre}]
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className="catalog-footer">
        <p>&copy; 2025 ETE Rental Library | Designed by Shahril Nazim</p>
      </footer>
    </div>
  );
}

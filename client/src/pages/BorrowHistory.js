import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BorrowHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view borrow history');
        return;
      }

      try {
        const res = await axios.get('/api/borrow', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecords(res.data);
      } catch (err) {
        alert('Failed to load borrow history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📚 Your Borrow History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No borrow records found.</p>
      ) : (
        <ul>
          {records.map((record) => (
            <li key={record._id} style={{ marginBottom: '1rem' }}>
              <h4>{record.bookId.title}</h4>
              <p><strong>Author:</strong> {record.bookId.author}</p>
              <p><strong>Genre:</strong> {record.bookId.genre}</p>
              <p><strong>Borrowed On:</strong> {new Date(record.borrowDate).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                {record.returned ? (
                  <>
                    Returned ✅ on {new Date(record.returnDate).toLocaleDateString()}
                  </>
                ) : (
                  <span style={{ color: 'red' }}>Not Returned ❌</span>
                )}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

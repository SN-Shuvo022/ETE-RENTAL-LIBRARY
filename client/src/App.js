import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookCatalog from './pages/BookCatalog';
import BorrowHistory from './pages/BorrowHistory';
import AdminPanel from './pages/AdminPanel';
import UserPanel from './pages/UserPanel';
function App() {
  return (
    <Router>
       <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={<BookCatalog />} />
          <Route path="/history" element={<BorrowHistory />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user" element={<UserPanel />} />
        </Routes>
    </Router>
  );
}

export default App;

// server/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js'; // ✅ NEW: Book routes
import borrowRoutes from './routes/borrowRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);     // 🔐 Login & Signup
app.use('/api/books', bookRoutes);    // 📚 Book catalog (add/view/edit/delete)
app.use('/api/borrow', borrowRoutes); // 📥 Borrow/Return routes
app.use('/api/reviews', reviewRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🎉 Welcome to ETE Rental Library API');
});

import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

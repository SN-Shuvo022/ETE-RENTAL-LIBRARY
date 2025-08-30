import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';  // Import the User model

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);

// ✅ New route to get current user info
router.get('/me', authMiddleware, getCurrentUser);

// ✅ Route to get all users (admin only)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // Fetch all users from the database
    const users = await User.find();  // Get all users
    res.json(users);  // Return the list of users
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

export default router;

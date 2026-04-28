import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  createAgent,
  getAgents,
  deleteAgent,
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

// Agent management — admin only
router.post('/agents',       protect, isAdmin, createAgent);
router.get('/agents',        protect, isAdmin, getAgents);
router.delete('/agents/:id', protect, isAdmin, deleteAgent);

export default router;
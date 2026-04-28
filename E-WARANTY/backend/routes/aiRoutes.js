import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAIResponse } from '../controllers/aiController.js';

const router = express.Router();

router.post('/assist', protect, getAIResponse);

export default router;

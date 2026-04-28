import express from 'express';
import {
  getWarranties,
  getWarrantyById,
  getExpiringWarranties,
  updateWarrantyStatus,
  markAsNotified,
  getWarrantyStats,
} from '../controllers/warrantyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getWarranties);
router.get('/stats/summary', getWarrantyStats);
router.get('/expiring/list', getExpiringWarranties);
router.put('/status/update', updateWarrantyStatus);
router.get('/:id', getWarrantyById);
router.put('/:id/notify', markAsNotified);

export default router;

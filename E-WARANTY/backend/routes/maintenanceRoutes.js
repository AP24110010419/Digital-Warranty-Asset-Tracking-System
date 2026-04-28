import express from 'express';
import {
  createMaintenance,
  getMaintenanceByProduct,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceStats,
} from '../controllers/maintenanceController.js';
import { protect } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', upload.single('document'), handleUploadError, createMaintenance);
router.get('/', getAllMaintenance);
router.get('/stats/summary', getMaintenanceStats);
router.get('/product/:productId', getMaintenanceByProduct);
router.get('/:id', getMaintenanceById);
router.put('/:id', upload.single('document'), handleUploadError, updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;

import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', upload.fields([{ name: 'invoice' }, { name: 'warrantyDoc' }, { name: 'productImage' }]), handleUploadError, createProduct);
router.get('/', getProducts);
router.get('/stats/dashboard', getDashboardStats);
router.get('/:id', getProductById);
router.put('/:id', upload.fields([{ name: 'invoice' }, { name: 'warrantyDoc' }, { name: 'productImage' }]), handleUploadError, updateProduct);
router.delete('/:id', deleteProduct);

export default router;

import mongoose from 'mongoose';
import { WARRANTY_STATUS } from '../config/constants.js';

const warrantyRecordSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    daysRemaining: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        WARRANTY_STATUS.ACTIVE,
        WARRANTY_STATUS.EXPIRING_SOON,
        WARRANTY_STATUS.EXPIRED,
      ],
      default: WARRANTY_STATUS.ACTIVE,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    notificationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const WarrantyRecord = mongoose.model('WarrantyRecord', warrantyRecordSchema);
export default WarrantyRecord;

import mongoose from 'mongoose';
import { MAINTENANCE_TYPES } from '../config/constants.js';

const maintenanceHistorySchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: [
        MAINTENANCE_TYPES.REPAIR,
        MAINTENANCE_TYPES.MAINTENANCE,
        MAINTENANCE_TYPES.INSPECTION,
        MAINTENANCE_TYPES.REPLACEMENT,
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: 1000,
    },
    cost: {
      type: Number,
      min: 0,
    },
    technician: {
      type: String,
      trim: true,
    },
    documentUrl: {
      type: String,
    },
    documentFileName: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceHistory = mongoose.model('MaintenanceHistory', maintenanceHistorySchema);
export default MaintenanceHistory;

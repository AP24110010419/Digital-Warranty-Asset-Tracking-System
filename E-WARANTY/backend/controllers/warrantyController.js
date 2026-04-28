import WarrantyRecord from '../models/WarrantyRecord.js';
import Product from '../models/Product.js';
import { HTTP_STATUS } from '../config/constants.js';
import { calculateWarrantyStatus, calculateDaysRemaining } from '../utils/warrantyCalculator.js';

export const getWarranties = async (req, res, next) => {
  try {
    const warranties = await WarrantyRecord.find({ userId: req.user.id })
      .populate('productId', 'name category purchasePrice')
      .sort({ expiryDate: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: warranties.length,
      warranties,
    });
  } catch (error) {
    next(error);
  }
};

export const getWarrantyById = async (req, res, next) => {
  try {
    const warranty = await WarrantyRecord.findById(req.params.id).populate('productId');

    if (!warranty || warranty.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Warranty record not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      warranty,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiringWarranties = async (req, res, next) => {
  try {
    const warranties = await WarrantyRecord.find({
      userId: req.user.id,
      status: 'EXPIRING_SOON',
    })
      .populate('productId', 'name')
      .sort({ expiryDate: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: warranties.length,
      warranties,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWarrantyStatus = async (req, res, next) => {
  try {
    const warranties = await WarrantyRecord.find({ userId: req.user.id });

    for (const warranty of warranties) {
      const newStatus = calculateWarrantyStatus(warranty.expiryDate);
      const newDaysRemaining = calculateDaysRemaining(warranty.expiryDate);

      if (newStatus !== warranty.status || newDaysRemaining !== warranty.daysRemaining) {
        warranty.status = newStatus;
        warranty.daysRemaining = newDaysRemaining;
        await warranty.save();
      }
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warranty statuses updated',
    });
  } catch (error) {
    next(error);
  }
};

export const markAsNotified = async (req, res, next) => {
  try {
    const warranty = await WarrantyRecord.findById(req.params.id);

    if (!warranty || warranty.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Warranty record not found',
      });
    }

    warranty.isNotified = true;
    warranty.notificationDate = new Date();
    await warranty.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Marked as notified',
      warranty,
    });
  } catch (error) {
    next(error);
  }
};

export const getWarrantyStats = async (req, res, next) => {
  try {
    const warranties = await WarrantyRecord.find({ userId: req.user.id });

    const stats = {
      total: warranties.length,
      active: warranties.filter((w) => w.status === 'ACTIVE').length,
      expiringsSoon: warranties.filter((w) => w.status === 'EXPIRING_SOON').length,
      expired: warranties.filter((w) => w.status === 'EXPIRED').length,
      notNotified: warranties.filter((w) => !w.isNotified && w.status === 'EXPIRING_SOON').length,
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

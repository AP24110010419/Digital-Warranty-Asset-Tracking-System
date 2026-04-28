import MaintenanceHistory from '../models/MaintenanceHistory.js';
import Product from '../models/Product.js';
import { HTTP_STATUS } from '../config/constants.js';
import { validateMaintenanceData } from '../utils/validators.js';

export const createMaintenance = async (req, res, next) => {
  try {
    const { productId, type, date, description, cost, technician, notes } = req.body;

    // Validate data
    const validation = validateMaintenanceData({
      type,
      date,
      description,
    });

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Check if product exists and belongs to user
    const product = await Product.findById(productId);
    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Create maintenance record
    const maintenance = await MaintenanceHistory.create({
      productId,
      userId: req.user.id,
      type,
      date,
      description,
      cost,
      technician,
      documentUrl: req.file?.path,
      documentFileName: req.file?.originalname,
      notes,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Maintenance record created successfully',
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists and belongs to user
    const product = await Product.findById(productId);
    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    const maintenance = await MaintenanceHistory.find({ productId }).sort({ date: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: maintenance.length,
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMaintenance = async (req, res, next) => {
  try {
    const maintenance = await MaintenanceHistory.find({ userId: req.user.id })
      .populate('productId', 'name')
      .sort({ date: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: maintenance.length,
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceById = async (req, res, next) => {
  try {
    const maintenance = await MaintenanceHistory.findById(req.params.id).populate('productId');

    if (!maintenance || maintenance.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const { type, date, description, cost, technician, notes } = req.body;

    let maintenance = await MaintenanceHistory.findById(req.params.id);

    if (!maintenance || maintenance.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    if (type) maintenance.type = type;
    if (date) maintenance.date = date;
    if (description) maintenance.description = description;
    if (cost !== undefined) maintenance.cost = cost;
    if (technician) maintenance.technician = technician;
    if (notes) maintenance.notes = notes;

    if (req.file) {
      maintenance.documentUrl = req.file.path;
      maintenance.documentFileName = req.file.originalname;
    }

    await maintenance.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Maintenance record updated successfully',
      maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await MaintenanceHistory.findById(req.params.id);

    if (!maintenance || maintenance.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    await MaintenanceHistory.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Maintenance record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceStats = async (req, res, next) => {
  try {
    const maintenance = await MaintenanceHistory.find({ userId: req.user.id });

    const stats = {
      total: maintenance.length,
      byType: {
        repair: maintenance.filter((m) => m.type === 'REPAIR').length,
        maintenance: maintenance.filter((m) => m.type === 'MAINTENANCE').length,
        inspection: maintenance.filter((m) => m.type === 'INSPECTION').length,
        replacement: maintenance.filter((m) => m.type === 'REPLACEMENT').length,
      },
      totalCost: maintenance.reduce((sum, m) => sum + (m.cost || 0), 0),
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

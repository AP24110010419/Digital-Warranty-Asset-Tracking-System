import Product from '../models/Product.js';
import WarrantyRecord from '../models/WarrantyRecord.js';
import { HTTP_STATUS } from '../config/constants.js';
import { validateProductData } from '../utils/validators.js';
import {
  calculateExpiryDate,
  calculateWarrantyStatus,
  calculateDaysRemaining,
} from '../utils/warrantyCalculator.js';

export const createProduct = async (req, res, next) => {
  try {
    let { name, description, category, purchaseDate, purchasePrice, warrantyPeriod, serialNumber, modelNumber, manufacturer, notes } = req.body;

    // Convert string values from FormData to proper types
    purchasePrice = parseFloat(purchasePrice);
    warrantyPeriod = parseInt(warrantyPeriod, 10);

    // Validate data
    const validation = validateProductData({
      name,
      category,
      purchaseDate,
      purchasePrice,
      warrantyPeriod,
    });

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Create product
    const product = await Product.create({
      userId: req.user.id,
      name,
      description,
      category,
      purchaseDate,
      purchasePrice,
      warrantyPeriod,
      serialNumber,
      modelNumber,
      manufacturer,
      invoiceUrl: req.files?.invoice?.[0]?.path,
      invoiceFileName: req.files?.invoice?.[0]?.originalname,
      warrantyDocUrl: req.files?.warrantyDoc?.[0]?.path,
      warrantyDocFileName: req.files?.warrantyDoc?.[0]?.originalname,
      productImageUrl: req.files?.productImage?.[0]?.path,
      productImageFileName: req.files?.productImage?.[0]?.originalname,
      notes,
    });

    // Calculate warranty details
    const expiryDate = calculateExpiryDate(purchaseDate, warrantyPeriod);
    const status = calculateWarrantyStatus(expiryDate);
    const daysRemaining = calculateDaysRemaining(expiryDate);

    // Create warranty record
    await WarrantyRecord.create({
      productId: product._id,
      userId: req.user.id,
      purchaseDate,
      expiryDate,
      daysRemaining,
      status,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Enrich with warranty info
    const productsWithWarranty = await Promise.all(
      products.map(async (product) => {
        const warranty = await WarrantyRecord.findOne({ productId: product._id });
        return {
          ...product.toObject(),
          warranty: warranty ? {
            expiryDate: warranty.expiryDate,
            status: warranty.status,
            daysRemaining: warranty.daysRemaining,
          } : null,
        };
      })
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: productsWithWarranty.length,
      products: productsWithWarranty,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    const warranty = await WarrantyRecord.findOne({ productId: product._id });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      product: {
        ...product.toObject(),
        warranty: warranty ? {
          expiryDate: warranty.expiryDate,
          status: warranty.status,
          daysRemaining: warranty.daysRemaining,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let { name, description, category, purchaseDate, purchasePrice, warrantyPeriod, serialNumber, modelNumber, manufacturer, notes } = req.body;

    // Convert string values from FormData to proper types
    if (purchasePrice) purchasePrice = parseFloat(purchasePrice);
    if (warrantyPeriod) warrantyPeriod = parseInt(warrantyPeriod, 10);

    let product = await Product.findById(req.params.id);

    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if edit limit reached
    if (product.editCount >= 2) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Edit limit reached. You can only edit a product 2 times.',
      });
    }

    // Update product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (purchaseDate) product.purchaseDate = purchaseDate;
    if (purchasePrice) product.purchasePrice = purchasePrice;
    if (warrantyPeriod) product.warrantyPeriod = warrantyPeriod;
    if (serialNumber) product.serialNumber = serialNumber;
    if (modelNumber) product.modelNumber = modelNumber;
    if (manufacturer) product.manufacturer = manufacturer;
    if (notes) product.notes = notes;

    // Increment edit count
    product.editCount += 1;

    // Handle file uploads
    if (req.files?.invoice) {
      product.invoiceUrl = req.files.invoice[0].path;
      product.invoiceFileName = req.files.invoice[0].originalname;
    }
    if (req.files?.warrantyDoc) {
      product.warrantyDocUrl = req.files.warrantyDoc[0].path;
      product.warrantyDocFileName = req.files.warrantyDoc[0].originalname;
    }

    await product.save();

    // Update warranty record if dates changed
    if (purchaseDate || warrantyPeriod) {
      const expiryDate = calculateExpiryDate(purchaseDate || product.purchaseDate, warrantyPeriod || product.warrantyPeriod);
      const status = calculateWarrantyStatus(expiryDate);
      const daysRemaining = calculateDaysRemaining(expiryDate);

      await WarrantyRecord.findOneAndUpdate(
        { productId: product._id },
        {
          expiryDate,
          status,
          daysRemaining,
        }
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete warranty records
    await WarrantyRecord.deleteMany({ productId: product._id });

    await Product.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const warranties = await WarrantyRecord.find({ userId: req.user.id });

    const stats = {
      total: warranties.length,
      active: warranties.filter((w) => w.status === 'ACTIVE').length,
      expiringsSoon: warranties.filter((w) => w.status === 'EXPIRING_SOON').length,
      expired: warranties.filter((w) => w.status === 'EXPIRED').length,
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

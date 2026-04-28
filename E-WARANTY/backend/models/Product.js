import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Electronics',
        'Appliances',
        'Furniture',
        'Tools',
        'Vehicles',
        'Medical',
        'Other',
      ],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Please provide purchase date'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Please provide purchase price'],
      min: 0,
    },
    warrantyPeriod: {
      type: Number,
      required: [true, 'Please provide warranty period in months'],
      min: 1,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    invoiceUrl: {
      type: String,
    },
    invoiceFileName: {
      type: String,
    },
    warrantyDocUrl: {
      type: String,
    },
    warrantyDocFileName: {
      type: String,
    },
    productImageUrl: {
      type: String,
    },
    productImageFileName: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    editCount: {
      type: Number,
      default: 0,
      max: 2,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

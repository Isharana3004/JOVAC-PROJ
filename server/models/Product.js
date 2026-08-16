import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  model: {
    type: String,
    required: true,
    index: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String, // e.g. "Running", "Sneakers", "Basketball"
    required: true
  },
  gender: {
    type: String, // e.g. "Men", "Women", "Unisex"
    required: true
  },
  sizes: {
    type: [Number],
    required: true
  },
  store: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number, // Percentage discount (e.g. 38 for 38% off)
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  productUrl: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  sku: {
    type: String,
    required: true,
    index: true
  }
});

// Compound index to quickly find store listings for a specific normalized shoe model
productSchema.index({ brand: 1, model: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;

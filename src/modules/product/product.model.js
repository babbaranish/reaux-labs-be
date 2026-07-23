import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String },
    // Flavour names offered for this product, e.g. ['French Cake', 'Choco Blast'].
    flavours: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    nutrition: {
      servingSize: { type: String },
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
      sugar: { type: Number },
    },
    visibility: { type: String, enum: ['all', 'admin', 'user'], default: 'all' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({ isActive: 1, visibility: 1, category: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model('Product', productSchema);

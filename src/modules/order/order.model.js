import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],
    totalAmount: { type: Number },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number },
    promoCode: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model('Order', orderSchema);

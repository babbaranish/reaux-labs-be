import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    images: [{ type: String }],
    logo: { type: String },
    amenities: [{ type: String }],
    openingHours: {
      monday: { open: { type: String }, close: { type: String } },
      tuesday: { open: { type: String }, close: { type: String } },
      wednesday: { open: { type: String }, close: { type: String } },
      thursday: { open: { type: String }, close: { type: String } },
      friday: { open: { type: String }, close: { type: String } },
      saturday: { open: { type: String }, close: { type: String } },
      sunday: { open: { type: String }, close: { type: String } },
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

gymSchema.index({ isActive: 1, 'address.city': 1, createdAt: -1 });

export const Gym = mongoose.model('Gym', gymSchema);

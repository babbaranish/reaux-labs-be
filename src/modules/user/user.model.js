import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', default: null },
    gymIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gym' }],
    avatar: { type: String },
    height: { type: Number },
    weight: { type: Number },
    dateOfBirth: { type: Date },
    dateOfJoining: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    status: { type: String, enum: ['active', 'disabled', 'deleted'], default: 'active' },
    deletedAt: { type: Date, default: null },
    savedAddresses: [
      {
        label: { type: String, trim: true },           // e.g. "Home", "Work"
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        phone: { type: String, trim: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    // Device push tokens (Expo format: ExponentPushToken[xxx])
    fcmTokens: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ gymId: 1 });

userSchema.pre('save', async function () {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    const first = this.firstName || '';
    const last = this.lastName || '';
    if (first || last) this.name = `${first} ${last}`.trim();
  }
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, env.BCRYPT_ROUNDS);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);

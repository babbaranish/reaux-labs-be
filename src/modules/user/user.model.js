import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', default: null },
    avatar: { type: String },
    height: { type: Number },
    weight: { type: Number },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ gymId: 1 });

userSchema.pre('save', async function () {
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

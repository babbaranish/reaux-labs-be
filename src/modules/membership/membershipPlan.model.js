import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    durationDays: { type: Number, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

membershipPlanSchema.index({ gymId: 1, isActive: 1 });

export const MembershipPlan = mongoose.model(
  'MembershipPlan',
  membershipPlanSchema
);

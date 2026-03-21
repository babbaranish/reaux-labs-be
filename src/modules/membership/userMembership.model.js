import mongoose from 'mongoose';

const userMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feesAmount: { type: Number, default: 0 },
    feesPaid: { type: Number, default: 0 },
    feesDue: { type: Number, default: 0 },
    advanceCredit: { type: Number, default: 0 },
    lastPaymentDate: { type: Date, default: null },
    paymentHistory: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

userMembershipSchema.index({ userId: 1, gymId: 1, status: 1 });
userMembershipSchema.index({ endDate: 1 });

export const UserMembership = mongoose.model(
  'UserMembership',
  userMembershipSchema
);

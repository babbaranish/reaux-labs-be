import mongoose from 'mongoose';

const bmiRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },
    category: {
      type: String,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
      required: true,
    },
  },
  { timestamps: true }
);

bmiRecordSchema.index({ userId: 1, createdAt: -1 });

export const BMIRecord = mongoose.model('BMIRecord', bmiRecordSchema);

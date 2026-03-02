import mongoose from 'mongoose';

const bmiRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bmi: { type: Number, required: true },
    bmr: { type: Number },
    category: {
      type: String,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
      required: true,
    },
    message: { type: String },
  },
  { timestamps: true }
);

bmiRecordSchema.index({ userId: 1, createdAt: -1 });

export const BMIRecord = mongoose.model('BMIRecord', bmiRecordSchema);

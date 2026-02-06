import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: String },
    items: [mealItemSchema],
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true, trim: true },
    category: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'keto', 'vegan', 'other'],
      required: true,
    },
    meals: [mealSchema],
    image: { type: String },
    totalCalories: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

dietPlanSchema.index({ category: 1 });
dietPlanSchema.index({ isPublished: 1 });
dietPlanSchema.index({ createdBy: 1 });

export const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

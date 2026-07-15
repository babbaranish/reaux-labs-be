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
      enum: ['weight-loss', 'muscle-gain', 'bulking', 'cutting', 'other'],
      required: true,
    },
    dietType: {
      type: String,
      enum: ['veg', 'non-veg', 'both'],
      default: 'both',
    },
    meals: [mealSchema],
    image: { type: String },
    totalCalories: { type: Number },
    // Plan-level macro targets (grams). Shown on the plan; independent of the
    // per-meal-item macros.
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followersCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

dietPlanSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
dietPlanSchema.index({ createdBy: 1 });

export const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

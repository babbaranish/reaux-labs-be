import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    duration: { type: Number },
    restTime: { type: Number },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'crossfit', 'other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: { type: Number },
    caloriesBurn: { type: Number },
    exercises: [exerciseSchema],
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

workoutSchema.index({ isPublished: 1, category: 1, difficulty: 1, createdAt: -1 });
workoutSchema.index({ createdBy: 1 });

export const Workout = mongoose.model('Workout', workoutSchema);

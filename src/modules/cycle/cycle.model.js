import mongoose from 'mongoose';

const compoundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
  },
  { _id: false }
);

const phaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    label: { type: String },
    note: { type: String },
    compounds: [compoundSchema],
  },
  { _id: false }
);

const pctItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String },
    duration: { type: String },
  },
  { _id: false }
);

const pctSchema = new mongoose.Schema(
  {
    startNote: { type: String },
    items: [pctItemSchema],
  },
  { _id: false }
);

const riskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high'] },
  },
  { _id: false }
);

const cyclePlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true, trim: true },
    category: {
      type: String,
      enum: ['bulking', 'cutting', 'recomp', 'pct', 'other'],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    type: {
      type: String,
      enum: ['oral', 'injectable', 'inj-oral'],
    },
    durationWeeks: { type: Number },
    estimatedGain: { type: String },
    image: { type: String },
    phases: [phaseSchema],
    pct: pctSchema,
    risks: [riskSchema],
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

cyclePlanSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
cyclePlanSchema.index({ createdBy: 1 });

export const CyclePlan = mongoose.model('CyclePlan', cyclePlanSchema);

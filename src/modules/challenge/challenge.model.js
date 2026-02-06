import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['steps', 'workout', 'diet', 'custom'], required: true },
    target: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        progress: { type: Number, default: 0 },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

challengeSchema.index({ isActive: 1, startDate: 1 });
challengeSchema.index({ 'participants.userId': 1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);

import mongoose from 'mongoose';

const reelCommentSchema = new mongoose.Schema(
  {
    reelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

reelCommentSchema.index({ reelId: 1, createdAt: -1 });

export const ReelComment = mongoose.model('ReelComment', reelCommentSchema);

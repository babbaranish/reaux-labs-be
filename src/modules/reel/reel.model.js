import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    caption: { type: String },
    linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reelSchema.index({ author: 1 });
reelSchema.index({ createdAt: -1 });

export const Reel = mongoose.model('Reel', reelSchema);

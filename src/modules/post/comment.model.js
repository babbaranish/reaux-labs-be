import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);

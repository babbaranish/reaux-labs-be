import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    mediaType: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    mediaUrl: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    hashtags: [{ type: String }],
    category: { type: String },
  },
  { timestamps: true }
);

postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ category: 1 });

export const Post = mongoose.model('Post', postSchema);

import httpStatus from 'http-status';
import { Post } from './post.model.js';
import { Comment } from './comment.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField, addIsLiked } from '../../shared/socialToggle.js';
import { createNotification } from '../../shared/pushNotification.js';

const extractHashtags = (content) => {
  const matches = content.match(/#(\w+)/g);
  if (!matches) return [];
  return matches.map((tag) => tag.slice(1).toLowerCase());
};

export const createPost = async (data, userId) => {
  const hashtags = data.hashtags || extractHashtags(data.content || '');
  const post = await Post.create({
    ...data,
    author: userId,
    hashtags,
  });
  return post;
};

export const getPosts = async (query, userId) => {
  const filter = {};

  if (query.hashtag) {
    filter.hashtags = query.hashtag;
  }

  if (query.category) {
    filter.category = query.category;
  }

  const result = await paginate(Post, filter, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar role' },
    select: '-likes',
  });

  result.data = await addIsLiked(Post, result.data, userId);
  return result;
};

export const getPostById = async (id, userId) => {
  const [post, comments] = await Promise.all([
    Post.findById(id)
      .populate('author', 'name avatar role')
      .select('-likes')
      .lean(),
    Comment.find({ postId: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'name avatar')
      .lean(),
  ]);

  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  // Count a view — but not the author viewing their own post. Fire-and-forget.
  Post.updateOne({ _id: id, author: { $ne: userId } }, { $inc: { viewsCount: 1 } }).catch(() => {});

  const [enriched] = await addIsLiked(Post, [post], userId);
  return { post: enriched, comments };
};

/**
 * Per-post analytics (author or admin/superadmin only). Totals are real; the
 * 7-day trend uses actual comment activity per day (the only time-stamped
 * engagement signal we store).
 */
export const getPostAnalytics = async (postId, user) => {
  const post = await Post.findById(postId)
    .select('author viewsCount likesCount commentsCount')
    .lean();

  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const isOwner = post.author.toString() === user.id.toString();
  const isAdmin = ['admin', 'superadmin'].includes(user.role);
  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized to view analytics for this post', httpStatus.FORBIDDEN);
  }

  const totalViews = post.viewsCount || 0;
  const totalLikes = post.likesCount || 0;
  const totalComments = post.commentsCount || 0;
  const engagementRate = totalViews > 0
    ? Number((((totalLikes + totalComments) / totalViews) * 100).toFixed(1))
    : 0;

  const DAY = 24 * 60 * 60 * 1000;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const seriesLabels = [];
  const dayCountPromises = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(startOfToday.getTime() - i * DAY);
    const dayEnd = new Date(dayStart.getTime() + DAY);
    seriesLabels.push(dayLabels[dayStart.getDay()]);
    dayCountPromises.push(
      Comment.countDocuments({ postId, createdAt: { $gte: dayStart, $lt: dayEnd } })
    );
  }

  const weekAgo = new Date(now.getTime() - 7 * DAY);
  const twoWeeksAgo = new Date(now.getTime() - 14 * DAY);

  const [series, thisWeek, lastWeek] = await Promise.all([
    Promise.all(dayCountPromises),
    Comment.countDocuments({ postId, createdAt: { $gte: weekAgo } }),
    Comment.countDocuments({ postId, createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } }),
  ]);

  let engagementDelta;
  if (lastWeek > 0) {
    engagementDelta = Number((((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1));
  } else if (thisWeek > 0) {
    engagementDelta = 100;
  }

  return {
    postId,
    totalViews,
    totalLikes,
    totalComments,
    engagementRate,
    ...(engagementDelta !== undefined && { engagementDelta }),
    periodLabel: 'Last 7 Days',
    series,
    seriesLabels,
  };
};

export const likePost = async (postId, userId) => {
  const result = await toggleArrayField(Post, postId, userId, 'likes', { countField: 'likesCount' });

  if (result.isLiked && result.author.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.author,
          title: 'New Like',
          message: `${user.name} liked your post`,
          type: 'community',
          metadata: { postId },
        }).catch(() => {});
      }
    });
  }

  return result;
};

export const addComment = async (postId, userId, content) => {
  const post = await Post.findById(postId).select('author').lean();
  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const [comment] = await Promise.all([
    Comment.create({ postId, author: userId, content }),
    Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }),
  ]);

  if (post.author.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: post.author,
          title: 'New Comment',
          message: `${user.name} commented on your post`,
          type: 'community',
          metadata: { postId, commentId: comment._id },
        }).catch(() => {});
      }
    });
  }

  return comment.populate('author', 'name avatar');
};

export const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }
  // Clean up comments
  await Comment.deleteMany({ postId });
  return post;
};

export const deleteComment = async (postId, commentId, userId, userRole) => {
  const comment = await Comment.findById(commentId).lean();
  if (!comment || comment.postId.toString() !== postId) {
    throw new AppError('Comment not found', httpStatus.NOT_FOUND);
  }

  // Only comment author or superadmin can delete
  if (comment.author.toString() !== userId.toString() && userRole !== 'superadmin') {
    throw new AppError('Not authorized to delete this comment', httpStatus.FORBIDDEN);
  }

  await Promise.all([
    Comment.findByIdAndDelete(commentId),
    Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } }),
  ]);
};

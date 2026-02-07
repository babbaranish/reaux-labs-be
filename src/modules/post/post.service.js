import httpStatus from 'http-status';
import { Post } from './post.model.js';
import { Comment } from './comment.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField } from '../../shared/socialToggle.js';

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

export const getPosts = async (query) => {
  const filter = {};

  if (query.hashtag) {
    filter.hashtags = query.hashtag;
  }

  if (query.category) {
    filter.category = query.category;
  }

  return paginate(Post, filter, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar' },
    select: '-likes',
  });
};

export const getPostById = async (id) => {
  const [post, comments] = await Promise.all([
    Post.findById(id)
      .populate('author', 'name avatar')
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

  return { post, comments };
};

export const likePost = async (postId, userId) => {
  return toggleArrayField(Post, postId, userId, 'likes', { countField: 'likesCount' });
};

export const addComment = async (postId, userId, content) => {
  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const [comment] = await Promise.all([
    Comment.create({ postId, author: userId, content }),
    Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }),
  ]);

  return comment.populate('author', 'name avatar');
};

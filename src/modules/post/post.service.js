import httpStatus from 'http-status';
import { Post } from './post.model.js';
import { Comment } from './comment.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

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

  const result = await paginate(Post, filter, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar' },
  });

  return result;
};

export const getPostById = async (id) => {
  const post = await Post.findById(id).populate('author', 'name avatar');
  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const comments = await Comment.find({ postId: id })
    .sort({ createdAt: -1 })
    .populate('author', 'name avatar');

  return { post, comments };
};

export const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const likeIndex = post.likes.indexOf(userId);

  if (likeIndex === -1) {
    post.likes.push(userId);
    post.likesCount = post.likes.length;
  } else {
    post.likes.splice(likeIndex, 1);
    post.likesCount = post.likes.length;
  }

  await post.save();
  return post;
};

export const addComment = async (postId, userId, content) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', httpStatus.NOT_FOUND);
  }

  const comment = await Comment.create({
    postId,
    author: userId,
    content,
  });

  post.commentsCount += 1;
  await post.save();

  const populated = await comment.populate('author', 'name avatar');
  return populated;
};

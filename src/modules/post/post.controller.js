import httpStatus from 'http-status';
import * as postService from './post.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Runs after multer, before validation: Cloudinary's URL is the only mediaUrl a
// post may carry, so derive it (and mediaType) from the uploaded file.
export const attachUploadedMedia = (req, res, next) => {
  if (req.file?.path) {
    req.body.mediaUrl = req.file.path;
    req.body.mediaType = req.file.mimetype?.startsWith('video/') ? 'video' : 'image';
  } else if (!req.body.mediaUrl) {
    req.body.mediaType = 'text';
  }
  next();
};

export const create = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.body, req.user.id);
  return sendSuccess(res, post, httpStatus.CREATED, 'Post created');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await postService.getPosts(req.query, req.user.id);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const result = await postService.getPostById(req.params.id, req.user.id);
  return sendSuccess(res, result);
});

export const like = asyncHandler(async (req, res) => {
  const post = await postService.likePost(req.params.id, req.user.id);
  return sendSuccess(res, post, httpStatus.OK, 'Like toggled');
});

export const comment = asyncHandler(async (req, res) => {
  const result = await postService.addComment(req.params.id, req.user.id, req.body.content);
  return sendSuccess(res, result, httpStatus.CREATED, 'Comment added');
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Post deleted');
});

export const deleteComment = asyncHandler(async (req, res) => {
  await postService.deleteComment(req.params.id, req.params.commentId, req.user.id, req.user.role);
  return sendSuccess(res, null, httpStatus.OK, 'Comment deleted');
});

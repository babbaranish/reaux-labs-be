import httpStatus from 'http-status';
import * as postService from './post.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.body, req.user.id);
  return sendSuccess(res, post, httpStatus.CREATED, 'Post created');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await postService.getPosts(req.query);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const result = await postService.getPostById(req.params.id);
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

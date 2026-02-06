import httpStatus from 'http-status';
import * as postService from './post.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const create = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body, req.user.id);
    return sendSuccess(res, post, httpStatus.CREATED, 'Post created');
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { data, pagination } = await postService.getPosts(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await postService.getPostById(req.params.id);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  try {
    const post = await postService.likePost(req.params.id, req.user.id);
    return sendSuccess(res, post, httpStatus.OK, 'Like toggled');
  } catch (error) {
    next(error);
  }
};

export const comment = async (req, res, next) => {
  try {
    const result = await postService.addComment(req.params.id, req.user.id, req.body.content);
    return sendSuccess(res, result, httpStatus.CREATED, 'Comment added');
  } catch (error) {
    next(error);
  }
};

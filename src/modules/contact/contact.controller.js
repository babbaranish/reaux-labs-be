import httpStatus from 'http-status';
import * as contactService from './contact.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const submit = asyncHandler(async (req, res) => {
  const contact = await contactService.submitContact(req.body);
  return sendSuccess(res, contact, httpStatus.CREATED, 'Your message has been received. We will get back to you soon.');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await contactService.getContacts(req.query);
  return sendPaginated(res, data, pagination);
});

export const resolve = asyncHandler(async (req, res) => {
  const contact = await contactService.resolveContact(req.params.id);
  return sendSuccess(res, contact, httpStatus.OK, 'Contact marked as resolved');
});

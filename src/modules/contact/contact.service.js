import httpStatus from 'http-status';
import { Contact } from './contact.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const submitContact = async (data) => {
  const contact = await Contact.create(data);
  return contact;
};

export const getContacts = async (query) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  return paginate(Contact, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const resolveContact = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status: 'resolved' },
    { new: true }
  ).lean();

  if (!contact) {
    throw new AppError('Contact submission not found', httpStatus.NOT_FOUND);
  }

  return contact;
};

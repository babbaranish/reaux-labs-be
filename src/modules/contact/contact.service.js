import httpStatus from 'http-status';
import { Contact } from './contact.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { createNotification } from '../../shared/pushNotification.js';

export const submitContact = async (data) => {
  const contact = await Contact.create(data);

  // Notify all superadmins
  User.find({ role: 'superadmin', status: 'active' }).select('_id').lean().then((admins) => {
    admins.forEach((admin) => {
      createNotification({
        userId: admin._id,
        title: 'New Contact Submission',
        message: `${data.name} submitted a contact form: "${data.message.slice(0, 80)}${data.message.length > 80 ? '...' : ''}"`,
        type: 'system',
        metadata: { contactId: contact._id },
      }).catch(() => {});
    });
  });

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

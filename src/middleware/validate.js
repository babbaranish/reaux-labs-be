import httpStatus from 'http-status';
import { sendError } from '../shared/response.js';

// The schemas wrap the request as { body, query, params }, so every issue path
// starts with one of these. Strip them so errors read as real field names.
const RESERVED = new Set(['body', 'query', 'params']);

// "dateOfBirth" / "min_order_amount" -> "Date Of Birth" / "Min Order Amount"
const labelFor = (field) =>
  field
    ? field
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[._]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^./, (c) => c.toUpperCase())
        .trim()
    : 'Request';

// Turn a raw Zod issue into a short, human-readable message that names the field
// and says what is actually wrong — instead of "Validation error".
const friendlyIssue = (issue) => {
  const path = (issue.path || []).filter((p) => !RESERVED.has(p));
  const field = path.join('.');
  const label = labelFor(field);
  const raw = String(issue.message || '');
  const low = raw.toLowerCase();

  if (
    (issue.code === 'invalid_type' && low.includes('received undefined')) ||
    low === 'required' ||
    low.includes('received undefined')
  ) {
    return `${label} is required`;
  }
  if (low.includes('email')) return `${label} must be a valid email`;
  if (issue.code === 'too_small') {
    const origin = issue.origin || issue.type;
    const min = issue.minimum;
    if (origin === 'array' || origin === 'set') {
      return min != null && min > 1 ? `${label} needs at least ${min} items` : `${label} is required`;
    }
    if (origin === 'number' || origin === 'bigint') return `${label} is too small`;
    return `${label} is too short`;
  }
  if (issue.code === 'too_big') {
    const origin = issue.origin || issue.type;
    if (origin === 'array' || origin === 'set') return `${label} has too many items`;
    if (origin === 'number' || origin === 'bigint') return `${label} is too large`;
    return `${label} is too long`;
  }
  if (
    issue.code === 'invalid_enum_value' ||
    issue.code === 'invalid_value' ||
    low.includes('invalid option') ||
    low.includes('invalid enum')
  ) {
    return `${label} has an invalid value`;
  }
  if (issue.code === 'invalid_type') {
    return `${label} is invalid`;
  }
  // Fallback: keep Zod's message but prefix the field so the user knows where.
  return field ? `${label}: ${raw}` : raw;
};

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const issues = result.error?.issues || [];
    const fieldErrors = {};
    const messages = [];

    for (const issue of issues) {
      const path = (issue.path || []).filter((p) => !RESERVED.has(p));
      const key = path.join('.') || 'request';
      const friendly = friendlyIssue(issue);
      (fieldErrors[key] = fieldErrors[key] || []).push(friendly);
      messages.push(friendly);
    }

    // De-dupe and keep the toast-friendly. fieldErrors is still returned so the
    // client can highlight individual inputs if it wants to.
    const unique = [...new Set(messages)];
    const message = unique.length ? unique.join('. ') : 'Validation error';

    return sendError(res, message, httpStatus.BAD_REQUEST, { fieldErrors });
  }

  // Apply transformed/coerced values back to req
  Object.assign(req, result.data);
  next();
};

import env from '../config/env.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured. Skipping email to:', to);
    return null;
  }

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env.EMAIL_FROM, name: env.EMAIL_FROM_NAME },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo API error (${res.status}): ${error}`);
  }

  return res.json();
};

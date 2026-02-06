import nodemailer from 'nodemailer';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    console.warn('SMTP not configured. Skipping email to:', to);
    return null;
  }

  const mailOptions = {
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

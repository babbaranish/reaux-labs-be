import nodemailer from 'nodemailer';
import dns from 'dns';
import env from '../config/env.js';

dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP_USER) {
    console.warn('SMTP not configured. Skipping email to:', to);
    return null;
  }

  const mailOptions = {
    from: env.SMTP_FROM || env.SMTP_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

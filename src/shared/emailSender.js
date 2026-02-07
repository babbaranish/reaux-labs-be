import nodemailer from 'nodemailer';
import { resolve4 } from 'dns/promises';
import env from '../config/env.js';

let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Resolve Gmail SMTP to IPv4 to avoid IPv6 issues on cloud platforms
  const host = env.SMTP_HOST || 'smtp.gmail.com';
  let resolvedHost = host;
  try {
    const addresses = await resolve4(host);
    resolvedHost = addresses[0];
  } catch {
    resolvedHost = host;
  }

  transporter = nodemailer.createTransport({
    host: resolvedHost,
    port: 465,
    secure: true,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      servername: host,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP_USER) {
    console.warn('SMTP not configured. Skipping email to:', to);
    return null;
  }

  const t = await getTransporter();
  return t.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to,
    subject,
    html,
  });
};

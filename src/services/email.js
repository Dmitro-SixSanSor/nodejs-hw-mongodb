import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

export const sendResetPasswordEmail = async (to, url) => {
  const from = process.env.SMTP_FROM;
  const subject = 'Reset your password';
  const html = `
    <p>We received a request to reset your password.</p>
    <p>Click the link below (valid for 5 minutes):</p>
    <p><a href="${url}">${url}</a></p>
  `;
  await mailer.sendMail({ from, to, subject, html });
};

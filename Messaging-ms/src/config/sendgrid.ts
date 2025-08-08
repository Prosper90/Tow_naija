import sgMail, { MailDataRequired } from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await sgMail.send(emailData as MailDataRequired);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
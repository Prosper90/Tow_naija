import { sendEmail } from '../config/nodemailerEmail';
import { TemplateService } from './templateService';
import { Twilio } from 'twilio';


const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID || '',
  process.env.TWILIO_AUTH_TOKEN || ''
);

export class MessageService {
  static async sendMessage({
    mediumType,
    medium,
    subject,
    content,
    templateType,
    user
  }: {
    mediumType: 'email' | 'sms';
    medium: string;
    subject?: string;
    content: string;
    templateType?: 'otp' | 'newsletter' | 'security' | 'general';
    user: string | null
  }) {
    if (mediumType === 'email') {
      // Send Email
      if(user !== null) {
         const html = TemplateService.getTemplate('welcome', user);
         await sendEmail({ to: medium, subject: subject || 'Notification', html});
      }
      const html = TemplateService.getTemplate(templateType, content);
      await sendEmail({ to: medium, subject: subject || 'Notification', html});
      console.log('Email sent successfully to', medium);
    } else if (mediumType === 'sms') {
      // Send SMS via Twilio
      const message = await twilioClient.messages.create({
        body: content,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: medium,
      });
      console.log('SMS sent successfully to', medium, 'SID:', message.sid);
    } else {
      throw new Error('Invalid medium type. Must be email or sms.');
    }
  }
}
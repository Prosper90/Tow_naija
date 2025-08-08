import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  html: { html: string; attachments: Array<{ filename: string; content: string; cid: string; }>};
}) => {
  try {
    console.log(process.env.SMTP_USER, "checking if the env are injected");
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM_ADDRESS,
    //   ...emailData,
    // });
    // Check if html is a string or an object with html and attachments

      // Extract html and attachments from the object
      const { html, attachments } = emailData.html;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM_ADDRESS,
        to: emailData.to,
        subject: emailData.subject,
        html,
        attachments,
      });
    

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
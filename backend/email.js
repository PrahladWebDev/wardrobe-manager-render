import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
      from: "Wardrobe Manager <no-reply@webdevprahlad.site>",
      to,
      subject,
      html,
    });
    console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
}

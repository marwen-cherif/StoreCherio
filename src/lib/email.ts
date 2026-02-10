import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not set. Emails will not be sent.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email sender configuration
export const emailConfig = {
    from: process.env.EMAIL_FROM || 'Eva Accessories <noreply@eva-accessories.com>',
    replyTo: process.env.EMAIL_REPLY_TO || 'contact@eva-accessories.com',
};

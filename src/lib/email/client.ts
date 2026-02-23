import { Resend } from 'resend';

export const createResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY);
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587'),                  
  auth: {
    user: process.env.SMTP_USER,   
    pass: process.env.SMTP_PASS 
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Auth System" <auth@example.com>',
      to: email,
      subject: 'Verify your email with OTP',
      html: `
        <h1>Welcome to DKS Auth System</h1>
        <p>Your OTP for email verification is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

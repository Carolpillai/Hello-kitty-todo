import nodemailer from 'nodemailer';
import os from 'os';

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'Hotmail', 'Yahoo'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendTaskNotification = async (emails, taskTitle, taskId) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Skipping email notification: EMAIL_USER or EMAIL_PASS not set in .env");
    return false;
  }

  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || `http://${getLocalIp()}:5173`;
  const taskLink = `${frontendUrl.replace(/\/$/, '')}/?taskId=${taskId}`;

  console.log(`🔗 Generating task link: ${taskLink}`);

  const mailOptions = {
    from: `"Hello Kitty Todo" <${process.env.EMAIL_USER}>`,
    to: emails.join(', '), // Send to all collaborators
    subject: `🎀 New Task Assignment: ${taskTitle}!`,
    html: `
      <div style="font-family: 'Nunito', sans-serif; background-color: #ffeaf3; padding: 40px; text-align: center; border-radius: 16px;">
        <h1 style="color: #ff4d85;">Hello! 🎀</h1>
        <p style="color: #594a4e; font-size: 16px;">You've been officially added to a new task on the Hello Kitty Todo App!</p>
        <div style="background-color: white; padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 77, 133, 0.15); margin: 20px 0;">
          <h2 style="color: #ff4d85; margin: 0;">${taskTitle}</h2>
        </div>
        <p style="color: #594a4e;">Log in to the application to check it out, leave comments, and track the progress!</p>
        <a href="${taskLink}" style="display: inline-block; background-color: #ff4d85; color: white; text-decoration: none; padding: 14px 28px; border-radius: 20px; font-weight: bold; margin-top: 15px; font-size: 16px;">View Task</a>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${emails.join(', ')}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email from Nodemailer:", error);
    return false;
  }
};

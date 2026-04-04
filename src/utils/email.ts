import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Google App Password, not your Gmail password
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Fitness2099" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}"
          style="display:inline-block;padding:12px 24px;background:#00ff87;color:#000;
                 border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
        <p style="color:#888;font-size:13px;">
          Or copy this link: <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
  });
};

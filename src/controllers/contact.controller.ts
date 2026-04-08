import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const submitContactMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  const user = process.env.CONTACT_GMAIL_USER || process.env.GMAIL_USER;
  const pass =
    process.env.CONTACT_GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    res.status(500).json({ message: "Unable to send message at the moment." });
    return;
  }

  const normalizedPass = pass.replace(/\s+/g, "");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: normalizedPass }
    });

    await transporter.sendMail({
      from: `"Fitness2099 Contact" <${user}>`,
      to: "connectusonfitness2099@gmail.com",
      subject: `[Fitness2099 Contact] ${subject}`,
      replyTo: email,
      text: [
        "New contact message received:",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message
      ].join("\n")
    });

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact email send failed:", error);
    res.status(500).json({ message: "Unable to send message at the moment." });
  }
};

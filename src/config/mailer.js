import nodemailer from "nodemailer";
import { config } from "./config.js";
import { loggerDev } from "./logger.js";

const trasnporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  },
});

export const enviarMail = async (to, subject, message) => {
  const options = {
    from: `Backend Juan Cruz Galceran ${config.GMAIL_USER}`,
    to,
    subject,
    html: message,
  };
  try {
    const info = await trasnporter.sendMail(options);
    loggerDev.info(`Message sent: ${info}`);
  } catch (error) {
    loggerDev.error("Error al enviar el email", error);
    throw error;
  }
};

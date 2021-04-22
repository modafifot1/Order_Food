const nodemailer = require("nodemailer");
import { envVariables } from "../configs";
const { nodemailerEmail, nodemailerPassword } = envVariables;
export const sendEmail = async (receiver, subject, content, html, next) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: nodemailerEmail,
        pass: nodemailerPassword,
      },
    });
    const message = await transporter.sendMail({
      from: nodemailerEmail,
      to: receiver,
      subject,
      text: content,
      html,
    });
    console.log("Message sent: ", message.messageId);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

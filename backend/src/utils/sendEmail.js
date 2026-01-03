const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Use your Gmail or any SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  console.log("Email sent to", to);
};

module.exports = sendEmail;
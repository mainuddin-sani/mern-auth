import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});
console.log("SMTP Transport Configured", transport);
export default transport;

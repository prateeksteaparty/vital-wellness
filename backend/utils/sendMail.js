const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    });

    console.log("✅ Email sent:", response.id);
  } catch (err) {
    console.error("❌ Resend email error:", err);
    throw err;
  }
};

module.exports = sendMail;

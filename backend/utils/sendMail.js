const sgMail = require("@sendgrid/mail");

// set API key once at startup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.FROM_EMAIL, // must be verified in SendGrid
      subject,
      html
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error(
      "❌ Email send failed:",
      err.response?.body || err.message
    );
    throw err;
  }
};

module.exports = sendMail;

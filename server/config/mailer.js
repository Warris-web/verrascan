const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendWelcomeEmail = async ({ to, name, product, email, password }) => {
  await transporter.sendMail({
    from:    `"VeraScann" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your VeraScann Brand Portal Access",
    html: `
      <div style="background:#0A0A0A;padding:40px;font-family:sans-serif;color:#fff;max-width:520px;margin:0 auto;border-radius:12px;">
        <div style="font-size:24px;font-weight:700;margin-bottom:4px;">
          Vera<span style="color:#00C9A7">Scann</span>
        </div>
        <div style="font-size:12px;color:#666;margin-bottom:28px;">AI-Powered Counterfeit Detection</div>

        <div style="font-size:16px;font-weight:600;margin-bottom:8px;">Welcome, ${name}</div>
        <div style="font-size:13px;color:#999;margin-bottom:24px;">
          Your product <strong style="color:#fff">${product}</strong> is now registered on the VeraScann network.
          Here are your portal login credentials.
        </div>

        <div style="background:#141414;border:1px solid #2A2A2A;border-radius:10px;padding:20px;margin-bottom:24px;">
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:14px;">Your Login Details</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px;">
            <span style="color:#666;">Email</span>
            <span style="color:#fff;font-family:monospace;">${email}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span style="color:#666;">Password</span>
            <span style="color:#00C9A7;font-family:monospace;font-weight:700;">${password}</span>
          </div>
        </div>

        <div style="background:#0D2E24;border:1px solid #009B82;border-radius:8px;padding:14px;margin-bottom:24px;font-size:12px;color:#666;">
          Please change your password after your first login.
        </div>

        <a href="${process.env.CLIENT_URL}/login" 
           style="display:block;background:#00C9A7;color:#000;text-decoration:none;text-align:center;padding:13px;border-radius:8px;font-weight:700;font-size:13px;margin-bottom:24px;">
          Login to Brand Portal →
        </a>

        <div style="font-size:11px;color:#444;border-top:1px solid #1A1A1A;padding-top:16px;">
          VeraScann · Squad Hackathon 3.0 · See the truth.
        </div>
      </div>
    `,
  });
};

module.exports = { sendWelcomeEmail };
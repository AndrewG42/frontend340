require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const nodemailer = require("nodemailer");

const app = express();
app.use(helmet());
app.use(express.json());

// Lock this down by IP in UFW too (next step)
app.post("/send-2fa", async (req, res) => {
  try {
    const { to, code } = req.body;
    if (!to || !code) return res.status(400).json({ error: "Missing to/code" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: "FixIT 2FA Code",
      text: `Your FixIT verification code is: ${code}\nThis code expires in 5 minutes.`,
    });

    return res.json({ status: "ok" });
  } catch (err) {
    console.error("Mailer error:", err);
    return res.status(500).json({ error: "Email failed" });
  }
});

const PORT = process.env.MAILER_PORT || 7000;
app.listen(PORT, "0.0.0.0", () => console.log(`FixIT mailer listening on ${PORT}`));

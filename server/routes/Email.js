const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post("/", async (req, res) => {
    const { to, subject, text } = req.body; 
    console.log(req.body);
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    
    if (!to ||!subject ||!text) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:");
      res.status(500).send({ error: "Failed to send email", details: error.message });
    }
  });

module.exports = router;
// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

console.log("Fixing nested git error");

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/families', require('./routes/familyRoutes'));
app.use('/api/healthpros', require('./routes/healthproRoutes'));
app.use('/api/caregivers', require('./routes/careGiverRoutes'));
app.use('/api/appointments', require('./routes/appoinmentRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));

app.post("/api/email", async (req, res) => {
    const { to, subject, text } = req.body; 
    console.log(req.body);
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
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
      res.status(500).send({ error: "Failed to send email", details: error });
    }
  });

// app.use('/api/todos', require('./routes/todoRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const nodemailer = require("nodemailer");
const session = require('express-session');
const fs = require('fs');

dotenv.config();
const app = express();

connectDB();

// Configure CORS before other middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

console.log("Fixing nested git error");


app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/families', require('./routes/familyRoutes'));
app.use('/api/healthpros', require('./routes/healthproRoutes'));
app.use('/api/caregivers', require('./routes/careGiverRoutes'));
app.use('/api/appointments', require('./routes/appoinmentRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/inventory', require('./routes/InventoryRoutes'));
app.use('/api/fitbit', require('./routes/fitbitRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/report-ai', require('./routes/reportAIRoutes'));
app.use('/api/distributions', require('./routes/distributionRoutes'));

// Make sure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post("/api/email", async (req, res) => {
  const { to, subject, text } = req.body;
  console.log(req.body);

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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const dotenv = require("dotenv");
const Groq = require('groq-sdk');
const Appointment = require('../models/AppoinmentModel');

dotenv.config();

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are an advanced medical pre-screening AI assistant. Your goal is to gather detailed information about the patient's symptoms before their appointment.

Current conversation stage: {stage}

Guidelines based on stage:
- initial_greeting: 
  Start with: "Hello {patientName}! I understand you have an appointment on {appointmentDate} at {appointmentTime}. Could you tell me what brings you in today?"

- symptoms_collection: 
  Ask focused follow-up questions based on their complaint:
  - "Where exactly is the pain/discomfort?"
  - "How long have you been experiencing this?"
  - "On a scale of 1-10, how severe is it?"
  - "Does anything make it better or worse?"
  - "How is this affecting your daily activities?"

- symptoms_confirmation:
  Summarize briefly and naturally:
  "I understand that you're experiencing [main symptom] in [location] for [duration]. You mentioned the pain level is [severity] and [any other key details]. Is this correct?"

- report_generation: 
  Say "REPORT_READY"

Important:
1. Keep questions simple and clear
2. Show empathy
3. Don't ask for information already provided
4. Focus on the main complaint
5. Keep summaries brief and natural

Previous conversation:
{conversation}`;

const sessions = {};

async function getAIResponse(prompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are Sarah, a medical assistant who helps patients schedule appointments."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        const response = chatCompletion.choices[0].message.content;
        console.log("AI Response:", response);
        return response;
    } catch (error) {
        console.error("AI API Error:", error);
        return "I apologize, but I'm having trouble processing that right now. Could you please try again?";
    }
}

const startAIConversation = async (req, res) => {
    try {
        const { sessionId, appointmentDate, appointmentTime, patientName, patientId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: "Missing sessionId" });
        }

        // Format the date for display
        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        sessions[sessionId] = {
            data: {
                patientId: patientId,
                patientName: patientName,
                symptoms: "",
                appointmentDate: formattedDate,
                appointmentTime: appointmentTime,
                stage: "initial_greeting",
            },
            conversation: []
        };

        const customizedPrompt = SYSTEM_PROMPT
            .replace(/{patientName}/g, patientName)
            .replace(/{appointmentDate}/g, formattedDate)
            .replace(/{appointmentTime}/g, appointmentTime)
            .replace("{stage}", "initial_greeting")
            .replace("{conversation}", "");

        const reply = await getAIResponse(customizedPrompt);
        sessions[sessionId].conversation.push({ role: "assistant", content: reply });

        res.json({ reply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const processAIConversation = async (req, res) => {
    try {
        const { sessionId, text, patientId } = req.body;
        console.log("Processing conversation for session:", sessionId);
        
        if (!sessions[sessionId]) {
            return res.status(400).json({ error: "Session not found" });
        }

        const session = sessions[sessionId];
        session.conversation.push({ role: "user", content: text });

        // Store conversation details
        if (session.data.stage === "initial_greeting") {
            session.data.stage = "symptoms_collection";
        } else if (session.data.stage === "symptoms_collection") {
            session.data.symptoms += text + " ";
            if (session.conversation.length >= 6) {
                session.data.stage = "symptoms_confirmation";
            }
        } else if (session.data.stage === "symptoms_confirmation") {
            if (text.toLowerCase().includes('yes')) {
                session.data.stage = "report_generation";
            } else {
                session.data.stage = "symptoms_collection";
            }
        }

        const conversationHistory = session.conversation
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n");

        const customizedPrompt = SYSTEM_PROMPT
            .replace(/{patientName}/g, session.data.patientName)
            .replace(/{appointmentDate}/g, session.data.appointmentDate)
            .replace(/{appointmentTime}/g, session.data.appointmentTime)
            .replace("{stage}", session.data.stage)
            .replace("{conversation}", conversationHistory);

        const reply = await getAIResponse(customizedPrompt);
        session.conversation.push({ role: "assistant", content: reply });

        if (reply.includes("REPORT_READY") || session.data.stage === "report_generation") {
            try {
                const reportPrompt = `Based on this conversation, create a medical report. Use ONLY information that was actually discussed:
${conversationHistory}

Format the report exactly like this:

Medical Report Summary

Patient: ${session.data.patientName}
Appointment: ${session.data.appointmentDate} at ${session.data.appointmentTime}

Patient's Description:
[Write a brief paragraph summarizing what the patient described about their symptoms, using their exact words where possible]

Key Points:
- Location: [where the pain/symptoms are]
- Duration: [how long they've had it]
- Severity: [pain level if mentioned]
- Trigger: [what caused or worsens it]
- Impact: [how it affects the patient]

Next Steps:
1. Appointment scheduled for ${session.data.appointmentDate} at ${session.data.appointmentTime}
2. Please arrive 15 minutes early
3. Bring any relevant medical records

Important: Only include information that was explicitly mentioned in the conversation. Don't add any assumptions or extra details.`;

                const reportText = await getAIResponse(reportPrompt);

                // Save the appointment with all collected information
                const newAppointment = new Appointment({
                    patientId: session.data.patientId,
                    mainSymptoms: session.data.symptoms.trim(),
                    report: reportText,
                    appointmentDate: session.data.appointmentDate,
                    appointmentTime: session.data.appointmentTime,
                    status: 'scheduled'
                });

                const savedAppointment = await newAppointment.save();

                // Clean up the session
                delete sessions[sessionId];

                return res.json({
                    reply: `Thank you for providing your symptoms. I've prepared a summary for your appointment on ${session.data.appointmentDate} at ${session.data.appointmentTime}.`,
                    report: reportText,
                    appointmentId: savedAppointment._id
                });
            } catch (error) {
                console.error("Database error:", error);
                return res.status(500).json({
                    error: "Failed to save appointment",
                    details: error.message
                });
            }
        }

        res.json({ reply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId })
            .sort({ appointmentDate: -1, appointmentTime: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ appointmentDate: -1, appointmentTime: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.params;
        
        // Format the date to match how it's stored in the database
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Get all appointments for the given date
        const appointments = await Appointment.find({
            appointmentDate: formattedDate
        });

        console.log('Date requested:', formattedDate);
        console.log('Appointments found:', appointments);

        res.json(appointments);
    } catch (error) {
        console.error('Error in getAvailableSlots:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    startAIConversation,
    processAIConversation,
    getPatientAppointments,
    getAppointments,
    getAvailableSlots
};
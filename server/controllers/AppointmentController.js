const express = require('express');
const dotenv = require("dotenv");
const Groq = require('groq-sdk');
const Appointment = require('../models/AppoinmentModel');

dotenv.config();

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are a friendly medical assistant. Have a natural conversation.

Current conversation stage: {stage}

Guidelines based on stage:
- name_collection: 
  Start warmly: "Hi! May I know your name?"

- symptoms_collection: 
  After getting name, say: "Hello [name], what health concerns bring you here today?"
  Based on their symptoms, ask relevant follow-up questions:
  * For pain-related issues:
    - "Can you point out where exactly the pain is?"
    - "Is it a constant pain or does it come and go?"
    - "On a scale of 1-10, how would you rate the pain?"
    - "Does any particular movement make it worse?"
  * For fever/cold:
    - "How long have you had the fever?"
    - "Have you measured your temperature?"
    - "Are you experiencing any other symptoms like cough or body ache?"
  * For any condition:
    - "How long have you been experiencing these symptoms?"
    - "Have you taken any medication for this?"
    - "Does it affect your daily activities?"
  
  Ask these questions one at a time and show concern.

- appointment_scheduling: 
  Say: "I understand your situation. Let's schedule an appointment with our doctor."
  Then ask: "Which date would be convenient for you? You can tell me like '23rd March' or '15th April'"
  After getting date, ask: "And what time would you prefer - morning (10 AM), afternoon (2 PM), or evening (6 PM)?"
  If date is unclear, say: "Could you please specify the date again? For example, '23rd March' or '15th April'"

- report_generation: Say "REPORT_READY"

Important:
1. Ask only ONE question at a time
2. Show empathy and understanding
3. For symptoms, ask at least 3-4 relevant follow-up questions
4. Get both date and time preference clearly
5. Keep the conversation natural and friendly

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
        const { sessionId} = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: "Missing sessionId" });
        }

        sessions[sessionId] = {
            data: {
                patientId: "",
                symptoms: "",
                appointmentDate: "",
                stage: "name_collection",
            },
            conversation: []
        };

        const reply = await getAIResponse(SYSTEM_PROMPT.replace("{stage}", "name_collection").replace("{conversation}", ""));
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

        const lastMessage = text.toLowerCase();

        switch (session.data.stage) {
            case "name_collection":
                session.data.stage = "symptoms_collection";
                break;

            case "symptoms_collection":
                session.data.symptoms += text + " ";
                if (session.conversation.length >= 6) {
                    session.data.stage = "appointment_scheduling";
                }
                break;

            case "appointment_scheduling":
                // Match dates like "23rd March" or "15th April"
                const dateMatch = lastMessage.match(/(\d{1,2})(st|nd|rd|th)?\s*(march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);

                if (dateMatch) {
                    const day = dateMatch[1].padStart(2, '0');
                    const monthInput = dateMatch[3].toLowerCase();
                    const monthMap = {
                        'jan': '01', 'january': '01', 'feb': '02', 'february': '02',
                        'mar': '03', 'march': '03', 'apr': '04', 'april': '04',
                        'may': '05', 'jun': '06', 'june': '06', 'jul': '07',
                        'july': '07', 'aug': '08', 'august': '08', 'sep': '09',
                        'september': '09', 'oct': '10', 'october': '10', 'nov': '11',
                        'november': '11', 'dec': '12', 'december': '12'
                    };
                    const month = monthMap[monthInput];

                    const timeOfDay = lastMessage.includes('morning') ? '10:00 AM' :
                        lastMessage.includes('afternoon') ? '2:00 PM' :
                            lastMessage.includes('evening') ? '6:00 PM' : '10:00 AM';

                    session.data.appointmentDate = `${day}/${month}/2025`;
                    session.data.appointmentTime = timeOfDay;
                    session.data.stage = "report_generation";
                }
                break;
        }

        const conversationHistory = session.conversation
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n");

        const prompt = SYSTEM_PROMPT
            .replace("{stage}", session.data.stage)
            .replace("{conversation}", conversationHistory);

        const reply = await getAIResponse(prompt);
        session.conversation.push({ role: "assistant", content: reply });

        // Check if the reply indicates report generation
        if (reply.includes("REPORT_READY") || session.data.stage === "report_generation") {
            try {
                console.log("Generating report...");
                const reportPrompt = `Create a medical report from this conversation:
${conversationHistory}

Format the report as follows:
Medical Report

Patient Information:
- Name: [Extract from conversation]
- Date of Consultation: ${new Date().toLocaleDateString()}

Symptoms Summary:
${session.data.symptoms}

Appointment Details:
- Date: ${session.data.appointmentDate}
- Time: ${session.data.appointmentTime}

Recommendations:
- Schedule follow-up with doctor
- Bring any relevant medical records
- Arrive 15 minutes before appointment time

Keep it professional and concise.`;

                const reportText = await getAIResponse(reportPrompt);
                console.log("Report generated:", reportText);

                // Create appointment with proper date formatting
                const [day, month, year] = session.data.appointmentDate.split('/');
                const formattedDate = `${year}-${month}-${day}`;

                const newAppointment = new Appointment({
                    patientId: patientId,
                    mainSymptoms: session.data.symptoms.trim(),
                    report: reportText,
                    appointmentDate: new Date(formattedDate)
                });

                const savedAppointment = await newAppointment.save();
                console.log("Appointment saved:", savedAppointment);

                delete sessions[sessionId];

                return res.json({
                    reply: `Thank you. I've scheduled your appointment for ${session.data.appointmentDate} at ${session.data.appointmentTime}.`,
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
            .sort({ appointmentDate: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ appointmentDate: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    startAIConversation,
    processAIConversation,
    getPatientAppointments,
    getAppointments
};
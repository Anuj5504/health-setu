const Groq = require('groq-sdk');
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

dotenv.config();

// Initialize Groq with optimized settings
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Create a more focused system prompt
const SYSTEM_PROMPT = `You are a caring doctor having a personal conversation with your patient.

Important guidelines:
- If the patient asks in Hindi/regional language, ALWAYS respond in the same language
- Keep responses personal and empathetic
- user might ask for specific language, so you should be able to respond in any language
- Explain test results in simple terms that anyone can understand
- Explain the details of report properly so that any person can understand it
- no need translation until it is asked by user
- If something needs attention:
  * First reassure the patient
  * Explain what it means for their health
  * Give clear next steps
- For normal results, explain why it's good news

Remember: You're talking to someone who might be worried about their health.

Example hinglish(hindi + english) response:
 " apke test me platelet count 541 hai, normal range 150-410 hai. ghareeb nahi hai, lekin check karna padega. 2 weeks mein doc se milenge."
 


Example Hindi response:
"आपके टेस्ट में प्लेटलेट्स की मात्रा थोड़ी ज़्यादा है (541, सामान्य सीमा 150-410 है)। घबराने की कोई बात नहीं है, लेकिन इसकी जाँच करवानी चाहिए। अगले दो हफ्ते में डॉक्टर से मिलकर इसका कारण समझें।"

Example English response:
"I see your platelet count is a bit high (541, normal range is 150-410). Don't worry - this isn't an emergency, but we should look into why this is happening. Let's schedule a check-up in the next couple of weeks to understand this better."

Report Content: {report}
Question: {question}`;

// Configure multer with error handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, Images, and Word documents are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const extractTextFromFile = async (filePath, fileType) => {
    try {
        let extractedText = "";

        if (fileType === "application/pdf") {
            console.log("Processing PDF...");
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } 
        else if (fileType.startsWith("image/")) {
            console.log("Processing Image...");
            const { data } = await tesseract.recognize(filePath, "eng");
            extractedText = data.text;
        } 
        else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            console.log("Processing Word Document...");
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        }

        return extractedText;
    } catch (error) {
        console.error("Error extracting text:", error);
        throw error;
    }
};

const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        console.log('File received:', req.file);
        const filePath = req.file.path;
        const fileType = mime.lookup(req.file.originalname) || req.file.mimetype;

        console.log('Processing file type:', fileType);
        const extractedText = await extractTextFromFile(filePath, fileType);

        if (!extractedText) {
            throw new Error('No text could be extracted from the file');
        }

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        console.log('Text extracted successfully');
        res.json({ extractedText });
    } catch (error) {
        console.error("Error processing file:", error);
        // Clean up file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            error: "Failed to process file",
            details: error.message 
        });
    }
};

const analyzeReport = async (req, res) => {
    try {
        const { reportText, question } = req.body;

        if (!reportText || !question) {
            return res.status(400).json({ 
                error: "Both report text and question are required" 
            });
        }

        // Detect if question is in Hindi/regional language
        const isHindiQuestion = /[\u0900-\u097F]/.test(question) || 
                              /kya|hai|kaise|batao|samjhao/i.test(question);

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: isHindiQuestion ? 
                        "You are a doctor speaking in Hindi/regional language. Give warm, clear explanations in Hindi." :
                        "You are a doctor having a personal conversation. Be clear and supportive."
                },
                {
                    role: "user",
                    content: SYSTEM_PROMPT
                        .replace("{report}", reportText)
                        .replace("{question}", question)
                }
            ],
            model: "mixtral-8x7b-32768",  // Mixtral handles multilingual better than llama
            temperature: 0.4,
            max_tokens: 250,  // Increased for better regional language responses
            top_p: 0.9,      // Increased for more natural language
            stream: false
        });

        let answer = completion.choices[0].message.content
            .replace(/^(Hello|Hi|Dear|Based on|According to|देखिए|सुनिए).*?,\s*/i, '')
            .replace(/(?:the|your|this|आपकी|आपके) (?:medical |मेडिकल )?(?:report|रिपोर्ट)\s*(?:shows|indicates|mentions|states|में|से|बताती है),?\s*/gi, '')
            .trim();

        // Don't trim Hindi responses too much as they need context
        if (!isHindiQuestion && answer.length > 300) {
            answer = answer.split('.')
                .slice(0, 4)
                .join('.') + '.';
        }

        res.json({
            answer,
            success: true
        });

    } catch (error) {
        console.error("Error analyzing report:", error);
        res.status(500).json({ 
            error: "Failed to analyze report",
            details: error.message 
        });
    }
};

module.exports = {
    analyzeReport,
    handleFileUpload,
    upload
};

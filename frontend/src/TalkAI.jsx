import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import Test from './components/Test';

let recognition;

const TalkAI = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [report, setReport] = useState(null);
    const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const patientId = decode.user._id;
    const [appointmentId, setAppointmentId] = useState(null);
    console.log(patientId);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';



        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            handleSendMessage(text);
        };

        startConversation();
    }, []);

    const startConversation = async () => {
        try {
            console.log("Starting conversation..."); // Debug log
            const response = await fetch("http://localhost:5000/api/appointments/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ sessionId}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response received:", data); // Debug log
            speakResponse(data.reply);
        } catch (error) {
            console.error("Error starting conversation:", error);
            // Show error to user
            alert("Failed to connect to the server. Please try again later.");
        }
    };

    const handleSendMessage = async (text) => {
        try {
            const response = await fetch("http://localhost:5000/api/appointments/talk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    sessionId,
                    text,
                    patientId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data.report) {
                console.log("Report received:", data.report);
                console.log("Appointment ID:", data.appointmentId);
                setReport(data.report);
                setAppointmentId(data.appointmentId);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                speakResponse(data.reply);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    const speakResponse = (text) => {
        if (!text) return;

        window.speechSynthesis.cancel();
        setIsSpeaking(true);

        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'en-US';
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onend = () => {
            setIsSpeaking(false);
            if (!report) {
                setTimeout(() => recognition.start(), 500);
            }
        };

        window.speechSynthesis.speak(speech);
    };

    const handleMicClick = () => {
        if (isListening || isSpeaking) {
            if (isListening) recognition.stop();
            if (isSpeaking) window.speechSynthesis.cancel();
            setIsListening(false);
            setIsSpeaking(false);
        } else {
            recognition.start();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-semibold text-gray-800">AI Medical Consultation</h1>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                {!report ? (
                    <div className="text-center space-y-8 bg-white p-12 rounded-2xl shadow-lg max-w-md w-full mx-auto flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-medium text-gray-800">
                            Voice Consultation
                        </h2>
                        
                        <div className="flex flex-col items-center justify-center flex-1 my-8">
                            <button
                                onClick={handleMicClick}
                                className={`
                                    w-40 h-40 rounded-full shadow-lg
                                    flex items-center justify-center text-5xl
                                    transition-all duration-300 transform
                                    ${isListening 
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : isSpeaking 
                                            ? 'bg-green-500 text-white animate-pulse' 
                                            : 'bg-white text-blue-500 hover:bg-blue-50 hover:scale-105'
                                    }
                                    border-4 ${isListening ? 'border-red-400' : isSpeaking ? 'border-green-400' : 'border-blue-200'}
                                `}
                            >
                                {isListening ? '⏹' : isSpeaking ? '🔊' : '🎙️'}
                            </button>
                        </div>

                        <div className="space-y-4 mt-4">
                            <p className="text-lg font-medium text-gray-700">
                                {isListening ? 'Listening to you...' :
                                 isSpeaking ? 'AI is speaking...' :
                                 'Click the microphone to start'}
                            </p>

                            <p className="text-sm text-gray-500">
                                Please speak clearly and describe your symptoms in detail
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full mx-4 transition-all duration-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                            Medical Report Summary
                        </h2>

                        <div className="prose max-w-none mb-8 text-gray-700 space-y-4">
                            {report.split('\n').map((line, index) => (
                                line.trim() ? (
                                    <p key={index} className="flex items-start space-x-2">
                                        <span className="text-blue-500">•</span>
                                        <span>{line.replace(/^[-*]/, '')}</span>
                                    </p>
                                ) : <div key={index} className="h-2" />
                            ))}
                        </div>

                        <Test reportData={report} appointmentId={appointmentId} />

                        <button
                            onClick={() => {
                                setReport(null);
                                setAppointmentId(null);
                                startConversation();
                            }}
                            className="w-full mt-6 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                     transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                            Start New Consultation
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TalkAI; 
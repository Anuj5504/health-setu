import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import Test from './components/Test';
import { useNavigate } from "react-router-dom";
import { format, parse, addMinutes } from 'date-fns';
import Header from './components/Header';
import axios from 'axios';

let recognition;

const TalkAI = () => {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [report, setReport] = useState(null);
    const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
    const [appointmentId, setAppointmentId] = useState(null);
    const [showDateTimeForm, setShowDateTimeForm] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [step, setStep] = useState('datetime'); // datetime, confirmation, consultation, report
    const [confirmationDetails, setConfirmationDetails] = useState(null);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
  
    const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found");
            navigate('/login');
        }
        const decode = jwtDecode(token);
        const patientId = decode.user._id;    
   

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
    }, []);

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const generateTimeSlots = async () => {
        try {
            // Format the date to match what the server expects
            const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Get all appointments for the selected date
            const response = await axios.get(`http://localhost:5000/api/appointments/check-slots/${formattedDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const bookedSlots = response.data.map(apt => apt.appointmentTime);
            console.log('Booked slots:', bookedSlots);
            
            const slots = [];
            let startTime = parse('09:00', 'HH:mm', new Date());
            const endTime = parse('17:00', 'HH:mm', new Date());

            while (startTime <= endTime) {
                const timeSlot = format(startTime, 'HH:mm');
                // Only add time slot if it's not booked
                if (!bookedSlots.includes(timeSlot)) {
                    slots.push(timeSlot);
                }
                startTime = addMinutes(startTime, 30);
            }
            console.log('Available slots:', slots);
            return slots;
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            return [];
        }
    };

    useEffect(() => {
        if (selectedDate) {
            generateTimeSlots().then(slots => {
                setTimeSlots(slots);
                setSelectedTimeSlot(''); // Reset selected time when date changes
            });
        }
    }, [selectedDate]);

    const handleDateTimeSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTimeSlot) {
            alert('Please select both date and time');
            return;
        }

        // Create confirmation details
        const details = {
            date: format(new Date(selectedDate), 'MMMM do, yyyy'),
            time: format(parse(selectedTimeSlot, 'HH:mm', new Date()), 'h:mm a'),
            patientName: jwtDecode(token).user.name,
        };
        setConfirmationDetails(details);
        setStep('confirmation');
    };

    const handleConfirmAppointment = () => {
        setStep('consultation');
        startConversation();
    };

    const startConversation = async () => {
        try {
            console.log("Starting conversation...");
            const userDetails = jwtDecode(token).user;
            const response = await fetch("http://localhost:5000/api/appointments/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    sessionId,
                    appointmentDate: selectedDate,
                    appointmentTime: selectedTimeSlot,
                    patientName: userDetails.name,
                    patientId: userDetails._id
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response received:", data); // Debug log
            speakResponse(data.reply);
        } catch (error) {
            console.error("Error starting conversation:", error);
            alert("Failed to connect to the server. Please try again later.");
        }
    };

    const handleSendMessage = async (text) => {
        try {
            setConversationHistory(prev => [...prev, { type: 'user', text }]);
            
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
                    appointmentDetails: confirmationDetails
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.isConfirming) {
                setIsConfirming(true);
                setConversationHistory(prev => [...prev, { 
                    type: 'ai', 
                    text: data.reply,
                    confirmationData: data.confirmationData 
                }]);
            } else if (data.report) {
                setReport(data.report);
                setAppointmentId(data.appointmentId);
                setStep('report');
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                setConversationHistory(prev => [...prev, { type: 'ai', text: data.reply }]);
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
        // <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        //     <Header />
            
            <main className="flex-1 container mx-auto px-4 mt-20">
                <div className="flex items-center justify-center">
                    {step === 'datetime' && (
                        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Schedule Your Consultation
                                </h2>
                                <p className="text-gray-600">
                                    Choose a convenient date and time for your appointment
                                </p>
                            </div>

                            <form onSubmit={handleDateTimeSubmit} className="space-y-8">
                                {/* Date Selection */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Available Time Slots
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                        {timeSlots.map((time) => (
                                            <button
                                                type="button"
                                                key={time}
                                                onClick={() => setSelectedTimeSlot(time)}
                                                className={`p-2 text-sm rounded-lg transition-all duration-200
                                                    ${selectedTimeSlot === time 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                             transition-all duration-200 font-semibold"
                                >
                                    Continue
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'confirmation' && confirmationDetails && (
                        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Confirm Your Appointment
                                </h2>
                                <div className="space-y-4 text-left">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="font-medium text-gray-700">Patient: {confirmationDetails.patientName}</p>
                                        <p className="text-gray-600">Date: {confirmationDetails.date}</p>
                                        <p className="text-gray-600">Time: {confirmationDetails.time}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <h3 className="font-semibold mb-2">Important Notes:</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Please arrive 15 minutes before your appointment</li>
                                            <li>Bring any relevant medical records</li>
                                            <li>You can discuss your symptoms with our AI assistant</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleConfirmAppointment}
                                    className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                             transition-all duration-200 font-semibold"
                                >
                                    Confirm & Continue to Consultation
                                </button>
                                <button
                                    onClick={() => setStep('datetime')}
                                    className="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                             transition-all duration-200 font-semibold"
                                >
                                    Change Date/Time
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'consultation' && (
                        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 md:p-6 rounded-2xl shadow-xl w-full max-w-7xl mx-auto min-h-[calc(100vh-12rem)]">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
                                {/* Left Panel - AI Assistant */}
                                <div className="lg:col-span-4 lg:max-h-[85vh] lg:sticky lg:top-24">
                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 md:p-6 border border-blue-100">
                                        {/* AI Status and Info */}
                                        <div className="text-center mb-6">
                                            {/* Voice Status Indicator */}
                                            <div className="w-28 h-28 mx-auto relative mb-6">
                                                {/* Main Circle with Fill */}
                                                <div className={`
                                                    absolute inset-0 rounded-full shadow-lg flex items-center justify-center
                                                    ${isListening 
                                                        ? 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse' 
                                                        : isSpeaking 
                                                            ? 'bg-gradient-to-br from-green-400 to-green-600 animate-pulse' 
                                                            : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                                                    }
                                                `}>
                                                    {/* Icon and Status */}
                                                    <div className="text-4xl">
                                                        {isListening ? '🎤' : isSpeaking ? '🔊' : '🤖'}
                                                    </div>
                                                </div>

                                                {/* Animated Rings for Active States */}
                                                {(isListening || isSpeaking) && (
                                                    <>
                                                        <div className="absolute inset-[-8px] rounded-full border-4 border-current opacity-20 animate-ping"></div>
                                                        <div className="absolute inset-[-4px] rounded-full border-2 border-current opacity-30 animate-pulse"></div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Status Text */}
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                AI Health Assistant
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {isListening ? 'Listening to you...' : 
                                                 isSpeaking ? 'Speaking...' : 
                                                 'Ready to help'}
                                            </p>
                                        </div>

                                        {/* Appointment Info */}
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white mb-4">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className="text-lg">📅</span>
                                                <h4 className="font-medium">Your Appointment</h4>
                                            </div>
                                            <div className="space-y-2 ml-2">
                                                <p className="flex items-center space-x-2 text-sm">
                                                    <span>📆</span>
                                                    <span className="opacity-90">{confirmationDetails.date}</span>
                                                </p>
                                                <p className="flex items-center space-x-2 text-sm">
                                                    <span>⏰</span>
                                                    <span className="opacity-90">{confirmationDetails.time}</span>
                                                </p>
                                                <p className="flex items-center space-x-2 text-sm">
                                                    <span>👤</span>
                                                    <span className="opacity-90">{confirmationDetails.patientName}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Voice Control Button */}
                                        <button
                                            onClick={handleMicClick}
                                            className={`
                                                w-full py-4 px-6 rounded-xl
                                                flex items-center justify-center space-x-3
                                                transition-all duration-300
                                                ${isListening 
                                                    ? 'bg-red-500 animate-pulse' 
                                                    : isSpeaking 
                                                        ? 'bg-green-500 animate-pulse' 
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                                                }
                                                text-white shadow-lg
                                            `}
                                        >
                                            <span className="text-sm font-medium">
                                                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Click to Speak'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Panel - Chat Interface */}
                                <div className="lg:col-span-8 flex flex-col">
                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-100 flex flex-col h-[calc(85vh-2rem)]">
                                        {/* Chat Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                                            {conversationHistory.map((msg, index) => (
                                                <div key={index} 
                                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}
                                                >
                                                    {msg.type !== 'user' && (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                                                        msg.type === 'user' 
                                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none' 
                                                            : 'bg-white text-gray-800 rounded-bl-none'
                                                    }`}>
                                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                                    </div>
                                                    {msg.type === 'user' && (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white">
                                                            👤
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Chat Status */}
                                        <div className="p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    isListening ? 'bg-red-500 animate-pulse' :
                                                    isSpeaking ? 'bg-green-500 animate-pulse' :
                                                    'bg-blue-500'
                                                }`}></div>
                                                <p className="text-sm text-gray-600">
                                                    {isListening ? '🎤 Listening to you...' : 
                                                     isSpeaking ? '🔊 AI is speaking...' : 
                                                     '💭 Ready to chat'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'report' && (
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full mx-4">
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Appointment Confirmed</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <p><span className="font-medium">Date:</span> {confirmationDetails.date}</p>
                                    <p><span className="font-medium">Time:</span> {confirmationDetails.time}</p>
                                    <p><span className="font-medium">Patient:</span> {confirmationDetails.patientName}</p>
                                    <p><span className="font-medium">Appointment ID:</span> {appointmentId}</p>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
                                    Medical Consultation Summary
                                </h2>

                                {report.split('\n').map((line, index) => {
                                    if (!line.trim()) return null;
                                    
                                    // Check if line is a section header
                                    if (line.match(/^[1-4]\. [A-Za-z ]+:/)) {
                                        return (
                                            <h3 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                                                {line}
                                            </h3>
                                        );
                                    }
                                    
                                    return (
                                        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                                            {line.replace(/^[-•*]\s*/, '')} {/* Remove any bullet points */}
                                        </p>
                                    );
                                })}
                            </div>

                            <div className="space-y-4">
                                {/* Email Button */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                                    <Test 
                                        reportData={report} 
                                        appointmentId={appointmentId} 
                                    />
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => {
                                            setReport(null);
                                            setAppointmentId(null);
                                            setStep('datetime');
                                        }}
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg 
                                                 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium 
                                                 shadow-md hover:shadow-xl"
                                    >
                                        Schedule Another Consultation
                                    </button>
                                    <button
                                        onClick={() => navigate('/medicine')}
                                        className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                                 transition-colors duration-200 font-medium"
                                    >
                                        View All Appointments
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        // </div>
    );
};

export default TalkAI; 
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

function ReportAI() {
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [extractedText, setExtractedText] = useState('');
    const [showExtractedText, setShowExtractedText] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const baseURL = 'http://localhost:5000';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            handleUpload(droppedFile);
        }
    };

    const handleUpload = async (selectedFile) => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        setUploadProgress(0);

        try {
            const response = await axios.post(`${baseURL}/api/report-ai/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });
            
            if (response.data.extractedText) {
                setExtractedText(response.data.extractedText);
                setMessages(prev => [...prev, 
                    { 
                        type: 'file', 
                        content: selectedFile.name,
                        extractedText: response.data.extractedText 
                    }
                ]);
                setFile(null);
                toast.success('Report processed successfully!');
                startInitialConversation(response.data.extractedText);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Failed to upload report');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion('');
        setMessages(prev => [...prev, { type: 'user', content: userQuestion }]);
        setAnalyzing(true);

        try {
            // Get the most recent file message that contains extractedText
            const fileMessage = messages.find(m => m.type === 'file' && m.extractedText);
            
            if (!fileMessage?.extractedText) {
                throw new Error('Please upload a report first');
            }

            console.log('Sending analysis request with:', {
                reportText: fileMessage.extractedText,
                question: userQuestion
            });

            const response = await axios.post(`${baseURL}/api/report-ai/analyze`, {
                reportText: fileMessage.extractedText,  // Send the actual extracted text
                question: userQuestion
            });
            
            if (response.data.answer) {
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    content: response.data.answer 
                }]);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(error.message || 'Failed to analyze report');
            setMessages(prev => [...prev, { 
                type: 'error', 
                content: error.message || 'Sorry, I had trouble processing that question. Please try again.' 
            }]);
        } finally {
            setAnalyzing(false);
        }
    };

    const FileMessage = ({ fileName, extractedText }) => {
        const [showContent, setShowContent] = useState(false);
        
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{fileName}</span>
                    </div>
                    <button
                        onClick={() => setShowContent(!showContent)}
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                        {showContent ? 'Hide Content' : 'Show Content'}
                        <svg className={`w-4 h-4 transform transition-transform ${showContent ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 overflow-hidden"
                        >
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-60 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans">{extractedText}</pre>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const LoadingAnimation = () => (
        <div className="flex justify-center items-center p-8">
            <div className="relative w-64 h-32 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Progress bar */}
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                />
                
                {/* Loading animation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative">
                        <svg className="w-16 h-16" viewBox="0 0 24 24">
                            <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                fill="none" 
                            />
                            <path 
                                className="opacity-75 text-blue-500" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 12 12"
                                    to="360 12 12"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-500">{uploadProgress}%</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 font-medium">Processing your report</p>
                        <p className="text-sm text-gray-500">This may take a moment...</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            {/* Main container with fixed height */}
            <div className="h-screen pt-16 pb-4 px-4"> 
                <div className="bg-white rounded-2xl shadow-lg h-full max-w-4xl mx-auto flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Doctor AI Report Expert
                        </h2>
                    </div>

                    {/* Chat Messages Area - with fixed height */}
                    <div 
                        className="flex-1 overflow-y-auto bg-gray-50 p-4"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-4">
                            {/* Welcome Message */}
                            {messages.length === 0 && !loading && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Welcome! I'm here to help you understand your medical reports.
                                        </h3>
                                        <p className="text-gray-600">
                                            Start by uploading your medical report below.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Loading Animation */}
                            {loading && <LoadingAnimation />}

                            {/* Chat Messages */}
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${
                                        message.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-[80%] rounded-lg p-4 ${
                                        message.type === 'user' 
                                            ? 'bg-blue-500 text-white' 
                                            : message.type === 'ai'
                                                ? 'bg-white shadow-md'
                                                : message.type === 'system'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-gray-50'
                                    }`}>
                                        {message.type === 'file' ? (
                                            <FileMessage 
                                                fileName={message.content}
                                                extractedText={message.extractedText}
                                            />
                                        ) : (
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Drag & Drop Overlay */}
                        {isDragging && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
                                <div className="text-blue-500 text-lg font-medium">
                                    Drop your report here
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area - fixed at bottom */}
                    <div className="p-4 border-t bg-white">
                        <form onSubmit={handleQuestionSubmit} className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                className="hidden"
                            />
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask a question about your report..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={analyzing || loading}
                            />
                            <button
                                type="submit"
                                disabled={analyzing || loading || !question.trim()}
                                className={`p-2 rounded-lg text-white ${
                                    analyzing || loading || !question.trim()
                                        ? 'bg-gray-400'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ReportAI;

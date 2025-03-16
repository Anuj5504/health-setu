import React, { useState } from 'react';

function Test({ reportData, appointmentId }) {
    const [loading, setLoading] = useState(false);

    const sendEmail = async () => {
        if (!reportData) {
            alert("No report data available to send");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: "kunalbodke25@gmail.com",
                    subject: "Medical Consultation Report",
                    text: `Medical Report\nAppointment ID: ${appointmentId}\n\n${reportData}`,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                throw new Error(data.error || "Failed to send email");
            }
        } catch (error) {
            alert(error.message);
            console.error('Error details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={sendEmail}
            disabled={loading || !reportData}
            className={`
                w-full py-4 px-6 
                flex items-center justify-center space-x-3
                bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white rounded-lg 
                transition-all duration-300
                ${loading 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                }
            `}
        >
            <span className="text-xl">📧</span>
            <span className="font-medium">
                {loading ? 'Sending Report...' : 'Send Report via Email'}
            </span>
            {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            )}
        </button>
    );
}

export default Test;

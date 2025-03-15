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
                    to: "darshangodase10@gmail.com",
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
        <div>
            <button 
                className={`bg-slate-300 m-10 p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={sendEmail}
                disabled={loading || !reportData}
            >
                {loading ? 'Sending...' : 'Send Report via Email'}
            </button>
        </div>
    );
}

export default Test;

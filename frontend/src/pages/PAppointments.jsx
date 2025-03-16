import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState(null);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const patientId = decodedToken.user._id;

      const response = await axios.get(`${baseURL}/api/appointments/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Sort appointments by date
      const sortedAppointments = response.data.sort((a, b) => 
        new Date(b.appointmentDate) - new Date(a.appointmentDate)
      );

      setAppointments(sortedAppointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (dateString === 'Invalid Date') return 'Date not set';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Invalid Date';
  };

  const toggleReport = (appointmentId) => {
    setExpandedReport(expandedReport === appointmentId ? null : appointmentId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>

        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Appointment Date: {formatDate(appointment.appointmentDate)}
                    </h3>
                    <div className="text-gray-600">
                      <p className="font-medium">Main Symptoms:</p>
                      <p className="mt-1">{appointment.mainSymptoms}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appointment.report && (
                      <button
                        onClick={() => toggleReport(appointment._id)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {expandedReport === appointment._id ? 'Hide Report' : 'View Report'}
                      </button>
                    )}
                    {appointment.status === 'scheduled' && (
                      <button
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>

                {expandedReport === appointment._id && appointment.report && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                    <p className="font-medium text-gray-700">Medical Report:</p>
                    <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                      {appointment.report}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No appointments found
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PAppointments; 
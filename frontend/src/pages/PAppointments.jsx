import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { format } from 'date-fns';

const PAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState(null);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);

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

  const formatAppointmentDateTime = (date, time) => {
    if (!date) return '';
    
    let formattedTime = time || 'Time not set';
    if (time) {
      // Convert 24-hour format to 12-hour format if needed
      try {
        const [hours, minutes] = time.split(':');
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes));
        formattedTime = timeDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting time:', error);
      }
    }

    return `${date} at ${formattedTime}`;
  };

  const toggleReport = (appointmentId) => {
    setExpandedReport(expandedReport === appointmentId ? null : appointmentId);
  };

  const handleBookAppointment = () => {
    navigate('/talk');
  };

  const handleDateSelect = (date, appointments) => {
    setSelectedDate(date);
    setFilteredAppointments(appointments);
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
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h2>
          <button
            onClick={handleBookAppointment}
            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition-colors flex items-center justify-center gap-2"
          >
            <span>📅</span> Book Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <AppointmentCalendar 
              appointments={appointments}
              onDateSelect={handleDateSelect}
            />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {filteredAppointments.length > 0 
                  ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}` 
                  : 'No appointments for this date'}
              </h3>
              
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 w-full sm:w-auto">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Appointment: {formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                        </h3>
                        <div className="text-gray-600">
                          <p className="font-medium">Main Symptoms:</p>
                          <p className="mt-1 text-sm sm:text-base">{appointment.mainSymptoms}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {appointment.report && (
                          <button
                            onClick={() => toggleReport(appointment._id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 text-gray-600 rounded-lg 
                                     hover:bg-gray-100 transition-colors text-sm sm:text-base"
                          >
                            {expandedReport === appointment._id ? 'Hide Report' : 'View Report'}
                          </button>
                        )}
                        {appointment.status === 'scheduled' && (
                          <button
                            className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
                                     hover:bg-blue-100 transition-colors text-sm sm:text-base"
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </div>

                    {expandedReport === appointment._id && appointment.report && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                        <p className="font-medium text-gray-700 text-sm sm:text-base">Medical Report:</p>
                        <div className="mt-2 text-gray-600 whitespace-pre-wrap text-sm sm:text-base">
                          {appointment.report}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PAppointments; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import DashboardLayout from './DashboardLayout';
import AppointmentCalendar from '../components/AppointmentCalendar';

const API_URL = import.meta.env.VITE_API_URL;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState(null); // Track which report is expanded
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get doctor's ID from token
        const decodedToken = jwtDecode(token);
        const doctorId = decodedToken.user._id;

        // First get doctor's patients
        const patientsResponse = await axios.get(`${API_URL}/api/patients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Get all appointments
        const appointmentsResponse = await axios.get(`${API_URL}/api/appointments/patient`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Filter appointments for doctor's patients
        const doctorPatients = patientsResponse.data.filter(
          patient => patient.caregiver && patient.caregiver._id === doctorId
        );
        const patientIds = doctorPatients.map(patient => patient._id);

        const filteredAppointments = appointmentsResponse.data.filter(
          appointment => patientIds.includes(appointment.patientId)
        );

        // Sort appointments by date
        const sortedAppointments = filteredAppointments.sort((a, b) => 
          new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

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
    if (expandedReport === appointmentId) {
      setExpandedReport(null); // collapse if already expanded
    } else {
      setExpandedReport(appointmentId); // expand the clicked one
    }
  };

  const handleDateSelect = (date, appointments) => {
    setSelectedDate(date);
    setFilteredAppointments(appointments);
  };

  const formatAppointmentDateTime = (date, time) => {
    if (!date) return '';
    
    let formattedTime = time || 'Time not set';
    if (time) {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-5">
            <AppointmentCalendar 
              appointments={appointments}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Appointments List Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {filteredAppointments.length > 0 
                  ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}` 
                  : 'No appointments for this date'}
              </h3>
              
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Appointment: {formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                        </h3>
                        <div className="text-gray-600">
                          <p className="font-medium">Main Symptoms:</p>
                          <p className="mt-1">{appointment.mainSymptoms}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleReport(appointment._id)}
                          className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {expandedReport === appointment._id ? 'Hide Report' : 'View Report'}
                        </button>
                        <button
                          onClick={() => navigate(`/doc-patients-health/${appointment.patientId}`)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View Patient
                        </button>
                      </div>
                    </div>

                    {expandedReport === appointment._id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                        <p className="font-medium text-gray-700">Medical Report:</p>
                        <div className="mt-2 text-gray-600 whitespace-pre-wrap">
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

export default Appointments; 
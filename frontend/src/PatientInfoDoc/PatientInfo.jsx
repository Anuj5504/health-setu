import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const PatientInfo = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('Fetching patient with ID:', patientId); // Debug log

        const patientResponse = await axios.get(`${API_URL}/api/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Patient data received:', patientResponse.data); // Debug log
        setPatient(patientResponse.data);

        // Fetch patient's medicine reminders
        const remindersResponse = await axios.get(`${API_URL}/api/goals/patient/${patientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setReminders(remindersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load information');
        toast.error('Error loading information');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    } else {
      setLoading(false);
      setError('No patient ID provided');
    }
  }, [patientId]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center text-gray-500">
        No patient information found
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Patient Information Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{patient.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{patient.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1 text-lg text-gray-900">{patient.mobileno || 'Not provided'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-lg text-gray-900">{patient.address || 'Not provided'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">City</h3>
                  <p className="mt-1 text-lg text-gray-900">{patient.city || 'Not provided'}</p>
                </div>

                {patient.caregiver && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Doctor Assigned</h3>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-900">{patient.caregiver.name}</p>
                      <p className="text-sm text-gray-600">{patient.caregiver.email}</p>
                      {patient.caregiver.mobileno && (
                        <p className="text-sm text-gray-600">📞 {patient.caregiver.mobileno}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Medicine Reminders Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medicine Reminders</h2>
            
            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder._id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {reminder.todos[0]?.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {reminder.todos[0]?.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500">
                          Due: {formatDate(reminder.date)}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No medicine reminders found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;

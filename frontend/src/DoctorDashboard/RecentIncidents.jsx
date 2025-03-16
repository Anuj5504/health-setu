import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const RecentIncidents = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Decode token to get doctor's ID
      const decodedToken = jwtDecode(token);
      const doctorId = decodedToken.user._id;

      const response = await axios.get(`${API_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        
        // Filter patients where caregiver matches doctor's ID
        const doctorPatients = response.data.filter(patient => {

          
          return patient.caregiver && patient.caregiver._id === doctorId;
        });

        setPatients(doctorPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [navigate]);

  const handleViewDetails = (patientId) => {
    navigate(`/doc-patients-health/${patientId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Patients</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Patients</h2>
        <span className="text-sm text-gray-500">
          Total: {patients.length} patients
        </span>
      </div>
      
      <div className="flex flex-col space-y-4">
        {patients && patients.map((patient) => (
          <div 
            key={patient._id} 
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={() => handleViewDetails(patient._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {patient.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  <span className="text-sm">{patient.address || patient.city || 'No location'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span className="text-sm">{patient.email}</span>
                </div>
                {patient.mobileno && (
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span className="text-sm">{patient.mobileno}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No patients assigned to you yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentIncidents;
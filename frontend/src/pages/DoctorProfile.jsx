import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    address: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const patientId = decodedToken.user._id;
  console.log(patientId);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      if (response.data && response.data.caregiver) {
        const doctorData = response.data.caregiver;
        const profileData = {
          name: doctorData.name || '',
          email: doctorData.email || '',
          phone: doctorData.contact || '',
          specialization: doctorData.specialization || 'General Medicine',
          experience: doctorData.experience || '0',
          address: doctorData.city || '',
          bio: doctorData.bio || 'No bio available'
        };
        
        setProfile(profileData);
      } else {
        throw new Error('No doctor assigned');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      const defaultData = {
        name: 'Not Assigned',
        email: 'N/A',
        phone: 'N/A',
        specialization: 'N/A',
        experience: '0',
        address: 'N/A',
        bio: 'No doctor has been assigned yet.'
      };
      setProfile(defaultData);
      setError('No doctor has been assigned to you yet');
      toast.error('Failed to load doctor profile');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
              <p className="text-sm">
                {error}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Doctor</h1>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-blue-600">{profile.specialization}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{profile.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{profile.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="text-sm text-gray-900">{profile.address}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                      <dd className="text-sm text-gray-900">{profile.specialization}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Experience</dt>
                      <dd className="text-sm text-gray-900">{profile.experience} years</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile; 
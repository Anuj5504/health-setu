import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';

function ConnectCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      handleCallback(code, state);
    } else {
      toast.error('Missing required parameters');
      navigate('/fitbit-data');
    }
  }, [location, navigate]);

  const handleCallback = async (code, state) => {
    try {
      // Exchange code for token
      const response = await axios.post('http://localhost:5000/api/fitbit/token', {
        code,
        state
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('fitbit_token', JSON.stringify(response.data.tokens));
        toast.success('Successfully connected to Fitbit!');
        navigate('/fitbit-data');
      } else {
        throw new Error(response.data.error || 'Failed to connect');
      }
    } catch (error) {
      console.error('Error in callback:', error);
      toast.error(error.response?.data?.error || 'Failed to connect to Fitbit');
      navigate('/fitbit-data');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connecting to Fitbit</h2>
            <p className="text-gray-600">Please wait while we complete the connection process...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ConnectCallback; 
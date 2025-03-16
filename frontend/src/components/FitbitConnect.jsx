import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FitbitConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const response = await axios.get('https://hm-0023-mle.vercel.app/api/fitbit/auth', {
        withCredentials: true
      });
      
      if (response.data && response.data.authUrl) {
        // Store the current URL to return to after connection
        localStorage.setItem('fitbit_return_url', window.location.pathname);
        // Redirect to Fitbit authorization
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('Invalid authorization URL');
      }
    } catch (error) {
      console.error('Error connecting to Fitbit:', error);
      toast.error('Failed to connect to Fitbit. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Connect Fitbit</h2>
        <p className="text-gray-600 mt-2">Track your health metrics with Fitbit integration</p>
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isConnecting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors duration-200`}
      >
        {isConnecting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Connecting...
          </div>
        ) : (
          'Connect with Fitbit'
        )}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p>You'll have access to:</p>
        <ul className="mt-2 space-y-1">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Activity and steps
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Heart rate data
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Sleep patterns
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FitbitConnect; 
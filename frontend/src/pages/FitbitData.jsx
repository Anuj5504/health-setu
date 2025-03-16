import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import { toast } from 'react-hot-toast';
import FitbitConnect from '../components/FitbitConnect';

const FitbitData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [fitbitData, setFitbitData] = useState({
    profile: null,
    dailyActivity: null,
    error: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFitbitConnection();
  }, []);

  const checkFitbitConnection = async () => {
    const fitbitToken = localStorage.getItem('fitbit_token');
    if (fitbitToken) {
      setIsConnected(true);
      fetchFitbitData();
    } else {
      setLoading(false);
    }
  };

  const fetchFitbitData = async () => {
    const token = localStorage.getItem('fitbit_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken.accessToken;

      // Fetch user profile
      const profileResponse = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch daily activity
      const todayDate = new Date().toISOString().split('T')[0];  
         console.log(todayDate); // Example output: "2025-03-01"
      const activityResponse = await fetch(
        `https://api.fitbit.com/1/user/-/activities/date/${todayDate}.json`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!profileResponse.ok || !activityResponse.ok) {
        throw new Error('Failed to fetch Fitbit data');
      }

      const profileData = await profileResponse.json();
      const activityData = await activityResponse.json();

      setFitbitData({
        profile: profileData.user,
        dailyActivity: activityData,
        error: null
      });
    } catch (error) {
      console.error('Error fetching Fitbit data:', error);
      toast.error('Failed to fetch Fitbit data');
      if (error.message.includes('401')) {
        localStorage.removeItem('fitbit_token');
        setIsConnected(false);
      }
      setFitbitData(prev => ({ ...prev, error: error.message }));
    } finally {
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

  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Connect Your Fitbit Account</h1>
          <FitbitConnect />
        </div>
      </DashboardLayout>
    );
  }

  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Fitbit Health Data</h1>
          <button
            onClick={() => {
              localStorage.removeItem('fitbit_token');
              setIsConnected(false);
              setFitbitData({ profile: null, dailyActivity: null, error: null });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Disconnect Fitbit
          </button>
        </div>

        {fitbitData.error && (
          <div className="text-red-500 text-center mb-4">{fitbitData.error}</div>
        )}

        {/* Profile Header */}
        {fitbitData.profile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              {fitbitData.profile.avatar150 && (
                <img
                  src={fitbitData.profile.avatar150}
                  alt="User Avatar"
                  className="rounded-full w-20 h-20"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{fitbitData.profile.fullName}</h2>
                <p className="text-gray-500">{fitbitData.profile.displayName}</p>
                <p className="text-sm text-gray-600">Member Since: {fitbitData.profile.memberSince}</p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Summary Cards */}
        {fitbitData.dailyActivity && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Steps Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Daily Steps</p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {fitbitData.dailyActivity.summary.steps}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${calculateProgress(fitbitData.dailyActivity.summary.steps, fitbitData.dailyActivity.goals.steps)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: {fitbitData.dailyActivity.goals.steps} steps
              </p>
            </div>

            {/* Calories Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Calories Burned</p>
                  <h3 className="text-2xl font-bold text-orange-600">
                    {fitbitData.dailyActivity.summary.caloriesOut}
                  </h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${calculateProgress(fitbitData.dailyActivity.summary.caloriesOut, fitbitData.dailyActivity.goals.caloriesOut)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: {fitbitData.dailyActivity.goals.caloriesOut} cal
              </p>
            </div>

            {/* Distance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <h3 className="text-2xl font-bold text-purple-600">
                    {fitbitData.dailyActivity.summary.distances?.find(d => d.activity === "total")?.distance || "N/A"} km
                  </h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${calculateProgress(fitbitData.dailyActivity.summary.distances?.find(d => d.activity === "total")?.distance || 0, fitbitData.dailyActivity.goals.distance)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: {fitbitData.dailyActivity.goals.distance} km
              </p>
            </div>

            {/* Floors Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Floors</p>
                  <h3 className="text-2xl font-bold text-indigo-600">
                    {fitbitData.dailyActivity.summary.floors}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${calculateProgress(fitbitData.dailyActivity.summary.floors, fitbitData.dailyActivity.goals.floors)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: {fitbitData.dailyActivity.goals.floors} floors
              </p>
            </div>
          </div>
        )}

        {/* Activity Details */}
        {fitbitData.dailyActivity && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Very Active Minutes</p>
                <p className="font-medium">{fitbitData.dailyActivity.summary.veryActiveMinutes} min</p>
              </div>
              <div>
                <p className="text-gray-600">Fairly Active Minutes</p>
                <p className="font-medium">{fitbitData.dailyActivity.summary.fairlyActiveMinutes} min</p>
              </div>
              <div>
                <p className="text-gray-600">Lightly Active Minutes</p>
                <p className="font-medium">{fitbitData.dailyActivity.summary.lightlyActiveMinutes} min</p>
              </div>
              <div>
                <p className="text-gray-600">Sedentary Minutes</p>
                <p className="font-medium">{fitbitData.dailyActivity.summary.sedentaryMinutes} min</p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {fitbitData.profile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{fitbitData.profile.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-medium">{fitbitData.profile.gender}</p>
              </div>
              <div>
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-medium">{fitbitData.profile.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-600">Height</p>
                <p className="font-medium">{fitbitData.profile.height} cm</p>
              </div>
              <div>
                <p className="text-gray-600">Weight</p>
                <p className="font-medium">{fitbitData.profile.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-600">Time Zone</p>
                <p className="font-medium">{fitbitData.profile.timezone}</p>
              </div>
            </div>
          </div>
        )}

        {!fitbitData.profile && !fitbitData.dailyActivity && !fitbitData.error && (
          <div className="text-center text-gray-600">
            <p>No health data available. Please make sure your Fitbit device is synced.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FitbitData; 
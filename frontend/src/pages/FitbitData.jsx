import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FitbitData = () => {
  const [healthData, setHealthData] = useState({
    heartRate: [],
    steps: [],
    sleep: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fitbit-data');
      setHealthData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load health data');
      setLoading(false);
    }
  };

  const renderMetricCard = (title, value, icon, color) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg')} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Fitbit Health Data</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderMetricCard(
                'Heart Rate',
                '72 bpm',
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>,
                'text-red-500'
              )}
              
              {renderMetricCard(
                'Steps Today',
                '8,439',
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>,
                'text-blue-500'
              )}
              
              {renderMetricCard(
                'Sleep Hours',
                '7.5 hrs',
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>,
                'text-purple-500'
              )}
              
              {renderMetricCard(
                'Calories Burned',
                '1,842',
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>,
                'text-orange-500'
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity Timeline</h2>
              <div className="space-y-4">
                {[
                  { time: '07:30 AM', activity: 'Morning Walk', duration: '30 mins', steps: 3200 },
                  { time: '10:15 AM', activity: 'Yoga Session', duration: '45 mins', calories: 150 },
                  { time: '02:30 PM', activity: 'Afternoon Stroll', duration: '15 mins', steps: 1500 },
                  { time: '05:45 PM', activity: 'Evening Exercise', duration: '40 mins', calories: 280 }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 text-sm text-gray-500">{item.time}</div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{item.activity}</p>
                      <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                      {item.steps && <p className="text-sm text-gray-500">Steps: {item.steps}</p>}
                      {item.calories && <p className="text-sm text-gray-500">Calories: {item.calories}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FitbitData; 
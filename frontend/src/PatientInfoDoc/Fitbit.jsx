import React from 'react';

const Fitbit = () => {
  const healthData = {
    heartRate: {
      current: 75,
      average: 72,
      max: 120,
      min: 60
    },
    steps: {
      today: 8432,
      goal: 10000,
      weekly: 52450
    },
    sleep: {
      lastNight: 7.5,
      quality: "Good",
      average: 7.2
    },
    activity: {
      active: 320,
      sedentary: 540,
      calories: 2150
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Heart Rate</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-500">{healthData.heartRate.current} BPM</p>
            <div className="text-sm text-gray-600">
              <p>Average: {healthData.heartRate.average} BPM</p>
              <p>Range: {healthData.heartRate.min}-{healthData.heartRate.max} BPM</p>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Steps</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-500">{healthData.steps.today}</p>
            <div className="text-sm text-gray-600">
              <p>Goal: {healthData.steps.goal}</p>
              <p>Weekly: {healthData.steps.weekly}</p>
            </div>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sleep</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-purple-500">{healthData.sleep.lastNight}hrs</p>
            <div className="text-sm text-gray-600">
              <p>Quality: {healthData.sleep.quality}</p>
              <p>Average: {healthData.sleep.average}hrs</p>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-orange-500">{healthData.activity.calories} cal</p>
            <div className="text-sm text-gray-600">
              <p>Active: {healthData.activity.active} min</p>
              <p>Sedentary: {healthData.activity.sedentary} min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitbit;

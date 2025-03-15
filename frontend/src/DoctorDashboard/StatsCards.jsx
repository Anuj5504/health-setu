import React from 'react';

const StatsCards = () => {
  const stats = {
    total: 125,
    critical: 15,
    pending: 45,
    resolved: 65
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm">Total Cases</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-semibold text-blue-600">{stats.total}</p>
          <div className="p-2 bg-blue-100 rounded-full">
            <span className="text-blue-500">📋</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm">Critical Cases</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-semibold text-red-600">{stats.critical}</p>
          <div className="p-2 bg-red-100 rounded-full">
            <span className="text-red-500">⚠️</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm">Pending</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
          <div className="p-2 bg-yellow-100 rounded-full">
            <span className="text-yellow-500">⏳</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm">Resolved</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
          <div className="p-2 bg-green-100 rounded-full">
            <span className="text-green-500">✅</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
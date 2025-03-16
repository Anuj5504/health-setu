import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../DoctorDashboard/DashboardLayout';
import RecentIncidents from '../DoctorDashboard/RecentIncidents';
import { useRef } from 'react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const statsRef = useRef();


  const handleStatusUpdate = () => {
    statsRef.current?.refreshStats();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* <h1 className="text-2xl font-bold text-gray-900 ">Dashboard</h1> */}
      
        <RecentIncidents onStatusUpdate={handleStatusUpdate} />
        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'completed') {
      // Clear the URL parameter
      navigate('/dashboard', { replace: true });
      // Show success message
      toast.success('NGO documents signed successfully!');
    }
  }, [location, navigate]);

  const handleStatusUpdate = () => {
    statsRef.current?.refreshStats();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
        <RecentIncidents onStatusUpdate={handleStatusUpdate} />
        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
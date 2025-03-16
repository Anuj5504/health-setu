import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../DoctorDashboard/DashboardLayout';
import { motion } from "framer-motion";
import PatientInfo from '../PatientInfoDoc/PatientInfo';
import MedicineReminder from '../PatientInfoDoc/Add_task';
import Fitbit from '../PatientInfoDoc/Fitbit';

const DocPatientshealth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeComponent, setActiveComponent] = useState('Patient Info');
  const [formData, setFormData] = useState({
    role: 'Patient Info'
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'completed') {
      navigate('/dashboard', { replace: true });
      toast.success('NGO documents signed successfully!');
    }
  }, [location, navigate]);

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
    setFormData({ ...formData, role: componentName });
  };

  const getIcon = (componentName) => {
    switch(componentName) {
      case 'Patient Info':
        return '👤';
      case 'Medicine Reminder':
        return '💊';
      case 'FitBit Data':
        return '⌚';
      default:
        return '📋';
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Patient Info':
        return <PatientInfo patientId={id} />;
      case 'Medicine Reminder':
        return <MedicineReminder />;
      case 'FitBit Data':
        return <Fitbit />;
      default:
        return <PatientInfo patientId={id} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Patient Health Details</h1>
        <button
            onClick={() => navigate('/createprescription')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Create Prescription
        </button>
        <div className="flex gap-4 my-6">
          {["Patient Info", "Medicine Reminder", "FitBit Data"].map((componentName) => (
            <motion.button
              key={componentName}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleComponentChange(componentName)}
              className={`flex-1 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                activeComponent === componentName
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{getIcon(componentName)}</span>
                <span>{componentName}</span>
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6">
          {renderComponent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocPatientshealth;
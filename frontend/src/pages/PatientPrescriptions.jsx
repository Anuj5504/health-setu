import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import Prescriptions from '../PatientInfoDoc/Prescriptions';

const PatientPrescriptions = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
          <p className="text-gray-600 mt-1">View and manage your prescription history</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Prescriptions patientId={id} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescriptions; 
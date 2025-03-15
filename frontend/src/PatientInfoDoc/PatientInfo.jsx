import React from 'react';
import RecentIncidents from '../DoctorDashboard/RecentIncidents';

const PatientInfo = () => {
  // Sample patient data
  const patientData = {
    fullName: "John Smith",
    email: "john.smith@email.com",
    mobile: "+1 (555) 123-4567",
    city: "New York",
    address: "123 Main Street, Apt 4B, New York, NY 10001"
  };

  return (
    <div className="w-full space-y-6">
      {/* Patient Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <p className="text-lg font-medium text-gray-900">{patientData.fullName}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-lg font-medium text-gray-900">{patientData.email}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Mobile Number</label>
              <p className="text-lg font-medium text-gray-900">{patientData.mobile}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">City</label>
              <p className="text-lg font-medium text-gray-900">{patientData.city}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <p className="text-lg font-medium text-gray-900">{patientData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow-lg">
        <RecentIncidents />
      </div>
    </div>
  );
};

export default PatientInfo;

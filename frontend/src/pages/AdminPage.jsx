import React, { useState, useEffect } from 'react';
import DashboardLayout from '../AdminCpmpo/DashboardLayout';
import LoadingSpinner from '../AdminCpmpo/LoadingSpinner';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);

  useEffect(() => {
    fetchAllPatients();
    fetchDoctors();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      const formattedPatients = response.data.map(patient => ({
        _id: patient._id,
        name: patient.name || 'No Name',
        email: patient.email || 'No Email',
        contact: patient.mobileno || 'No Contact',
        address: patient.address,
        city: patient.city,
        disease: patient.disease ? {
          name: patient.disease.name,
          symptoms: patient.disease.symptoms,
          treatments: patient.disease.treatments
        } : null,
        caregiver: patient.caregiver ? {
          _id: patient.caregiver._id,
          name: patient.caregiver.name,
          email: patient.caregiver.email,
          contact: patient.caregiver.mobileno,
          specialization: patient.caregiver.specialization
        } : null,
        status: patient.caregiver ? 'Assigned' : 'Unassigned'
      }));
      
      console.log('Fetched patients:', formattedPatients); // Debug log
      setPatients(formattedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/caregivers');
      const formattedDoctors = response.data.map(doctor => ({
        _id: doctor._id,
        name: doctor.name || 'No Name',
        email: doctor.email || 'No Email',
        contact: doctor.mobileno || 'No Contact',
        address: doctor.address,
        city: doctor.city,
        patients: doctor.patients || [],
        specialization: doctor.specialization || 'General'
      }));
      
      setDoctors(formattedDoctors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handleAssignPatient = async () => {
    if (!selectedDoctor || !selectedPatient) {
      toast.error('Please select both a doctor and a patient');
      return;
    }

    try {
      setLoading(true);
      
      // Update patient's caregiver
      await axios.put(`http://localhost:5000/api/patients/update-caregiver`, {
        patientId: selectedPatient,
        caregiverId: selectedDoctor
      });

      // Refresh data
      await Promise.all([
        fetchAllPatients(),
        fetchDoctors()
      ]);

      toast.success('Patient assigned successfully');
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setShowAssigned(true);
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to assign patient');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    if (!showAssigned && !patient.caregiver) {
      if (selectedPatient === patient._id) {
        setSelectedPatient(null);
        setSelectedDoctor(null);
      } else {
        setSelectedPatient(patient._id);
      }
    }
  };

  const handleDoctorClick = (doctor) => {
    if (!showAssigned && selectedPatient) {
      if (selectedDoctor === doctor._id) {
        setSelectedDoctor(null);
      } else {
        setSelectedDoctor(doctor._id);
      }
    } else {
      setSelectedDoctorDetails(doctor);
      setShowDoctorDetails(true);
    }
  };

  const getDoctorPatients = (doctorId) => {
    return patients.filter(patient => 
      patient.caregiver && patient.caregiver._id === doctorId
    );
  };

  const filteredPatients = patients.filter(patient => {
    const isAssigned = patient.caregiver !== null;
    return showAssigned ? isAssigned : !isAssigned;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Patients</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{patients.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Doctors</h3>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Assigned Patients</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'Assigned').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {showAssigned ? 'Assigned Patients' : 'Unassigned Patients'}
                </h2>
                {/* Interactive guidance messages */}
                {!showAssigned && (
                  <div className="flex items-center gap-2">
                    {!selectedPatient && (
                      <div className="flex items-center text-blue-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <p className="text-sm">Click on a patient card to start assignment</p>
                      </div>
                    )}
                    {selectedPatient && !selectedDoctor && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm">Patient selected! Now choose a doctor →</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${!showAssigned ? 'text-blue-600' : 'text-gray-500'}`}>
                  Unassigned
                </span>
                <button
                  onClick={() => {
                    setShowAssigned(!showAssigned);
                    setSelectedPatient(null);
                    setSelectedDoctor(null);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    showAssigned ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      showAssigned ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${showAssigned ? 'text-green-600' : 'text-gray-500'}`}>
                  Assigned
                </span>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showAssigned ? 'assigned' : 'unassigned'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {filteredPatients.map((patient) => (
                    <motion.div
                      key={patient._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    //   whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedPatient === patient._id
                          ? 'bg-blue-50 border-blue-500 ring-blue-500'
                          : patient.status === 'Unassigned'
                          ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
                          : 'border-gray-200 bg-green-50 hover:bg-green-100'
                      }`}
                      onClick={() => handlePatientClick(patient)}
                    >
                      {selectedPatient === patient._id && (
                        <div className="absolute top-2 right-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(null);
                              setSelectedDoctor(null);
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                            {patient.status === 'Unassigned' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                No Doctor Assigned
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Doctor Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                          <p className="text-sm text-gray-500">Contact: {patient.contact}</p>
                          {patient.city && (
                            <p className="text-sm text-gray-500">Location: {patient.city}</p>
                          )}
                          {patient.disease && (
                            <div className="mt-2 p-2 bg-white rounded-md">
                              <p className="text-sm font-medium text-gray-700">Medical Condition:</p>
                              <p className="text-sm text-gray-500">{patient.disease.name}</p>
                              {patient.disease.symptoms && (
                                <p className="text-sm text-gray-500 truncate">
                                  Symptoms: {patient.disease.symptoms}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {patient.caregiver && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-blue-600">
                            Current Doctor:
                          </p>
                          <div className="mt-1 p-2 bg-blue-50 rounded-md">
                            <p className="text-sm font-medium text-gray-900">Dr. {patient.caregiver.name}</p>
                            <p className="text-sm text-gray-500">{patient.caregiver.email}</p>
                            <p className="text-sm text-gray-500">Contact: {patient.caregiver.contact}</p>
                            {patient.caregiver.specialization && (
                              <p className="text-sm text-gray-500">
                                Specialization: {patient.caregiver.specialization}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {filteredPatients.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-500 text-lg">
                        No {showAssigned ? 'assigned' : 'unassigned'} patients
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {showAssigned 
                          ? 'No patients have been assigned to doctors yet'
                          : 'All patients have been assigned to doctors'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Available Doctors</h2>
                {!showAssigned && selectedPatient && !selectedDoctor && (
                  <div className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <p className="text-sm">Select a doctor to complete assignment</p>
                  </div>
                )}
                {!showAssigned && selectedPatient && selectedDoctor && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Doctor selected! Click assign below</p>
                  </div>
                )}
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Total: {doctors.length}
              </span>
            </div>
            <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    // whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 relative hover:shadow-lg ${
                      selectedDoctor === doctor._id
                        ? 'bg-blue-50 border-blue-500 ring-blue-500'
                        : !showAssigned && selectedPatient
                        ? 'border-blue-200 hover:border-blue-500 hover:bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDoctorClick(doctor)}
                  >
                    {selectedDoctor === doctor._id && (
                      <div className="absolute top-2 right-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctor(null);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {!showAssigned && selectedPatient && !selectedDoctor && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        +
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 hover:text-blue-600">
                            Dr. {doctor.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {doctor.patients.length} Patients
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{doctor.email}</p>
                        <p className="text-sm text-gray-500">Contact: {doctor.contact}</p>
                        {doctor.city && (
                          <p className="text-sm text-gray-500">Location: {doctor.city}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Specialization: {doctor.specialization || 'General Practice'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assign Button */}
        {selectedPatient && !showAssigned && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAssignPatient}
              className={`px-8 py-3 rounded-lg font-medium shadow-lg transition-colors duration-200 flex items-center gap-2 ${
                selectedDoctor && selectedPatient
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedDoctor || !selectedPatient}
            >
              {selectedDoctor && selectedPatient ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Assign Doctor to Patient</span>
                </>
              ) : (
                <span>Select a Doctor to Complete Assignment</span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Doctor Details Modal */}
        <AnimatePresence>
          {showDoctorDetails && selectedDoctorDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Dr. {selectedDoctorDetails.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedDoctorDetails.specialization || 'General Practice'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDoctorDetails(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Contact Information</p>
                      <p className="text-gray-900">{selectedDoctorDetails.email}</p>
                      <p className="text-gray-900">{selectedDoctorDetails.contact}</p>
                      {selectedDoctorDetails.city && (
                        <p className="text-gray-900">{selectedDoctorDetails.city}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Patient Count</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {getDoctorPatients(selectedDoctorDetails._id).length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient List</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {getDoctorPatients(selectedDoctorDetails._id).map((patient) => (
                        <div
                          key={patient._id}
                          className="bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{patient.name}</h4>
                              <p className="text-sm text-gray-500">{patient.email}</p>
                              <p className="text-sm text-gray-500">Contact: {patient.contact}</p>
                            </div>
                            {patient.disease && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {patient.disease.name}
                              </span>
                            )}
                          </div>
                          {patient.disease && patient.disease.symptoms && (
                            <div className="mt-2 text-sm text-gray-500">
                              <p className="font-medium">Symptoms:</p>
                              <p className="mt-1">{patient.disease.symptoms}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {getDoctorPatients(selectedDoctorDetails._id).length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No patients assigned to this doctor yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;

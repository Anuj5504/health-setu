import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaClock, FaPills, FaCalendarAlt, FaStethoscope, FaUserMd, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Prescriptions = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prescriptions/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }

        const data = await response.json();
        setPrescriptions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescriptionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medicines?.some(med => med.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterDate === 'all') return matchesSearch;
    
    const prescDate = new Date(prescription.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - prescDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch(filterDate) {
      case 'week': return diffDays <= 7 && matchesSearch;
      case 'month': return diffDays <= 30 && matchesSearch;
      case 'year': return diffDays <= 365 && matchesSearch;
      default: return matchesSearch;
    }
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading prescriptions...</p>
    </div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center gap-2"
    >
      <FaInfoCircle className="text-xl" />
      {error}
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserMd className="text-blue-500" />
          Prescription History
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Search prescriptions..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.select
            whileFocus={{ scale: 1.02 }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </motion.select>
        </div>
      </div>
      
      {filteredPrescriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <FaFilePdf className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">No prescriptions found</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPrescriptions.map((prescription) => (
              <motion.div
                key={prescription._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.01 }}
                onHoverStart={() => setHoveredId(prescription._id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`border rounded-lg transition-all duration-300 ${
                  hoveredId === prescription._id ? 'shadow-lg border-blue-200' : 'shadow'
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <motion.div 
                        className="flex items-center gap-2 mb-2"
                        whileHover={{ x: 5 }}
                      >
                        <FaFilePdf className="text-red-500" />
                        <h3 className="font-semibold text-lg text-gray-800">
                          Prescription #{prescription.prescriptionId}
                        </h3>
                      </motion.div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <motion.div 
                          className="flex items-center gap-2 text-gray-600"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FaCalendarAlt className="text-blue-500" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-2 text-gray-600"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FaStethoscope className="text-green-500" />
                          <span>Diagnosis: {prescription.diagnosis}</span>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={false}
                        animate={{ 
                          height: expandedId === prescription._id ? 'auto' : 0,
                          opacity: expandedId === prescription._id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedId === prescription._id && (
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <FaPills className="text-purple-500" />
                              Prescribed Medicines
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {prescription.medicines.map((medicine, idx) => (
                                <motion.div
                                  key={idx}
                                  whileHover={{ scale: 1.03 }}
                                  className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                                >
                                  <p className="font-medium text-gray-800">{medicine.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{medicine.advice}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownload(prescription.pdfUrl)}
                        className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedId(expandedId === prescription._id ? null : prescription._id)}
                        className={`p-2 transition-colors ${
                          expandedId === prescription._id 
                            ? 'text-blue-500 hover:text-blue-700' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="View Details"
                      >
                        <FaClock />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Prescriptions; 
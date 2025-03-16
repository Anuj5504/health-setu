import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const AddTask = () => {
  const { id: patientId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Create goal with todo in a single request
      const response = await axios.post(`${API_URL}/api/goals`, {
        patientId: patientId,
        date: formData.date,
        todos: [{
          title: formData.title,
          description: formData.description,
          status: "pending"
        }]
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        toast.success('Medicine reminder added successfully!');
        setFormData({ title: '', description: '', date: '' });
      }
    } catch (error) {
      console.error('Error adding medicine reminder:', error);
      toast.error(error.response?.data?.msg || 'Failed to add medicine reminder');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add function to get today's date in YYYY-MM-DDThh:mm format
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Add Medicine Reminder</h2>
            <p className="text-gray-600 mt-2">Schedule medicine reminders for the patient</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter medicine name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDateTime()}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Instructions
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter medicine instructions (dosage, frequency, etc.)"
                required
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md"
            >
              Add Medicine Reminder
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddTask;

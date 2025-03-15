import React from 'react';
import { motion } from 'framer-motion';

const MedicineReminder = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Add Medicine Reminder</h2>
            <p className="mt-2">Set up medication schedule for the patient</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4">
                <label className="block text-sm font-medium mb-2">
                  Medicine Name
                </label>
                <input
                  type="text"
                  className="w-full h-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter medicine name"
                />
              </div>

              <div className="p-4">
                <label className="block text-sm font-medium mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full h-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="p-4">
                <label className="block text-sm font-medium mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  className="w-full h-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter dosage (e.g., 1 tablet)"
                />
              </div>

              <div className="p-4">
                <label className="block text-sm font-medium mb-2">
                  Frequency
                </label>
                <select className="w-full h-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="twice">Twice a day</option>
                  <option value="thrice">Thrice a day</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter any additional instructions (e.g., take after meals)"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md"
            >
              Set Reminder
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineReminder; 
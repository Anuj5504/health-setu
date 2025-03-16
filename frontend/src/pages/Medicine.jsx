import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashBoardCompo/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const patientId = decodedToken.user._id;

      const response = await axios.get(`${baseURL}/api/goals/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Sort goals by date
      const sortedMedicines = response.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setMedicines(sortedMedicines);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const patientId = decodedToken.user._id;

      await axios.post(`${baseURL}/api/goals`, {
        patientId: patientId,
        date: formData.date,
        todos: [{
          title: formData.title,
          description: formData.description,
          status: "pending"
        }]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchMedicines();
      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        date: ''
      });
      toast.success('Medicine reminder added successfully');
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine reminder');
    }
  };

  const handleStatusUpdate = async (todoId, newStatus) => {
    try {
      await axios.put(`${baseURL}/api/goals/todo/${todoId}`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh the medicines list
      await fetchMedicines();
      toast.success('Medicine reminder updated successfully');
    } catch (error) {
      console.error('Error updating medicine status:', error);
      toast.error('Failed to update medicine status');
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
  };

  const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear();
  };

  const isPast = (date) => {
    const now = new Date();
    const compareDate = new Date(date);
    return compareDate < now;
  };

  const getRelativeDateLabel = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const compareDate = new Date(date);

    if (isToday(date)) {
      return 'Today';
    } else if (
      compareDate.getDate() === tomorrow.getDate() &&
      compareDate.getMonth() === tomorrow.getMonth() &&
      compareDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    } else if (
      compareDate.getDate() === yesterday.getDate() &&
      compareDate.getMonth() === yesterday.getMonth() &&
      compareDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const timeFromNow = date > now ? 'in ' : '';
    if (diffDays === 0) {
      return `${dateStr} at ${timeStr}`;
    }
    return `${dateStr} at ${timeStr}`;
  };

  const organizeMedicines = (medicines) => {
    const upcoming = [];
    const past = [];
    const completed = [];
    const now = new Date();

    medicines.forEach(medicine => {
      const medicineDate = new Date(medicine.date);
      
      if (medicine.todos[0]?.status === 'completed') {
        completed.push(medicine);
      } else if (medicineDate > now) {
        upcoming.push(medicine);
      } else {
        past.push(medicine);
      }
    });

    // Sort by time
    const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);
    const sortByDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

    return {
      upcoming: upcoming.sort(sortByDate), // Nearest future first
      past: past.sort(sortByDateDesc), // Most recent past first
      completed: completed.sort(sortByDateDesc) // Most recent first
    };
  };

  const MedicineCard = ({ medicine }) => {
    const medicineDate = new Date(medicine.date);
    const now = new Date();
    const isPastDue = medicineDate < now && medicine.todos[0]?.status !== 'completed';

    return (
      <div 
        className={`bg-white rounded-xl shadow-lg p-6 border ${
          isPastDue ? 'border-red-200' : 'border-gray-100'
        } hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {medicine.todos[0]?.title}
            </h3>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              medicine.todos[0]?.status === 'completed' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : medicineDate < now
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {medicine.todos[0]?.status === 'completed' 
                ? 'Taken' 
                : medicineDate < now ? 'Missed' : 'Pending'}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 flex items-center mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(medicine.date)}
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-gray-600 text-sm">
              {medicine.todos[0]?.description}
            </p>
          </div>

          {medicine.todos[0]?.status !== 'completed' && (
            <button
              onClick={() => handleStatusUpdate(medicine.todos[0]?._id, 'completed')}
              className={`inline-flex items-center justify-center px-4 py-2 ${
                isPastDue ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isPastDue ? 'Mark as Taken Late' : 'Mark as Taken'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const MedicineSection = ({ title, medicines, icon }) => medicines.length > 0 && (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold text-gray-800 ml-2">{title}</h2>
        <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          {medicines.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((medicine) => (
          <MedicineCard key={medicine._id} medicine={medicine} />
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Reminders</h1>
            <p className="mt-1 text-gray-600">Keep track of your daily medications</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg 
              className={`w-5 h-5 mr-2 transition-transform duration-200 ${showAddForm ? 'rotate-45' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showAddForm ? 'Cancel' : 'Add New Reminder'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter medicine name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getMinDateTime()}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Instructions</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter medicine instructions (dosage, frequency, etc.)"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <MedicineSection 
              title="Upcoming Medicines" 
              medicines={organizeMedicines(medicines).upcoming}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            <MedicineSection 
              title="Missed Medicines" 
              medicines={organizeMedicines(medicines).past}
              icon={
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            <MedicineSection 
              title="Completed Medicines" 
              medicines={organizeMedicines(medicines).completed}
              icon={
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Medicine; 
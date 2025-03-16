import React, { useState, useEffect } from 'react';
import AdminSidebar from './Sidebar';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { FaBoxOpen, FaChartLine, FaExclamationTriangle, FaArrowUp } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const DemandForecast = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [forecastData, setForecastData] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const itemsPerPage = 10;
    const [savingPrediction, setSavingPrediction] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/predict');
                setForecastData(response.data);
                setLoading(false);
                console.log(response)
            } catch (err) {
                toast.error('Error fetching forecast data');
                setLoading(false);
            }

        };

        fetchData();
    }, []);

    const handleAddToStock = (medicine) => {
        // Add your stock management logic here
        toast.success(`Added ${medicine} to stock`);
    };

    const getAdminIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.user?._id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleSavePrediction = async (medicine, prediction) => {
        try {
            const adminId = getAdminIdFromToken();
            if (!adminId) {
                toast.error('Please login first');
                return;
            }

            setSavingPrediction(true);

            // Get the prediction data from the forecast
            const medicineData = forecastData[medicine];
            if (!medicineData) {
                throw new Error('No forecast data available for this medicine');
            }

            const predictedDate = new Date();
            predictedDate.setDate(predictedDate.getDate() + 30);

            const requestData = {
                adminId,
                itemName: medicine,
                predictedQuantity: medicineData.predicted_demand,
                predictedDate: predictedDate.toISOString(),
                priority: medicineData.demand_analysis?.alert_level === 'high' ? 'high' : 'medium'
            };

            console.log('Sending prediction data:', requestData);

            // Use the correct API URL
            const response = await fetch('http://localhost:5000/api/distributions/predicted-needs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save prediction');
            }

            const result = await response.json();
            console.log('Save result:', result);

            toast.success(`Saved ${medicine} to distribution needs`);
        } catch (error) {
            console.error('Error saving prediction:', error);
            toast.error(error.message);
        } finally {
            setSavingPrediction(false);
        }
    };

    const renderAnalytics = (medicine) => {
        const data = forecastData[medicine];
        return (
            <div className="mt-8 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <FaBoxOpen className="text-blue-500 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Predicted Demand</p>
                                <p className="text-2xl font-bold text-gray-700">{data.predicted_demand}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <FaChartLine className="text-green-500 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Recommended Stock</p>
                                <p className="text-2xl font-bold text-gray-700">{data.recommended_stock}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <FaArrowUp className="text-yellow-500 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Growth Rate</p>
                                <p className="text-2xl font-bold text-gray-700">{data.demand_analysis.growth_rate}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${data.demand_analysis.alert_level === 'high' ? 'border-red-500' :
                        data.demand_analysis.alert_level === 'medium' ? 'border-yellow-500' :
                            'border-green-500'
                        }`}>
                        <div className="flex items-center">
                            <div className={`p-3 ${data.demand_analysis.alert_level === 'high' ? 'bg-red-100' :
                                data.demand_analysis.alert_level === 'medium' ? 'bg-yellow-100' :
                                    'bg-green-100'
                                } rounded-full`}>
                                <FaExclamationTriangle className={`${data.demand_analysis.alert_level === 'high' ? 'text-red-500' :
                                    data.demand_analysis.alert_level === 'medium' ? 'text-yellow-500' :
                                        'text-green-500'
                                    } text-xl`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Alert Level</p>
                                <p className={`text-2xl font-bold capitalize ${data.demand_analysis.alert_level === 'high' ? 'text-red-500' :
                                    data.demand_analysis.alert_level === 'medium' ? 'text-yellow-500' :
                                        'text-green-500'
                                    }`}>
                                    {data.demand_analysis.alert_level}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Demand Forecast Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Daily Demand Forecast</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.daily_forecast}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="ds"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                        formatter={(value) => [`${value} units`, "Predicted Demand"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="yhat"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                        name="Predicted Demand"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Insights Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                        <div className="space-y-4">
                            {data.demand_analysis.insights.map((insight, index) => (
                                <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                                    <FaChartLine className="text-blue-500 mt-1 mr-3" />
                                    <p className="text-gray-700">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Pagination logic
    const medicines = Object.keys(forecastData);
    const totalPages = Math.ceil(medicines.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                currentPage="analysis"
            />
            <div className="flex-1 p-6 ml-[80px] md:ml-64 mt-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Medicine Demand Forecast</h1>
                        <p className="mt-2 text-gray-600">AI-powered predictions for medicine demand</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <FaChartLine className="text-blue-500 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Medicines</p>
                                    <p className="text-2xl font-bold text-gray-700">{Object.keys(forecastData).length}</p>
                                </div>
                            </div>
                        </div>
                        {/* Add more summary stats as needed */}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Medicine Table */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">Medicine Predictions</h2>
                                <p className="mt-1 text-sm text-gray-500">Manage and track medicine demand predictions</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Medicine Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Predicted Demand
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Alert Level
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentMedicines.map((medicine) => (
                                            <tr key={medicine} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 capitalize">{medicine}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {forecastData[medicine].predicted_demand} units
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${forecastData[medicine].demand_analysis.alert_level === 'high'
                                                            ? 'bg-red-100 text-red-800'
                                                            : forecastData[medicine].demand_analysis.alert_level === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'}`}>
                                                        {forecastData[medicine].demand_analysis.alert_level}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => handleAddToStock(medicine)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                                                    >
                                                        <FaBoxOpen className="mr-1.5 h-4 w-4" />
                                                        Add to Stock
                                                    </button>
                                                    <button
                                                        onClick={() => handleSavePrediction(medicine, forecastData[medicine])}
                                                        disabled={savingPrediction}
                                                        className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors
                                                            ${savingPrediction
                                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                                    >
                                                        {savingPrediction ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-700 border-t-transparent mr-1.5"></div>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaChartLine className="mr-1.5 h-4 w-4" />
                                                                Save Prediction
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedMedicine(medicine)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                    ${currentPage === page
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }
                                                    ${page === 1 ? 'rounded-l-md' : ''}
                                                    ${page === totalPages ? 'rounded-r-md' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Section */}
                        {selectedMedicine && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Detailed Analysis: {selectedMedicine}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedMedicine(null)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {renderAnalytics(selectedMedicine)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandForecast;
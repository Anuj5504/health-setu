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

const API_URL = import.meta.env.VITE_API_URL;

const DemandForecast = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [forecastData, setForecastData] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/predict');
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
        <div className="flex h-screen w-screen mt-14">
            <div className="w-64 bg-white shadow h-full">
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    currentPage="analysis"
                />
            </div>

            <div className="flex-1 bg-gray-50 p-8 h-full overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Medicine Demand Forecast</h1>

                {/* Medicine Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Medicine Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Predicted Demand</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentMedicines.map((medicine) => (
                                <tr key={medicine} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 capitalize">{medicine}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{forecastData[medicine].predicted_demand}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-3">
                                        <button
                                            onClick={() => handleAddToStock(medicine)}
                                            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            <FaBoxOpen className="mr-2" />
                                            Add to Stock
                                        </button>
                                        <button
                                            onClick={() => setSelectedMedicine(selectedMedicine === medicine ? null : medicine)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            <FaChartLine className="mr-2" />
                                            {selectedMedicine === medicine ? 'Hide Analytics' : 'Show Analytics'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-md transition-colors ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Analytics Section */}
                {selectedMedicine && renderAnalytics(selectedMedicine)}
            </div>
        </div>
    );
};

export default DemandForecast;
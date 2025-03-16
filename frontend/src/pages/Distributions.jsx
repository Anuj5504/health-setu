import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../Inventory/Sidebar';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:5000';

const Distributions = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const adminId = getAdminIdFromToken();
        if (!adminId) {
            toast.error('Please login first');
            return;
        }

        try {
            setLoading(true);
            const [adminsRes, requestsRes, predictedNeedsRes] = await Promise.all([
                fetch(`${API_URL}/api/distributions/admins-low-stock/${adminId}`),
                fetch(`${API_URL}/api/distributions/requests/${adminId}`),
                fetch(`${API_URL}/api/distributions/predicted-needs/${adminId}`)
            ]);

            if (!adminsRes.ok || !requestsRes.ok || !predictedNeedsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [adminsData, requestsData, predictedNeedsData] = await Promise.all([
                adminsRes.json(),
                requestsRes.json(),
                predictedNeedsRes.json()
            ]);

            console.log('Predicted needs data:', predictedNeedsData); // Debug log

            // Merge predicted needs with admins data
            const adminsWithAllNeeds = adminsData.map(admin => {
                const predictedNeeds = predictedNeedsData.find(p => p._id === admin._id)?.predictedNeeds || [];
                return {
                    ...admin,
                    predictedNeeds
                };
            });

            setAdmins(adminsWithAllNeeds);
            setMyRequests(requestsData.filter(r => r.requestingAdminId._id === adminId));
            setIncomingRequests(requestsData.filter(r => r.sourceAdminId._id === adminId));
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRequest = async () => {
        if (!selectedAdmin || selectedItems.length === 0) {
            toast.error('Please select items and admin');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/distributions/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestingAdminId: getAdminIdFromToken(),
                    sourceAdminId: selectedAdmin._id,
                    items: selectedItems
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            toast.success('Request sent successfully');
            fetchData();
            setSelectedItems([]);
            setSelectedAdmin(null);
        } catch (error) {
            toast.error(error.message || 'Failed to send request');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                currentPage="distributions"
            />
            <div className="flex-1 p-6 ml-[80px] md:ml-64 mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Distribution Management</h1>
                        <p className="mt-2 text-gray-600">Manage inventory distribution and help other hospitals in need</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-600">Hospitals Needing Help</h2>
                                    <p className="text-lg font-semibold text-gray-900">{admins.filter(a => a.lowStockItems?.length > 0).length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-600">Pending Requests</h2>
                                    <p className="text-lg font-semibold text-gray-900">{myRequests.filter(r => r.status === 'pending').length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-600">Predicted Needs</h2>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {admins.filter(a => a.predictedNeeds?.length > 0).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Hospitals with Low Stock */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-red-500 to-red-600">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    Hospitals with Low Stock
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {admins.map(admin => (
                                    <div key={admin._id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{admin.name}</h3>
                                                <p className="text-sm text-gray-500">{admin.city}</p>
                                            </div>
                                            {admin.aiRecommendation && (
                                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    AI Recommended
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {admin.lowStockItems.map((item, idx) => (
                                                <div key={idx}
                                                    className={`flex items-center justify-between p-3 rounded-lg ${item.priority === 'low' ? 'bg-green-50 border border-green-200' :
                                                        item.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                                                            'bg-red-50 border border-red-200'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.itemName}</p>
                                                        <div className="mt-1 flex items-center">
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-500">Stock:</span>
                                                                <span className="ml-1 text-sm font-medium text-gray-900">
                                                                    {item.quantity} / {item.reorderLevel}
                                                                </span>
                                                            </div>
                                                            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${item.priority === 'low' ? 'bg-green-100 text-green-800' :
                                                                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                {item.priority} priority
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAdmin(admin);
                                                            setSelectedItems([{
                                                                itemName: item.itemName,
                                                                quantity: item.reorderLevel - item.quantity,
                                                                priority: item.priority
                                                            }]);
                                                        }}
                                                        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${item.priority === 'low' ? 'bg-green-500 hover:bg-green-600' :
                                                            item.priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                                'bg-red-500 hover:bg-red-600'
                                                            }`}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Help
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Requests and Predicted Needs */}
                        <div className="space-y-8">
                            {/* My Requests */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        My Requests
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                                    {myRequests.map(request => (
                                        <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        To: {request.sourceAdminId.name}
                                                    </p>
                                                    <div className="mt-2 space-y-1">
                                                        {request.items.map((item, idx) => (
                                                            <p key={idx} className="text-sm text-gray-600 flex items-center">
                                                                <span className="w-2 h-2 rounded-full mr-2 ${
                                                                    item.priority === 'high' ? 'bg-red-500' :
                                                                    item.priority === 'medium' ? 'bg-yellow-500' :
                                                                    'bg-green-500'
                                                                }"></span>
                                                                {item.itemName}: {item.quantity} units
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Predicted Needs */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Predicted Needs
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                                    {admins.filter(admin => admin.predictedNeeds?.length > 0).map(admin => (
                                        <div key={admin._id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{admin.name}</h3>
                                                    <p className="text-sm text-gray-500">{admin.city}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {admin.predictedNeeds.map((item, idx) => (
                                                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.itemName}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    Need: {item.quantity} units
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    Expected: {new Date(item.predictedDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAdmin(admin);
                                                                    setSelectedItems([{
                                                                        itemName: item.itemName,
                                                                        quantity: item.quantity,
                                                                        priority: item.priority
                                                                    }]);
                                                                }}
                                                                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                                                            >
                                                                Help
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {admins.filter(admin => admin.predictedNeeds?.length > 0).length === 0 && (
                                        <div className="p-6 text-center text-gray-500">
                                            No predicted needs found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Modal */}
                {selectedAdmin && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Help {selectedAdmin.name}
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedAdmin(null);
                                        setSelectedItems([]);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {selectedItems.map((item, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {item.itemName}
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const newItems = [...selectedItems];
                                                    newItems[index].quantity = parseInt(e.target.value) || 0;
                                                    setSelectedItems(newItems);
                                                }}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="1"
                                            />
                                            <span className="text-sm text-gray-500">units</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setSelectedAdmin(null);
                                            setSelectedItems([]);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateRequest}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Distributions;

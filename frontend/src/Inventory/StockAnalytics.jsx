import React, { useState, useEffect } from 'react';
import AdminSidebar from './Sidebar';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const API_URL = import.meta.env.VITE_API_URL;

const StockAnalytics = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/inventory/`);
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    // Helper function to get expired items by category
    const getExpiredItemsByCategory = () => {
        const expiredItems = items.filter(item => new Date(item.expiryDate) < new Date());
        const categoryCount = expiredItems.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(categoryCount),
            data: Object.values(categoryCount)
        };
    };

    // Prepare data for pie chart
    const expiredItemsData = getExpiredItemsByCategory();
    const pieChartData = {
        labels: expiredItemsData.labels,
        datasets: [{
            data: expiredItemsData.data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Prepare data for expired without use
    const expiredWithoutUseData = {
        labels: expiredItemsData.labels,
        datasets: [{
            label: 'Expired Without Use',
            data: items
                .filter(item => new Date(item.expiryDate) < new Date() && item.quantity > 0)
                .reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + item.quantity;
                    return acc;
                }, {}),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    // Prepare data for stock usage trend (last 6 months)
    const getStockUsageTrend = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June'];
        // Mock data - replace with actual usage data
        const usageData = {
            Medicine: [65, 59, 80, 81, 56, 55],
            Equipment: [28, 48, 40, 19, 86, 27],
            Consumables: [45, 30, 50, 60, 20, 40]
        };

        return {
            labels: months,
            datasets: Object.entries(usageData).map(([category, data], index) => ({
                label: category,
                data: data,
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ][index],
                tension: 0.1
            }))
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-y-scroll mt-14">
            <div className="w-64 bg-white shadow flex-shrink-0">
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    currentPage="analytics"
                />
            </div>

            <div className="flex-1 bg-gray-100 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Stock Usage Trend</h3>
                        <Line
                            data={getStockUsageTrend()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: {
                                        display: true,
                                        text: 'Stock Usage Over Time'
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Expired Items by Category</h3>
                        <div className='flex items-center justify-center'>

                        <div className="flex justify-center items-center" style={{ height: '400px', width: '400px' }}>
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: {
                                            display: true,
                                            text: 'Distribution of Expired Items'
                                        }
                                    }
                                }}
                                width={400}
                                height={400}
                                />
                        </div>
                        </div>
                    </div>


                    <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Items Expired Without Use</h3>
                        <Bar
                            data={expiredWithoutUseData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: {
                                        display: true,
                                        text: 'Quantity of Items Expired Without Use by Category'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockAnalytics;

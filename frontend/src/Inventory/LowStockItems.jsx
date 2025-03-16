import React, { useState, useEffect } from 'react';
import AdminSidebar from './Sidebar';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:5000';

const getAdminIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = jwtDecode(token);
        return payload.user._id;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};

const LowStockItems = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showExpiringOnly, setShowExpiringOnly] = useState(false);
    const [showExpired, setShowExpired] = useState(false);

    const fetchItems = async () => {
        try {
            const adminId = getAdminIdFromToken();
            if (!adminId) {
                setError('Authentication error');
                return;
            }

            const response = await fetch(`${API_URL}/api/inventory/low-stock`, {  // Changed endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setError('Failed to load items');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [showExpiringOnly, showExpired]);

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const adminId = getAdminIdFromToken();
            if (!adminId) {
                toast.error("Authentication error");
                return;
            }

            const response = await fetch(`${API_URL}/api/inventory/delete/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminId })
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            toast.success('Item deleted successfully');
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Error deleting item');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            const adminId = getAdminIdFromToken();
            if (!adminId) {
                toast.error("Authentication error");
                return;
            }

            const response = await fetch(`${API_URL}/api/inventory/update/${editingItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: parseInt(editingItem.quantity),
                    reorderLevel: parseInt(editingItem.reorderLevel),
                    adminId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            toast.success('Item updated successfully');
            await fetchItems();
            setEditingItem(null);
        } catch (error) {
            toast.error('Error updating item');
        } finally {
            setUpdateLoading(false);
        }
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const differenceInDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return differenceInDays <= 7 && differenceInDays > 0;
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        return expiry < today;
    };

    const filteredItems = items
        .filter(item => {
            if (showExpired) {
                return isExpired(item.expiryDate);
            }
            if (showExpiringOnly) {
                return isExpiringSoon(item.expiryDate);
            }
            return item.quantity < item.reorderLevel;
        })
        .filter(item =>
            selectedCategory === 'All' || item.category === selectedCategory
        )
        .filter(item =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="flex h-screen w-screen mt-14">
            <div className="w-64 bg-white shadow h-full">
                <AdminSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    currentPage="low-stock"
                />
            </div>

            <div className="flex-1 bg-gray-100 p-6 h-full overflow-y-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            {showExpired ? 'Expired Items' : 'Low Stock Items'}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-2 rounded-lg border ${!showExpired
                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                                onClick={() => {
                                    setShowExpired(false);
                                    setShowExpiringOnly(false);
                                }}
                            >
                                Low Stock Items
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg border ${showExpired
                                    ? 'bg-red-100 border-red-500 text-red-700'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                                onClick={() => {
                                    setShowExpired(true);
                                    setShowExpiringOnly(false);
                                }}
                            >
                                Expired Items
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="px-4 py-2 border rounded-lg flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="px-4 py-2 border rounded-lg"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Consumables">Consumables</option>
                            <option value="Other">Other</option>
                        </select>
                        {!showExpired && (
                            <button
                                className={`px-4 py-2 rounded-lg border ${showExpiringOnly
                                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                                onClick={() => setShowExpiringOnly(!showExpiringOnly)}
                            >
                                {showExpiringOnly ? 'Showing Expiring Items' : 'Show Expiring Items'}
                            </button>
                        )}
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm text-gray-500">Total Items</h3>
                            <p className="text-2xl font-semibold">{items.length}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h3 className="text-sm text-red-500">Expired Items</h3>
                            <p className="text-2xl font-semibold text-red-600">
                                {items.filter(item => isExpired(item.expiryDate)).length}
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm text-yellow-600">Expiring Soon</h3>
                            <p className="text-2xl font-semibold text-yellow-600">
                                {items.filter(item => isExpiringSoon(item.expiryDate)).length}
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No {showExpired ? 'expired' : 'low stock'} items found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Item Name</th>
                                        <th className="px-4 py-2 text-left">Category</th>
                                        <th className="px-4 py-2 text-left">Quantity</th>
                                        <th className="px-4 py-2 text-left">Unit</th>
                                        <th className="px-4 py-2 text-left">Reorder Level</th>
                                        <th className="px-4 py-2 text-left">Expiry Date</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map(item => (
                                        <tr key={item._id} className="border-t">
                                            <td className="px-4 py-2">{item.itemName}</td>
                                            <td className="px-4 py-2">{item.category}</td>
                                            <td className="px-4 py-2">
                                                <span className={`font-medium ${item.quantity < item.reorderLevel ? 'text-red-500' : 'text-gray-900'
                                                    }`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{item.unit}</td>
                                            <td className="px-4 py-2">{item.reorderLevel}</td>
                                            <td className="px-4 py-2">
                                                {item.expiryDate ? (
                                                    <span className={`${isExpiringSoon(item.expiryDate) ? 'text-yellow-600' : 'text-gray-900'
                                                        }`}>
                                                        {new Date(item.expiryDate).toLocaleDateString()}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {isExpiringSoon(item.expiryDate) && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                        Expiring Soon
                                                    </span>
                                                )}
                                                {item.quantity < item.reorderLevel && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                        Low Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editingItem && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-96">
                                <h3 className="text-lg font-semibold mb-4">Edit Item: {editingItem.itemName}</h3>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={editingItem.quantity}
                                            onChange={(e) => setEditingItem({
                                                ...editingItem,
                                                quantity: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reorder Level
                                        </label>
                                        <input
                                            type="number"
                                            value={editingItem.reorderLevel}
                                            onChange={(e) => setEditingItem({
                                                ...editingItem,
                                                reorderLevel: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingItem(null)}
                                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                            disabled={updateLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LowStockItems;
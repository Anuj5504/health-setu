import React, { useState, useEffect } from 'react';
import { BiBell } from 'react-icons/bi'; // Make sure to install react-icons

const InventoryNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://hm-0023-mle.vercel.app/api/inventory/');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const items = await response.json();

      const newNotifications = [];

      const expiredItems = items.filter(item => {
        const today = new Date();
        const expiry = new Date(item.expiryDate);
        return expiry < today;
      });

      const expiringSoonItems = items.filter(item => {
        if (!item.expiryDate) return false;
        const today = new Date();
        const expiry = new Date(item.expiryDate);
        const differenceInDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return differenceInDays <= 7 && differenceInDays > 0;
      });

      const outOfStockItems = items.filter(item => item.quantity === 0);

      const lowStockItems = items.filter(item =>
        item.quantity > 0 && item.quantity < item.reorderLevel
      );

      if (expiredItems.length > 0) {
        newNotifications.push({
          type: 'error',
          message: `${expiredItems.length} items have expired`,
          items: expiredItems.map(item => item.itemName)
        });
      }

      if (expiringSoonItems.length > 0) {
        newNotifications.push({
          type: 'warning',
          message: `${expiringSoonItems.length} items expiring soon`,
          items: expiringSoonItems.map(item => item.itemName)
        });
      }

      if (outOfStockItems.length > 0) {
        newNotifications.push({
          type: 'error',
          message: `${outOfStockItems.length} items out of stock`,
          items: outOfStockItems.map(item => item.itemName)
        });
      }

      if (lowStockItems.length > 0) {
        newNotifications.push({
          type: 'warning',
          message: `${lowStockItems.length} items running low`,
          items: lowStockItems.map(item => item.itemName)
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-end items-center relative">

      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <BiBell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 border-b border-gray-100 ${notification.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></span>
                    <p className={`font-medium ${notification.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                      {notification.message}
                    </p>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {notification.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default InventoryNavbar;

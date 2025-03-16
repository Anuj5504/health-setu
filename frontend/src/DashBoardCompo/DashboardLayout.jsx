import { useState } from 'react';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile navbar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b lg:hidden">
        <div className="px-4 h-16 flex items-center mt-16">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex pt-32 lg:pt-28">
        {/* Sidebar - Now positioned relative to navbar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
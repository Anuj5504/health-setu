import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  Bars3Icon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userData = decodedToken.user;
        if (userData) {
          setUserId(userData._id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  
  const menuItems = [
    {
      title: 'Medicine',
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      path: '/medicine',
      status: 'active'
    },
    {
      title: 'Appointments',
      icon: <CalendarIcon className="w-6 h-6" />,
      path: '/PAppointments',
      status: 'active'
    },
    {
      title: 'Fitbit Data',
      icon: <ChartBarIcon className="w-6 h-6" />,
      path: '/fitbit-data',
      status: 'active'
    },
    {
      title: 'Prescriptions',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      path: `/patient-prescriptions/${userId}`,
      status: 'active'
    },
    {
      title: 'Doctor Profile',
      icon: <UserIcon className="w-6 h-6" />,
      path: '/doctor-profile',
      status: 'active'
    },
    {
      title: 'Report AI',
      icon: <UserIcon className="w-6 h-6" />,
      path: '/report-ai',
      status: 'active'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.title === 'Prescriptions' && !userId) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full
        w-[280px] bg-white border-r
        shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-30 lg:z-10
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b bg-white">
          <h2 className="text-xl font-bold text-blue-600">Patient Dashboard</h2>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4">
          <div className="px-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 rounded-lg cursor-pointer
                    transition-all duration-200 ease-in-out
                    transform hover:scale-[1.02]
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className={`
                      transition-transform duration-200 ease-in-out
                      group-hover:scale-110
                      ${isActive ? 'text-blue-600' : 'text-gray-500'}
                    `}>
                      {item.icon}
                    </span>
                    <span className={`
                      font-medium transition-colors duration-200
                      ${isActive ? 'text-blue-600' : ''}
                    `}>
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
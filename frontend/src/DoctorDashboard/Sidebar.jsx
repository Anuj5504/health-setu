import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <HomeIcon className="w-6 h-6" />,
      path: '/docdashboard',
      status: 'active'
    },
    {
      title: 'Appointments',
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      path: '/appointments',
      status: 'active'
    },
    {
      title: 'Notifications',
      icon: <BellIcon className="w-6 h-6" />,
      path: '/',
      status: 'active'
    },
    // {
    //   title: 'Analytics',
    //   icon: <ChartBarIcon className="w-6 h-6" />,
    //   path: '/dashboard/analytics',
    //   status: 'coming-soon'
    // },
    // {
    //   title: 'Settings',
    //   icon: <Cog6ToothIcon className="w-6 h-6" />,
    //   path: '/dashboard/settings',
    //   status: 'under-development'
    // }
  ];

  const handleItemClick = (item) => {
    if (item.status !== 'active') {
      navigate(`${item.path}?maintenance=true&title=${item.title}`);
    }
  };

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:opacity-100'}
      lg:translate-x-0
      fixed lg:sticky
      top-20
      h-[calc(100vh-5rem)] 
      w-64
      bg-white
      border-r
      shadow-lg lg:shadow-none
      transform
      transition-all
      duration-300
      ease-in-out
      z-30
      overflow-hidden
      flex flex-col
    `}>
      {/* <div className="h-20 flex-shrink-0 flex items-center justify-center border-b bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl font-bold text-blue-600 transform transition-transform hover:scale-105">
          Dashboard
        </h2>
      </div> */}

      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 space-y-1 py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return item.status === 'active' ? (
              <Link
                key={item.title}
                to={item.path}
                className={`
                  group
                  flex items-center px-4 py-3 rounded-lg
                  transition-all duration-200 ease-in-out
                  transform hover:scale-[1.02]
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}
                `}
              >
                <div className="flex items-center gap-4 w-full">
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
            ) : (
              <div
                key={item.title}
                onClick={() => handleItemClick(item)}
                className={`
                  group
                  flex items-center px-4 py-3 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out
                  opacity-60 hover:opacity-80
                  ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className="transition-transform duration-200 ease-in-out group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
import React,{ useState } from "react";
import {
  Users,
  FileText,
  Video,
  LayoutDashboard,
  CheckSquare,
  Shield,
  BarChart2,
  Home,
  Settings,
  LogOut,
  UserCog,
  PlusSquare,
  Package,
} from "lucide-react";
import clsx from "clsx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BiHome, BiAddToQueue, BiError, BiChart } from "react-icons/bi";

const sections = [
  {
    title: "Inventory",
    items: [
      { label: "Inventory Dashboard", icon: Home, href: "/admin/inventory",page:"dashboard" },
    ],
  },  
  {
    title: "Manage Inventory",
    items: [
      { label: "Add item", icon: PlusSquare, href: "/admin/inventory/add-item",page:"add-items" },
      { label: "Low Stock Items", icon: Package, href: "/admin/inventory/low-stock" ,page:"low-stock"},
    ],
  },
  // {
  //   title: "Analytics",
  //   items: [{ label: "Stock Analytics", icon: BarChart2, href: "/admin/inventory/stock-analytics",page:"analytics" }],
    
  // },
];

export default function AdminSidebar({collapsed,setCollapsed, currentPage}) {
  return (
    <nav
  className={clsx(
    "fixed top-0 left-0 ] h-screen p-4 flex flex-col justify-between transition-all duration-300 shadow-lg overflow-y-auto",
    collapsed ? "w-20" : "w-64"
  )}
>
      <div>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold tracking-wide">Inventory</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-500 hover:text-white flex justify-center items-center"
          >
            {collapsed ? (
              <span className="material-symbols-outlined cursor-pointer">arrow_forward_ios</span>
            ) : (
              <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center my-6">
          <div className="800px:flex items-center gap-2">
            
              <HiOutlineUserCircle
                size={40}
                className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
              />
          </div>
          {!collapsed && (
            <>
              <p className="text-xl text-gray-400">- Admin</p>
            </>
          )}
        </div>

        <ul className="space-y-2">
          <Link to="/admin-dashboard">
            <li className="cursor-pointer flex items-center p-2 rounded-md hover:bg-green-500 transition-transform duration-300 transform hover:scale-105">
              <Home className="w-6 h-6" />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </li>
          </Link>

          {sections.map((section) => (
            <div key={section.title} className="cursor-pointer">
              {!collapsed && (
                <h4 className="text-xs uppercase text-gray-400 font-semibold my-4">
                  {section.title}
                </h4>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`
                    flex items-center p-2 rounded-md transition-transform duration-300 transform hover:scale-105 hover:bg-blue-600 cursor-pointer
                    ${currentPage === item.page 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-6 h-6" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </ul>
      </div>

      
    </nav>
  );
}

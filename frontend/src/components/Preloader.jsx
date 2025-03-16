import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Preloader = () => {
  const [show, setShow] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Only show preloader on root path
    if (location.pathname !== '/') {
      setShow(false);
      return;
    }

    // Add overflow hidden to body when preloader is active
    document.body.style.overflow = 'hidden';

    // Remove preloader after animation
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = 'unset';
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [location]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Background pulse circles - Responsive sizes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 md:w-64 md:h-64 bg-blue-500/5 rounded-full animate-ping"></div>
        <div className="absolute w-36 h-36 md:w-48 md:h-48 bg-indigo-500/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-blue-500/15 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>

      <div className="relative max-w-sm w-full mx-auto">
        {/* Main heartbeat animation - Responsive size */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8 mx-auto">
          <svg 
            className="w-full h-full text-blue-600 animate-pulse" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          
          {/* ECG Line - Responsive width */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-36 md:w-48">
            <svg className="w-full" height="20" viewBox="0 0 100 20">
              <path
                className="ecg-line text-blue-500"
                d="M 0,10 L 10,10 L 15,0 L 20,20 L 25,10 L 30,10 L 35,10 L 40,10 L 45,0 L 50,20 L 55,10 L 60,10 L 65,10 L 70,10 L 75,0 L 80,20 L 85,10 L 90,10 L 95,10 L 100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Hospital Name - Responsive text */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            HealthCare
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Your Health, Our Priority
          </p>
        </div>

        {/* Loading Indicators - Responsive spacing */}
        <div className="flex justify-center space-x-2 mb-6 md:mb-8">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Progress Bar - Responsive width */}
        <div className="w-48 md:w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-3000 ease-out loading-progress"
          ></div>
        </div>

        {/* Loading Status - Responsive text */}
        <div className="text-center mt-4">
          <p className="text-sm md:text-base text-gray-600">
            Preparing your healthcare experience...
          </p>
        </div>

        {/* Medical Cross Decorations - Hidden on small screens */}
        <div className="hidden md:block absolute top-0 left-0 -translate-x-full -translate-y-full p-4">
          <svg className="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M11 17H13V13H17V11H13V7H11V11H7V13H11V17Z"/>
          </svg>
        </div>
        <div className="hidden md:block absolute bottom-0 right-0 translate-x-full translate-y-full p-4">
          <svg className="w-8 h-8 text-indigo-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M11 17H13V13H17V11H13V7H11V11H7V13H11V17Z"/>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes ecgAnimate {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: -100;
          }
        }
        
        .ecg-line {
          stroke-dasharray: 100;
          animation: ecgAnimate 3s linear infinite;
        }

        @keyframes loadProgress {
          0% { width: 0; }
          20% { width: 20%; }
          40% { width: 40%; }
          60% { width: 60%; }
          80% { width: 80%; }
          100% { width: 100%; }
        }

        .loading-progress {
          animation: loadProgress 3s ease-out forwards;
        }

        @media (max-width: 640px) {
          .loading-progress {
            animation-duration: 2.5s;
          }
          
          .ecg-line {
            animation-duration: 2.5s;
          }
        }
      `}</style>
    </div>
  );
};

export default Preloader; 
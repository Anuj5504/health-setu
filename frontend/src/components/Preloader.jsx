import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Add more medical SVG icons at the top
const medicalIcons = [
  // Medicine Bottle
  "M19 3h-4.18C14.25 1.44 12.53.64 11 1.2c-.88.3-1.54.96-1.84 1.8H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h2v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5h2c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z",
  // Pills
  "M4.22 11.29l7.07-7.07c.39-.39 1.02-.39 1.41 0l6.36 6.36c.39.39.39 1.02 0 1.41l-7.07 7.07c-.39.39-1.02.39-1.41 0l-6.36-6.36c-.39-.39-.39-1.02 0-1.41zm1.42 6.36l6.36 6.36c.39.39 1.02.39 1.41 0l7.07-7.07c.39-.39.39-1.02 0-1.41l-6.36-6.36c-.39-.39-1.02-.39-1.41 0l-7.07 7.07c-.39.39-.39 1.02 0 1.41z",
  // Medical Report
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z",
  // Stethoscope
  "M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm4-4h-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4z",
  // Syringe
  "M11.15 15.18l1.79-1.79c.32-.31.1-.85-.35-.85h-2.59v-2.59c0-.45-.54-.67-.85-.35l-1.79 1.79c-.2.2-.2.51 0 .71l2.83 2.83c.2.2.51.2.71 0zm.64-5.65l-1.41-1.41 4.24-4.24 1.41 1.41-4.24 4.24z",
  // Medical Bag
  "M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zm8 16H4V8h16v12z",
  // First Aid Kit
  "M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zm8 16H4V8h16v12zM13 14h-2v-3H8v-2h3V6h2v3h3v2h-3z",
  // Medical Cross
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z"
];

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 overflow-hidden">
      {/* Medical Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg
              className={`w-8 h-8 ${
                i % 3 === 0 
                  ? 'text-blue-500/30' 
                  : i % 3 === 1 
                    ? 'text-indigo-500/30' 
                    : 'text-purple-500/30'
              } filter drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={medicalIcons[i % medicalIcons.length]} />
            </svg>
          </motion.div>
        ))}

        {/* Add floating capsules */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`capsule-${i}`}
            className="absolute h-6 w-12 rounded-full overflow-hidden"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-red-200 to-red-300 opacity-20" />
            <div className="absolute inset-0 border-2 border-red-300/20 rounded-full" />
          </motion.div>
        ))}

        {/* Add floating tablets */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`tablet-${i}`}
            className="absolute h-4 w-4 rounded-lg"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-300 opacity-20 rounded-lg" />
            <div className="absolute inset-0 border-2 border-blue-300/20 rounded-lg" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Enhanced Background pulse circles with rainbow effect */}
        <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full animate-ping"></div>
        <div className="absolute w-36 h-36 md:w-48 md:h-48 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-indigo-500/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>

      <div className="relative max-w-sm w-full mx-auto">
        {/* Enhanced heartbeat animation with glow effect */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8 mx-auto">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-xl animate-pulse"></div>
          <svg 
            className="w-full h-full text-blue-600 animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          
          {/* Enhanced ECG Line with glow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-36 md:w-48">
            <svg className="w-full filter drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]" height="20" viewBox="0 0 100 20">
              <path
                className="ecg-line text-blue-500"
                d="M 0,10 L 10,10 L 15,0 L 20,20 L 25,10 L 30,10 L 35,10 L 40,10 L 45,0 L 50,20 L 55,10 L 60,10 L 65,10 L 70,10 L 75,0 L 80,20 L 85,10 L 90,10 L 95,10 L 100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Hospital Name with shimmer effect */}
        <div className="text-center mb-8 md:mb-12 relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            HealthCare
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Your Health, Our Priority
          </p>
        </div>

        {/* Enhanced Loading Indicators with rainbow colors */}
        <div className="flex justify-center space-x-2 mb-6 md:mb-8">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600 animate-bounce shadow-lg shadow-blue-500/50" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-indigo-600 animate-bounce shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-600 animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Enhanced Progress Bar with gradient and glow */}
        <div className="w-48 md:w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-3000 ease-out loading-progress shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          ></div>
        </div>

        {/* Enhanced Loading Status with fade effect */}
        <div className="text-center mt-4">
          <p className="text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse">
            Preparing your healthcare experience...
          </p>
        </div>

        {/* Enhanced Medical Cross Decorations with glow */}
        <div className="hidden md:block absolute top-0 left-0 -translate-x-full -translate-y-full p-4">
          <svg className="w-8 h-8 text-blue-200 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M11 17H13V13H17V11H13V7H11V11H7V13H11V17Z"/>
          </svg>
        </div>
        <div className="hidden md:block absolute bottom-0 right-0 translate-x-full translate-y-full p-4">
          <svg className="w-8 h-8 text-indigo-200 drop-shadow-[0_0_3px_rgba(99,102,241,0.5)]" viewBox="0 0 24 24" fill="currentColor">
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

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @media (max-width: 640px) {
          .loading-progress {
            animation-duration: 2.5s;
          }
          
          .ecg-line {
            animation-duration: 2.5s;
          }
        }

        @keyframes moleculeFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
        }

        .molecule {
          animation: moleculeFloat 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader; 
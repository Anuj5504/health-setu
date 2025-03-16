import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-blue-500">
            4
            <motion.span
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block text-red-500"
            >
              0
            </motion.span>
            4
          </h1>
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Animated Medical Cross */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-16 h-16 mx-auto mb-8"
        >
          <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M11 17H13V13H17V11H13V7H11V11H7V13H11V17Z"/>
          </svg>
        </motion.div>

        {/* Animated Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return Home
            </motion.span>
          </Link>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound; 
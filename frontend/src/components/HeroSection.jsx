import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Hr1 from '../assets/hr1.jpg';
import Hr2 from '../assets/hr2.jpg';
import Hr3 from '../assets/hr3.jpg';
import Hr4 from '../assets/hr4.jpg';

const InteractiveButton = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      {/* Main button */}
      <div className="relative px-8 py-4 bg-blue-500 rounded-xl overflow-hidden">
        {/* Background gradient that moves */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={{
            hover: {
              x: ['-100%', '100%'],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }
            }
          }}
        />

        {/* Button content container */}
        <div className="relative flex items-center justify-center min-w-[200px]">
          {/* Default Text */}
          <motion.span
            className="text-white font-medium flex items-center gap-2"
            variants={{
              hover: {
                opacity: 0,
                y: -20,
                transition: { duration: 0.2 }
              }
            }}
          >
            {children}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
            </svg>
          </motion.span>

          {/* Hover Content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            variants={{
              hover: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.2 }
              }
            }}
          >
            {/* AI Voice Assistant Animation */}
            <div className="relative flex items-center gap-3">
              {/* Animated Mic Icon */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-2 rounded-full bg-white/20"
                  variants={{
                    hover: {
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }
                  }}
                />
                <motion.svg 
                  className="w-5 h-5 text-white relative"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  variants={{
                    hover: {
                      scale: [1, 1.1, 1],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }
                  }}
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </motion.svg>
              </div>

              {/* Voice Wave Animation */}
              <div className="flex items-center gap-[2px] ml-2 h-5">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] h-3 bg-white rounded-full"
                    variants={{
                      hover: {
                        height: [12, 24, 12],
                        transition: {
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }
                      }
                    }}
                  />
                ))}
              </div>

              {/* AI Text */}
              <motion.span
                className="text-white text-sm font-medium"
                variants={{
                  hover: {
                    x: [0, 2, 0],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }
                }}
              >
                AI Voice Appointments
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Glowing border effect */}
      <motion.div
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 
                   opacity-50 blur-md z-[-1]"
        variants={{
          hover: {
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.05, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
      />

      {/* Particle effects */}
      <motion.div
        className="absolute inset-0"
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.2 }
          }
        }}
        initial={{ opacity: 0 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-200 rounded-full"
            style={{
              left: `${50 + (Math.random() * 20 - 10)}%`,
              top: `${50 + (Math.random() * 20 - 10)}%`,
            }}
            variants={{
              hover: {
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, (Math.random() * 40 - 20)],
                y: [0, (Math.random() * 40 - 20)],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }
              }
            }}
          />
        ))}
      </motion.div>
    </motion.button>
  );
};

function HeroSection() {
  const navigate = useNavigate();

  const handleAppointmentClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    } else {
      navigate('/talk');
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-b from-blue-50/50 to-white font-poppins overflow-hidden">
      {/* Background Pattern with hover effect */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.3 }}
      />
      
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left relative z-10"
          >
            {/* Emergency Badge without delay */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-8 text-sm font-medium cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              24/7 Healthcare Assistance Available
            </motion.div>

            {/* Heading without delay */}
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <span>Better Care,</span>{" "}
              <br/>
              <span className="text-blue-600">
                Smarter Management
              </span>
            </motion.h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-8 font-inter max-w-xl">
              Optimizing hospital operations for seamless patient care. Schedule appointments, manage inventory, and ensure timely treatment with our integrated healthcare system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <InteractiveButton onClick={handleAppointmentClick}>
                Book Appointment
              </InteractiveButton>

              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-500 border-2 border-blue-500 
                           rounded-xl hover:bg-blue-50 transition-all font-semibold 
                           flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </motion.button>
              </Link>
            </div>

            {/* Trust Indicators with hover effects */}
            <div className="flex items-center gap-6 text-sm text-gray-500 justify-center lg:justify-start">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ 
                  scale: 1.05,
                  color: "#3B82F6",
                  transition: { duration: 0.2 }
                }}
              >
                <motion.svg 
                  className="w-5 h-5 text-blue-500"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  
                </motion.svg>
                <span>AI-Powered Smart Queuing for Appointments</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ 
                  scale: 1.05,
                  color: "#3B82F6",
                  transition: { duration: 0.2 }
                }}
              >
                <motion.svg 
                  className="w-5 h-5 text-blue-500"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
                <span>Real-Time Fitbit Health Data Sync</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Image Grid without delays */}
          <motion.div 
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:grid grid-cols-2 gap-4 relative"
          >
            {/* Decorative Background */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20" />
            
            <div className="space-y-4">
              {/* First image */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl shadow-lg h-48 relative"
              >
                <img 
                  src={Hr1}
                  alt="Medical facility" 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
              
              {/* Second image */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl shadow-lg h-64 relative"
              >
                <img 
                  src={Hr2} 
                  alt="Animal rescue team in action" 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
            <div className="space-y-4 mt-8">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl shadow-lg h-64 relative"
              >
                <img 
                  src={Hr3} 
                  alt="Volunteers feeding street animals" 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl shadow-lg h-48 relative"
              >
                <img 
                  src={Hr4} 
                  alt="Successfully rescued and happy animal" 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
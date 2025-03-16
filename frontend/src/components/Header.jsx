import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

// Add animation variants
const logoVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      yoyo: Infinity
    }
  }
};

const letterVariants = {
  hover: i => ({
    y: [-2, 2],
    scale: 1.1,
    color: "#3B82F6",
    transition: {
      y: {
        delay: i * 0.05,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.3
      },
      scale: {
        duration: 0.2
      },
      color: {
        duration: 0.2
      }
    }
  })
};

const navLinkVariants = {
  hover: {
    color: "#3B82F6",
    y: -2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Add these new animation variants at the top
const navContainerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      mass: 1,
      staggerChildren: 0.1
    }
  }
};

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const glowVariants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add underline animation variants
const underlineVariants = {
  initial: { 
    scaleX: 0,
    originX: 0
  },
  hover: { 
    scaleX: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');
  let userName = "";
  if(token){
  const decodedToken = jwtDecode(token);
   userName = decodedToken.user.name;
  }

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case "patient":
        return "/medicine";
      case "doctor":
        return "/docdashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header 
      className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.nav className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Add subtle background glow effect */}
        <motion.div
          className="absolute inset-0 bg-blue-100/20 rounded-full filter blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />

        <div className="flex items-center justify-between h-16 relative">
          {/* Enhanced Logo Animation */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="flex items-center gap-2 group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300
                }}
                className="bg-blue-500 rounded-lg p-2 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-lg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="text-xl font-bold text-white font-serif relative">
                  HS
                </span>
              </motion.div>

              {/* Enhanced Letter Animations */}
              <div className="flex items-center overflow-hidden">
                <div className="flex">
                  {"Health".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      custom={i}
                      whileHover="hover"
                      className="text-xl font-bold text-gray-900 relative cursor-pointer"
                    >
                      {letter}
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.span>
                  ))}
                </div>
                <div className="flex">
                  {"Setu".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      custom={i}
                      whileHover="hover"
                      className="text-xl font-bold text-blue-500 relative cursor-pointer"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Enhanced Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <motion.div
                  className="relative group"
                  whileHover="hover"
                  initial="initial"
                >
                  <Link
                    to={link.path}
                    className="relative text-gray-600 font-medium transition-colors duration-200 py-2"
                  >
                    <motion.span
                      variants={navLinkVariants}
                      className="relative z-10 block"
                    >
                      {link.name}
                    </motion.span>

                    {/* Fancy Underline */}
                    <motion.div
                      variants={underlineVariants}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                      style={{ originX: 0 }}
                    />

                    {/* Hover Background Glow */}
                    <motion.div
                      className="absolute -inset-2 rounded-lg bg-blue-50/50 z-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ 
                        opacity: 1,
                        transition: { duration: 0.2 }
                      }}
                    />

                    {/* Subtle Dot Indicator */}
                    <motion.div
                      className="absolute -left-4 top-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ 
                        scale: 1,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }
                      }}
                    />
                  </Link>

                  {/* Hover Particles */}
                  <motion.div
                    className="absolute -inset-2 pointer-events-none"
                    initial="initial"
                    whileHover="hover"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-blue-400/30"
                        initial={{ 
                          opacity: 0,
                          y: 0,
                          x: 0
                        }}
                        variants={{
                          hover: {
                            opacity: [0, 1, 0],
                            y: [-20, 20],
                            x: [-10 + i * 10, 10 - i * 10],
                            transition: {
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }
                          }
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced User Menu */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            variants={navItemVariants}
          >
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors relative"
                >
                  <motion.div
                    animate={{ 
                      rotate: showDropdown ? 180 : 0,
                      scale: showDropdown ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiUser className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{ 
                      y: showDropdown ? -2 : 0,
                      color: showDropdown ? "#3B82F6" : "#374151"
                    }}
                  >
                    Hi, {userName}
                  </motion.span>
                </motion.button>

                {/* Enhanced Dropdown Animation */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ 
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.2,
                          staggerChildren: 0.1
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                        transition: { duration: 0.2 }
                      }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                    >
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                          onClick={() => setShowDropdown(false)}
                        >
                          <MdDashboard className="w-5 h-5 mr-2" />
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                        >
                          <FiLogOut className="w-5 h-5 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Enhanced Login/Register Buttons */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <motion.button
                      whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                      }}
                      className="px-4 py-2 text-blue-500 font-medium hover:text-blue-600 transition-colors relative overflow-hidden group"
                    >
                      <motion.span
                        className="absolute inset-0 bg-blue-100 rounded-lg"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">Login</span>
                    </motion.button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register">
                    <motion.button
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Register
                    </motion.button>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Animated Mobile Menu Button */}
          <motion.div 
            className="md:hidden"
            whileTap={{ scale: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  exit={{ rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <HiX className="h-6 w-6" />
                  ) : (
                    <HiMenu className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <motion.div 
              className="px-4 pt-2 pb-3 space-y-1"
              variants={{
                open: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              initial="closed"
              animate="open"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
                  <Link to="/login">
                    <button className="w-full px-4 py-2 text-blue-500 font-medium border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import LoginImage from "../assets/login_image.jpeg";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient" // Default role
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "";
      // Choose endpoint based on role
      switch(formData.role) {
        case "patient":
          endpoint = "/api/auth/login";
          break;
        case "doctor":
          endpoint = "/api/auth/caregiver/login";
          break;
        case "admin":
          endpoint = "/api/auth/healthpro/login";
          break;
        default:
          endpoint = "/api/auth/login";
      }

      const response = await axios.post(`${API_URL}${endpoint}`, {
        email: formData.email,
        password: formData.password
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      
      // Use the login function from context
      const userData = {
        ...response.data[formData.role === "patient" ? "Patient" : formData.role === "doctor" ? "doctor" : "admin"],
        role: formData.role
      };
      
      login(userData);
      toast.success(`Welcome back!`);
      
      // Redirect based on role
      if (formData.role === "patient") {
        navigate("/medicine");
      } else if (formData.role === "doctor") {
        navigate("/docdashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b mt-12 from-gray-50 to-gray-100">
        <div className="w-full max-w-4xl flex shadow-2xl rounded-2xl bg-white m-8 ">
          
          {/* Left side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-blue-50 rounded-l-xl">
            <img 
              src={LoginImage}
              alt="Login" 
              className="w-full max-w-sm"
            />
          </div>

          {/* Right side - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600 mt-2">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 my-6">
                {["patient", "doctor", "admin"].map((role) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      formData.role === role
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
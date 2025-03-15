import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import RegisterImage from "../assets/register_image.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileno: "",
    address: "",
    city: "",
    role: "patient" // Default role as patient
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
      let endpoint;
      switch(formData.role) {
        case "patient":
          endpoint = "/api/auth/register";
          break;
        case "doctor":
          endpoint = "/api/auth/caregiver/register";
          break;
        case "admin":
          endpoint = "/api/auth/healthpro/register";
          break;
        default:
          endpoint = "/api/auth/register";
      }
      
      const response = await axios.post(`${API_URL}${endpoint}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobileno: formData.mobileno,
        address: formData.address,
        city: formData.city
      });

      let successMessage;
      switch(formData.role) {
        case "patient":
          successMessage = "Patient registration successful!";
          break;
        case "doctor":
          successMessage = "Doctor registration successful!";
          break;
        case "admin":
          successMessage = "Admin registration successful!";
          break;
        default:
          successMessage = "Registration successful!";
      }

      toast.success(successMessage);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = error.response?.data?.msg || "Registration failed";
      
      // Role-specific error messages
      if (error.response?.status === 400) {
        switch(formData.role) {
          case "patient":
            errorMessage = error.response.data.msg || "Patient registration failed";
            break;
          case "doctor":
            errorMessage = error.response.data.msg || "Doctor registration failed";
            break;
          case "admin":
            errorMessage = error.response.data.msg || "Admin registration failed";
            break;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get role-specific button text
  const getSubmitButtonText = () => {
    if (loading) return 'Creating Account...';
    
    switch(formData.role) {
      case "patient":
        return "Register as Patient";
      case "doctor":
        return "Register as Doctor";
      case "admin":
        return "Register as Admin";
      default:
        return "Create Account";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-5">
        <div className="p-8 md:col-span-3">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join our healthcare platform</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Mobile Number Input */}
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="mobileno"
                  placeholder="Mobile Number"
                  value={formData.mobileno}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* City Input */}
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Address Input */}
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="pl-10 w-full h-12 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Role Selection - Keeping UI but defaulting to patient */}
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
              className={`w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {getSubmitButtonText()}
            </motion.button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-blue-50 p-8 md:col-span-2">
          <img src={RegisterImage} alt="Register" className="w-40" />
          <h3 className="text-xl font-bold mt-6">Welcome to HealthSetu</h3>
          <p className="text-gray-600 mt-2 text-center">Join us to manage your healthcare journey effectively</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
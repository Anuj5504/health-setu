import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    city: "",
    phoneNumber: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prevState) => ({ ...prevState, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Registering...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      toast.dismiss();
      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Registration error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-5">
        <div className="p-8 md:col-span-3">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join our community and make a difference</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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

                      {/* Phone Number Input */}
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
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

                    <div className="flex gap-4 my-6">
                      {["user", "volunteer", "ngo"].map((role) => (
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
            <motion.button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold">Create Account</motion.button>
          </form>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center bg-blue-50 p-8 md:col-span-2">
          <img src="/mnt/data/image.png" alt="Side Illustration" className="w-40" />
          <h3 className="text-xl font-bold mt-6">Why Join Us?</h3>
          <p className="text-gray-600 mt-2">• Make a positive impact in your community</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
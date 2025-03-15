import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";

const LoginForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Login button clicked!");

    navigate("/dashboard"); 
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-4xl p-8 flex shadow-2xl rounded-2xl bg-white m-8">
          
          {/* Left side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-blue-50 rounded-l-xl">
            <img 
              src="/helpinghand.png" 
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

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md"
              >
                Sign In
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
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BiSolidReport } from "react-icons/bi";
import { FaHandsHelping } from "react-icons/fa";

function GetInvolved() {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        animate={{
          backgroundPosition: ["0px 0px", "100px 100px"],
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Make a Difference Today
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Every action matters. Whether you're booking an appointment or syncing your health data, 
            you're contributing to a smarter and healthier future.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Report Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="relative bg-white rounded-2xl p-8 shadow-lg"
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                <BiSolidReport className="w-8 h-8 text-blue-600" />
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold mb-4"
                whileHover={{ scale: 1.05, color: "#2563EB" }}
              >
                Book an Appointment
              </motion.h3>
              <p className="text-gray-600 mb-6">
                Need medical assistance? Schedule an AI-powered appointment with a doctor 
                and get the care you deserve.
              </p>
              <Link to="/talk">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold 
                           hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-200/50
                           flex items-center justify-center gap-2 group"
                >
                  Book Now
                  <motion.span 
                    className="text-xl transition-transform"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Volunteer Card with similar animations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="relative bg-white rounded-2xl p-8 shadow-lg"
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(75, 85, 99, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                <FaHandsHelping className="w-8 h-8 text-gray-800" />
              </motion.div>
              <motion.h3 
                className="text-2xl font-bold mb-4"
                whileHover={{ scale: 1.05, color: "#1F2937" }}
              >
                Sync Your Health Data
              </motion.h3>
              <p className="text-gray-600 mb-6">
                Track your health effortlessly. Connect your Fitbit and monitor steps, 
                calories, and vitals in real-time.
              </p>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold 
                           hover:bg-gray-900 transition-colors shadow-lg hover:shadow-gray-200/50
                           flex items-center justify-center gap-2 group"
                >
                  Sync Now
                  <motion.span 
                    className="text-xl transition-transform"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default GetInvolved;

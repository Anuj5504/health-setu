import { motion } from 'framer-motion';
import { BiSolidReport } from "react-icons/bi";
import { FaHandsHelping, FaHospital } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Features() {
  const features = [
    {
      icon: <BiSolidReport className="w-6 h-6" />,
      title: "Smart Appointments",
      description: "AI-powered scheduling system ensures quick and efficient doctor-patient appointments with real-time updates.",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600",
      link: "/about"
    },
    {
      icon: <FaHandsHelping className="w-6 h-6" />,
      title: "Connected Health Monitoring",
      description: "Sync Fitbit and other health devices to track steps, calories, and vital health metrics effortlessly.",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600",
      link: "/about"
    },
    {
      icon: <FaHospital className="w-6 h-6" />,
      title: "Optimized Hospital Management",
      description: "Automated inventory tracking and medicine reminders to enhance operational efficiency.",
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-600",
      link: "/about"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white/90 backdrop-blur-sm">
      {/* Background Pattern - Darker dots with lower z-index */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.2] z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-blue-600 font-semibold mb-4 block">
            Our Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How We Enhance Healthcare Efficiency
          </h2>
          <p className="text-gray-600 text-lg">
            From instant reporting to professional care, we ensure every patient gets the help they need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="relative group"
            >
              <Link to={feature.link}>
                <motion.div 
                  className="relative h-full bg-white backdrop-blur-sm rounded-2xl p-8 
                           overflow-hidden transition-all duration-500 group-hover:scale-[1.02]
                           before:absolute before:inset-0 before:bg-gradient-to-r 
                           before:from-transparent before:via-blue-600/20 before:to-transparent
                           before:translate-x-[-200%] before:transition-transform before:duration-[1.5s]
                           before:group-hover:translate-x-[200%] 
                           after:absolute after:inset-0 after:bg-gradient-to-b
                           after:from-transparent after:via-blue-600/20 after:to-transparent
                           after:translate-y-[-200%] after:transition-transform after:duration-[1.5s]
                           after:group-hover:translate-y-[200%]
                           border-2 border-blue-200 hover:border-blue-400
                           shadow-[0_0_0_1px_rgba(59,130,246,0.1)]
                           group-hover:shadow-[0_0_60px_-12px_rgba(29,78,216,0.4)]"
                  whileHover={{
                    boxShadow: "0 0 60px -12px rgba(29,78,216,0.4)",
                  }}
                >
                  {/* Holographic Glow Effect - Enhanced */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0" />
                  
                  {/* Icon with Enhanced Glow */}
                  <div className={`relative z-10 ${feature.iconColor} bg-white 
                                shadow-[0_0_20px_rgba(29,78,216,0.3)] 
                                p-4 rounded-xl inline-flex mb-6 
                                group-hover:shadow-[0_0_30px_rgba(29,78,216,0.5)]
                                transition-all duration-500
                                border-2 border-blue-100 group-hover:border-blue-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content with enhanced hover effects */}
                  <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3 
                               group-hover:text-blue-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="relative z-10 text-gray-600 mb-6 line-clamp-2 
                               group-hover:text-gray-900 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Learn More Link with enhanced glow */}
                  <div className="relative z-10 flex items-center text-sm font-medium text-blue-700 
                                group-hover:text-blue-800 transition-all duration-300">
                    Learn more
                    <svg 
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Section with enhanced effects */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-8 bg-white backdrop-blur-sm rounded-2xl p-8 
                     border-2 border-blue-200 relative overflow-hidden
                     before:absolute before:inset-0 before:bg-gradient-to-r 
                     before:from-transparent before:via-blue-600/20 before:to-transparent
                     before:translate-x-[-200%] hover:before:translate-x-[200%]
                     before:transition-transform before:duration-[2s]
                     hover:border-blue-400 hover:shadow-[0_0_60px_-12px_rgba(29,78,216,0.3)]
                     transition-all duration-500"
        >
          {[
            { number: "1000+", label: "Patients Benefited" },
            { number: "24/7", label: "AI-Powered Healthcare Support" },
            { number: "50+", label: "Trusted Healthcare Partners" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
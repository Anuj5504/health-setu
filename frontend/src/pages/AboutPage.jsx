import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaUsers, FaHospital, FaHeartbeat } from 'react-icons/fa';

const HologramCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative group"
  >
    {/* Subtle glow effect on hover */}
    <div className="absolute -inset-0.5 bg-white rounded-xl 
                    opacity-0 group-hover:opacity-70 blur-xl transition-all duration-300
                    group-hover:scale-105" />
    
    {/* Scan lines - visible only on hover */}
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-30"
      initial={false}
      whileHover={{
        background: [
          "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%) 0 0",
          "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%) 0 -100%"
        ],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    >
      {/* Horizontal scan lines */}
      <div className="absolute inset-0" 
           style={{
             backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)",
             backgroundSize: "100% 4px",
             opacity: 0,
             transition: "opacity 0.3s"
           }} 
      />
    </motion.div>

    {/* Content container with glass effect */}
    <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-xl 
                    shadow-lg transition-all duration-300 border border-transparent
                    group-hover:border-gray-100 group-hover:bg-white
                    group-hover:shadow-xl">
      {/* Content with subtle hover animation */}
      <motion.div
        initial={false}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {children}
      </motion.div>
    </div>

    {/* Corner accents - appear on hover */}
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 border-gray-400 opacity-0 group-hover:opacity-30"
        style={{
          borderStyle: "solid",
          borderWidth: i < 2 ? "2px 0 0 2px" : "0 2px 2px 0",
          top: i < 2 ? "-1px" : "auto",
          bottom: i >= 2 ? "-1px" : "auto",
          left: i % 2 === 0 ? "-1px" : "auto",
          right: i % 2 === 1 ? "-1px" : "auto",
        }}
        initial={false}
        whileHover={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          transition: {
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }
        }}
      />
    ))}
  </motion.div>
);

const FloatingIcon = ({ icon: Icon, delay = 0 }) => (
  <motion.div
    className="text-gray-700 relative"
    initial={{ y: 0 }}
    animate={{ y: [-5, 5, -5] }}
    transition={{
      repeat: Infinity,
      duration: 3,
      delay,
      ease: "easeInOut"
    }}
  >
    {Icon}
    
    {/* Subtle glow effect */}
    <div className="absolute inset-0 bg-gray-400/10 blur-xl scale-150" />
  </motion.div>
);

function AboutPage() {
  const values = [
    {
      icon: <FaHandHoldingHeart className="w-8 h-8" />,
      title: "Compassion",
      description: "Ensuring every patient receives the best care through seamless communication and medical support."
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Community",
      description: "Connecting healthcare professionals, patients, and organizations to foster a healthier society."
    },
    {
      icon: <FaHeartbeat className="w-8 h-8" />,
      title: "Care",
      description: "Providing AI-powered appointment scheduling and real-time health monitoring for better patient outcomes."
    },
    {
      icon: <FaHospital className="w-8 h-8" />,
      title: "Support",
      description: "24/7 access to medical assistance, appointment management, and health tracking for optimal well-being."
    }
  ];

  return (
    <div className="min-h-screen pt-12 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center relative"
          >
            <div className="relative inline-block mb-6">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-blue-600"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 10px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Our Mission to Revolutionize Healthcare
              </motion.h1>
            </div>

            <motion.p 
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Since 2025, HealthSetu has been committed to enhancing healthcare accessibility 
              and efficiency through cutting-edge technology. Our integrated system empowers 
              patients, doctors, and administrators to streamline medical operations and improve patient care.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl font-bold text-blue-600 mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-blue-500 mx-auto rounded-full"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <HologramCard key={value.title}>
                <FloatingIcon icon={value.icon} delay={index * 0.2} />
                <h3 className="text-xl font-bold text-blue-600 mb-2 mt-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </HologramCard>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <motion.h2 
              className="text-3xl font-bold text-blue-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Impact
            </motion.h2>
            <p className="text-gray-600">
              Through innovation and dedication, we've transformed healthcare management and improved countless lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { number: "1000+", label: "Appointments Scheduled" },
              { number: "500+", label: "Verified Doctors" },
              { number: "50+", label: "Patients Benefited" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl opacity-0 
                              group-hover:opacity-100 transition-all duration-300 
                              blur-xl transform group-hover:scale-110" />
                <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg 
                              border border-blue-100 hover:border-blue-300 transition-all duration-300
                              hover:bg-blue-50/50">
                  <motion.div
                    className="text-4xl font-bold text-blue-600 mb-2"
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(59, 130, 246, 0.5)",
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 10px rgba(59, 130, 246, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage; 
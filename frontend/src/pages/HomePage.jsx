import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import Features from "../components/Features"
import Footer from "../components/Footer"
import GetInvolved from "../components/GetInvolved"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import Testimonials from "../components/Testimonials"
import { useNavigate } from "react-router-dom"

// Move particles outside for better performance
const medicalEmojis = ["💊", "💉", "🏥", "🩺", "🧬", "⚕️", "🩹", "💗"];

const ParticlesBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Fast Moving Medical Icons */}
      {[...Array(20)].map((_, i) => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl md:text-3xl filter drop-shadow-md"
            initial={{
              x: randomX,
              y: randomY,
              rotate: Math.random() * 360,
              opacity: 0.4,
            }}
            animate={{
              x: [
                randomX,
                randomX + (Math.random() - 0.5) * 800,
                randomX + (Math.random() - 0.5) * 800,
                randomX,
              ],
              y: [
                randomY,
                randomY + (Math.random() - 0.5) * 800,
                randomY + (Math.random() - 0.5) * 800,
                randomY,
              ],
              rotate: [0, 180, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: Math.random() * 15 + 15, // Faster duration: 15-30 seconds
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.33, 0.66, 1]
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2, // Faster scaling
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-blue-500/80"
            >
              {medicalEmojis[i % medicalEmojis.length]}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Fast Background Large Icons */}
      {[...Array(8)].map((_, i) => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        return (
          <motion.div
            key={`bg-${i}`}
            className="absolute text-5xl md:text-6xl opacity-[0.03] filter blur-sm"
            initial={{
              x: randomX,
              y: randomY,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: [
                randomX,
                randomX + (Math.random() - 0.5) * 600,
                randomX + (Math.random() - 0.5) * 600,
                randomX,
              ],
              y: [
                randomY,
                randomY + (Math.random() - 0.5) * 600,
                randomY + (Math.random() - 0.5) * 600,
                randomY,
              ],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: Math.random() * 20 + 25, // Faster background: 25-45 seconds
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.33, 0.66, 1]
            }}
          >
            {medicalEmojis[i % medicalEmojis.length]}
          </motion.div>
        );
      })}

      {/* Faster Moving Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-transparent to-indigo-50/5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15, // Faster gradient movement
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = useMemo(() => (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    } else {
      navigate('/talk');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30">
      {/* Background Particles */}
      <ParticlesBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Announcement Banner */}
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 text-center text-sm font-medium"
        >
          <p className="flex items-center justify-center gap-2">
            🎉 AI-Powered Healthcare: Experience the Future of Medical Care
          </p>
        </motion.div>

        {/* Hero Section with increased height */}
        <section className="min-h-[90vh] relative">
          <HeroSection />
        </section>

        {/* Features Section with offset background */}
        <section className="relative z-20 -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm py-24 rounded-t-[3rem] shadow-lg"
          >
            <Features />
          </motion.div>
        </section>

        {/* Testimonials Section with gradient background */}
        <section className="relative z-10 -mt-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <Testimonials />
          </motion.div>
        </section>

        {/* Get Involved Section with curved edges */}
        <section className="relative z-20 -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-blue-50/80 to-white rounded-t-[3rem] py-24"
          >
            <GetInvolved />
          </motion.div>
        </section>

        {/* Footer with enhanced styling */}
        <Footer className="relative z-10 bg-gradient-to-b from-gray-50 to-gray-100" />
      </div>

      {/* Floating Action Button */}
      <motion.button 
        onClick={handleAppointmentClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-500 text-white 
                   px-6 py-3 rounded-full shadow-lg hover:shadow-blue-500/25 
                   transition-all flex items-center gap-2"
      >
        <span className="animate-pulse">📅</span> Book Appointment
      </motion.button>
    </div>
  );
};

export default HomePage;
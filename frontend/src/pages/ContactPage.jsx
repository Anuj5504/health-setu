import { motion } from 'framer-motion';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const HologramEffect = ({ children }) => (
  <motion.div
    className="relative group"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    {/* Hologram glow */}
    <div className="absolute -inset-1 bg-blue-500/20 rounded-xl opacity-0 
                    group-hover:opacity-100 blur-xl transition-all duration-300" />
    
    {/* Scan line effect */}
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100"
      initial={false}
      animate={{
        background: [
          "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%) 0 0",
          "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%) 0 -100%"
        ],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    />

    {/* Content */}
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg 
                    transition-all duration-300 border border-blue-100
                    group-hover:border-blue-300 group-hover:bg-white/90
                    group-hover:shadow-blue-500/20">
      {children}
    </div>

    {/* Corner accents */}
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 border-blue-500 opacity-0 group-hover:opacity-100"
        style={{
          borderStyle: "solid",
          borderWidth: i < 2 ? "2px 0 0 2px" : "0 2px 2px 0",
          top: i < 2 ? "-1px" : "auto",
          bottom: i >= 2 ? "-1px" : "auto",
          left: i % 2 === 0 ? "-1px" : "auto",
          right: i % 2 === 1 ? "-1px" : "auto",
        }}
      />
    ))}
  </motion.div>
);

function ContactPage() {
  const contactInfo = [
    {
      icon: <MdPhone className="w-6 h-6" />,
      title: "Phone",
      details: "+91 8275614232",
      link: "tel:+918275614232"
    },
    {
      icon: <MdEmail className="w-6 h-6" />,
      title: "Email",
      details: "helthsetu25@gmail.com",
      link: "mailto:helthsetu25@gmail.com"
    },
    {
      icon: <MdLocationOn className="w-6 h-6" />,
      title: "Location",
      details: "Pune, Maharashtra, India",
      link: "#"
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-6 h-6" />, name: "Facebook", link: "#" },
    { icon: <FaTwitter className="w-6 h-6" />, name: "Twitter", link: "#" },
    { icon: <FaInstagram className="w-6 h-6" />, name: "Instagram", link: "#" },
    { icon: <FaWhatsapp className="w-6 h-6" />, name: "WhatsApp", link: "#" }
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
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-blue-600 mb-6"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 10px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Get in Touch
            </motion.h1>
            <p className="text-lg text-gray-600">
              Have questions or need medical assistance? We're here to help 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <HologramEffect>
                  <a href={info.link} className="block p-6">
                    <motion.div 
                      className="text-blue-500 mb-4 flex justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {info.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                      {info.details}
                    </p>
                  </a>
                </HologramEffect>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <HologramEffect>
              <motion.form 
                className="p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500
                               bg-white/50 backdrop-blur-sm transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500
                               bg-white/50 backdrop-blur-sm transition-all duration-300"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500
                             bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Message subject"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500
                             bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium 
                           hover:bg-blue-600 transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                </motion.button>
              </motion.form>
            </HologramEffect>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl font-bold text-blue-600 mb-2"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
            >
              Follow Us
            </motion.h2>
            <p className="text-gray-600">Stay connected on social media</p>
          </div>
          <div className="flex justify-center space-x-8">
            {[
              { icon: <FaFacebook />, color: "hover:text-[#1877F2]" },
              { icon: <FaTwitter />, color: "hover:text-[#1DA1F2]" },
              { icon: <FaInstagram />, color: "hover:text-[#E4405F]" },
              { icon: <FaWhatsapp />, color: "hover:text-[#25D366]" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href="#"
                className={`text-gray-600 ${social.color} transition-all duration-300`}
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <div className="w-8 h-8">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage; 
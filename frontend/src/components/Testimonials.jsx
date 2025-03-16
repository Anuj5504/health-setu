import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    username: "@dr_sarah",
    role: "Cardiologist",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "The AI-powered diagnosis assistance has improved my accuracy by 40%. Truly revolutionary for patient care.",
  },
  {
    name: "James Wilson",
    username: "@james_w",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    text: "Got an emergency appointment within minutes. The smart queuing system is a lifesaver!",
  },
  {
    name: "Dr. Michael Chen",
    username: "@dr_chen",
    role: "Neurologist",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    text: "Real-time health data integration helps me make informed decisions quickly. Outstanding system!",
  },
  {
    name: "Emma Rodriguez",
    username: "@emma_health",
    role: "Healthcare Admin",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    text: "Managing hospital resources has never been easier. Efficiency increased by 60%!",
  },
  {
    name: "Dr. Lisa Park",
    username: "@dr_lisa",
    role: "Pediatrician",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    text: "The child-friendly interface makes consultations fun. Parents love the easy scheduling!",
  }
];

const TestimonialCard = ({ testimonial }) => (
  <motion.figure
    className="relative w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 mb-6
               bg-white/80 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm
               border-blue-100 transform-gpu"
    whileHover={{ 
      scale: 1.02, 
      translateZ: 20,
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
    }}
  >
    <FaQuoteLeft className="text-blue-500/20 text-4xl mb-4" />
    <blockquote className="mb-6 text-sm text-gray-600 leading-relaxed">
      {testimonial.text}
    </blockquote>
    <div className="flex items-center gap-3 mt-auto">
      <div className="relative">
        <img 
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
          alt={testimonial.name} 
          src={testimonial.image}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold text-gray-900">
          {testimonial.name}
        </figcaption>
        <p className="text-xs text-blue-600">{testimonial.role}</p>
        <p className="text-xs text-gray-500">{testimonial.username}</p>
      </div>
    </div>
  </motion.figure>
);

const InfiniteMarquee = ({ items, direction = "up", speed = 25, offset = 0 }) => {
  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: "650px" }}>
      <motion.div
        animate={{
          y: direction === "up" ? [0, -1035] : [-1035, 0]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          delay: offset,
        }}
        className="flex flex-col gap-6"
      >
        {/* Double the items to ensure smooth loop */}
        {[...items, ...items].map((item, idx) => (
          <TestimonialCard key={`${item.name}-${idx}`} testimonial={item} />
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  // Create different groups for variety
  const group1 = testimonials.slice(0, 3);
  const group2 = testimonials.slice(2, 5);
  const group3 = testimonials.slice(1, 4);
  const group4 = [...testimonials].reverse().slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of healthcare providers and patients who are transforming 
            healthcare delivery with our intelligent platform.
          </p>
        </motion.div>

        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/90 via-blue-50/50 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-10" />
          
          {/* Testimonial Columns */}
          <div className="relative flex gap-6 justify-center mx-auto" 
               style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
            <motion.div 
              className="flex gap-6"
              style={{
                transform: "rotateX(10deg) rotateY(-5deg) rotateZ(5deg) translateZ(-50px)",
                transformStyle: "preserve-3d"
              }}
            >
              <InfiniteMarquee items={group1} direction="up" speed={35} />
              <InfiniteMarquee items={group2} direction="down" speed={40} offset={0.5} />
              <InfiniteMarquee items={group3} direction="up" speed={30} offset={0.2} />
              <InfiniteMarquee items={group4} direction="down" speed={45} offset={0.7} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
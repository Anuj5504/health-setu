import { motion } from 'framer-motion';

const Preloader = ({ setLoading }) => {
  // Particle animation config
  const particles = [...Array(12)].map((_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 20 + 10
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      onAnimationComplete={() => setLoading(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [particle.x, particle.x + 100, particle.x],
              y: [particle.y, particle.y - 100, particle.y],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute w-${particle.size} h-${particle.size} rounded-full bg-white/10 blur-xl`}
          />
        ))}

        {/* Animated Gradient Overlay */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
              'linear-gradient(225deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
              'linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative text-center z-10">
        {/* Main Content Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/10"
        >
          {/* Logo Container */}
          <motion.div className="relative mb-8">
            {/* Multiple Rotating Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 8 - i * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className={`absolute inset-${i * 2} rounded-full border-2 border-t-blue-400/30 border-r-purple-400/30 border-b-blue-400/30 border-l-purple-400/30`}
              />
            ))}
            
            {/* Hospital Icon with Enhanced Animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotateY: [0, 360],
                filter: [
                  'drop-shadow(0 0 0px rgba(59,130,246,0.5))',
                  'drop-shadow(0 0 20px rgba(59,130,246,0.5))',
                  'drop-shadow(0 0 0px rgba(59,130,246,0.5))'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-6 relative z-10"
            >
              🏥
            </motion.div>

            {/* Brand Name with Gradient */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-wider"
            >
              HealthCare
            </motion.h2>
          </motion.div>

          {/* Enhanced Progress Bar */}
          <div className="relative w-80 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>

          {/* Loading Message with Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            <motion.p
              animate={{ 
                color: ['rgb(147,197,253)', 'rgb(216,180,254)', 'rgb(147,197,253)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-medium tracking-wide text-lg"
            >
              Preparing Your Healthcare Experience
            </motion.p>

            {/* Enhanced Loading Dots */}
            <div className="flex justify-center gap-3">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-4, 4, -4],
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader; 
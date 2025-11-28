import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlipIQCelebration = ({ isOpen, userName, onComplete }) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Start animations
      setShowFireworks(true);
      
      // Generate coin positions
      const newCoins = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        delay: i * 0.1
      }));
      setCoins(newCoins);
      
      // Increment score
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore < 100) {
          currentScore += 5;
          setScore(currentScore);
        }
      }, 100);
      
      // Auto-complete after 6 seconds
      const timer = setTimeout(() => {
        clearInterval(interval);
        onComplete();
      }, 6000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
        setShowFireworks(false);
        setCoins([]);
        setScore(0);
      };
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900"
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255, 102, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 102, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 0, 0.2) 0%, transparent 50%)
          `
        }}
      >
        {/* Animated Stars Background */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Main Container */}
        <div className="relative">
          {/* Score Display */}
          <motion.div
            initial={{ scale: 0, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl shadow-2xl border-4 border-yellow-300">
              <div className="text-4xl font-bold text-center">
                DEAL COMPLETE!
              </div>
              <div className="text-6xl font-bold text-center mt-2">
                +{score} XP
              </div>
            </div>
          </motion.div>

          {/* FlipIQ House with Lightbulb */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="relative"
          >
            {/* House Container */}
            <svg width="400" height="400" viewBox="0 0 400 400" className="relative z-10">
              {/* House Shadow */}
              <ellipse cx="200" cy="380" rx="120" ry="20" fill="rgba(0,0,0,0.3)" />
              
              {/* House Foundation */}
              <rect x="80" y="200" width="240" height="180" 
                    fill="#2D3E50" 
                    stroke="#1A252F" 
                    strokeWidth="4"/>
              
              {/* House Walls with Gradient */}
              <rect x="80" y="200" width="240" height="180">
                <animate attributeName="fill" 
                  values="#FF6600;#FF8833;#FF6600" 
                  dur="3s" 
                  repeatCount="indefinite"/>
              </rect>
              
              {/* Roof */}
              <path d="M 50 200 L 200 80 L 350 200 Z" 
                    fill="#FF6600" 
                    stroke="#E55500" 
                    strokeWidth="4"/>
              
              {/* Chimney */}
              <rect x="250" y="120" width="40" height="80" 
                    fill="#E55500" 
                    stroke="#CC4400" 
                    strokeWidth="2"/>
              
              {/* Smoke Puffs */}
              <motion.circle
                cx="270"
                cy="110"
                r="10"
                fill="rgba(255,255,255,0.6)"
                animate={{
                  y: [-10, -30, -50],
                  opacity: [0.8, 0.5, 0],
                  scale: [1, 1.5, 2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              
              {/* Door */}
              <rect x="170" y="280" width="60" height="100" 
                    fill="#8B4513" 
                    stroke="#654321" 
                    strokeWidth="2"/>
              <circle cx="215" cy="330" r="3" fill="#FFD700"/>
              
              {/* Windows */}
              <rect x="120" y="240" width="40" height="40" 
                    fill="#87CEEB" 
                    stroke="#2D3E50" 
                    strokeWidth="3"/>
              <rect x="240" y="240" width="40" height="40" 
                    fill="#87CEEB" 
                    stroke="#2D3E50" 
                    strokeWidth="3"/>
              
              {/* Window Glow Effect */}
              <rect x="120" y="240" width="40" height="40" 
                    fill="rgba(255,255,0,0.5)">
                <animate attributeName="opacity" 
                  values="0.3;0.8;0.3" 
                  dur="2s" 
                  repeatCount="indefinite"/>
              </rect>
              <rect x="240" y="240" width="40" height="40" 
                    fill="rgba(255,255,0,0.5)">
                <animate attributeName="opacity" 
                  values="0.3;0.8;0.3" 
                  dur="2s" 
                  repeatCount="indefinite"/>
              </rect>
              
              {/* Central Lightbulb */}
              <g transform="translate(200, 180)">
                {/* Lightbulb Glow */}
                <circle cx="0" cy="0" r="60" fill="rgba(255,255,0,0.3)">
                  <animate attributeName="r" 
                    values="60;80;60" 
                    dur="2s" 
                    repeatCount="indefinite"/>
                  <animate attributeName="opacity" 
                    values="0.3;0.6;0.3" 
                    dur="2s" 
                    repeatCount="indefinite"/>
                </circle>
                
                {/* Lightbulb */}
                <circle cx="0" cy="-10" r="30" 
                        fill="#FFD700" 
                        stroke="#FFA500" 
                        strokeWidth="3"/>
                <path d="M -15 10 Q -15 25 0 30 Q 15 25 15 10" 
                      fill="#FFD700" 
                      stroke="#FFA500" 
                      strokeWidth="3"/>
                
                {/* Lightbulb Base */}
                <rect x="-10" y="25" width="20" height="10" 
                      fill="#2D3E50" 
                      rx="2"/>
                <rect x="-12" y="35" width="24" height="5" 
                      fill="#2D3E50" 
                      rx="2"/>
                
                {/* Lightbulb Filament */}
                <path d="M -5 -10 Q 0 -5 5 -10" 
                      fill="none" 
                      stroke="#FF6600" 
                      strokeWidth="2"/>
                <path d="M -5 0 Q 0 5 5 0" 
                      fill="none" 
                      stroke="#FF6600" 
                      strokeWidth="2"/>
              </g>
              
              {/* Light Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <motion.line
                  key={angle}
                  x1="200"
                  y1="170"
                  x2={200 + 80 * Math.cos(angle * Math.PI / 180)}
                  y2={170 + 80 * Math.sin(angle * Math.PI / 180)}
                  stroke="#FFD700"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    pathLength: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: angle / 360
                  }}
                />
              ))}
            </svg>

            {/* Floating Coins */}
            {coins.map(coin => (
              <motion.div
                key={coin.id}
                className="absolute"
                style={{ left: '50%', top: '50%' }}
                initial={{ 
                  x: 0, 
                  y: 0,
                  scale: 0
                }}
                animate={{ 
                  x: coin.x * 4, 
                  y: coin.y * 4 - 100,
                  scale: [0, 1.2, 1],
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  delay: coin.delay,
                  ease: "easeOut"
                }}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-lg">
                  <span className="text-yellow-900 font-bold text-lg">$</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Congratulations Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              EXCELLENT WORK, {userName.toUpperCase()}!
            </h2>
            <p className="text-2xl text-yellow-300 drop-shadow-md">
              You're crushing those deals! 🚀
            </p>
          </motion.div>

          {/* Particle Effects */}
          {showFireworks && [...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                scale: [1, 2, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onComplete}
          className="absolute bottom-10 right-10 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-lg transition-colors"
        >
          Continue to Summary →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlipIQCelebration;

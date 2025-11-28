import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface MilestoneCompletionModalProps {
  isOpen: boolean;
  userName?: string;
  onComplete: () => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const FlipIQHouseLogo = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun rays */}
    <line x1="60" y1="5" x2="60" y2="15" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
    <line x1="35" y1="12" x2="40" y2="20" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
    <line x1="85" y1="12" x2="80" y2="20" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
    <line x1="25" y1="25" x2="32" y2="30" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
    <line x1="95" y1="25" x2="88" y2="30" stroke="#FF6600" strokeWidth="4" strokeLinecap="round"/>
    
    {/* House roof */}
    <path d="M60 25 L15 65 L25 65 L25 110 L95 110 L95 65 L105 65 Z" stroke="#FF6600" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Left wall line */}
    <line x1="25" y1="65" x2="25" y2="110" stroke="#FF6600" strokeWidth="5" strokeLinecap="round"/>
    
    {/* Right wall line */}
    <line x1="95" y1="65" x2="95" y2="110" stroke="#FF6600" strokeWidth="5" strokeLinecap="round"/>
    
    {/* Lightbulb */}
    <ellipse cx="60" cy="70" rx="18" ry="20" fill="#FF6600"/>
    <path d="M50 88 L50 95 Q50 100 55 100 L65 100 Q70 100 70 95 L70 88" fill="#4A5568"/>
    <line x1="52" y1="92" x2="68" y2="92" stroke="#2D3748" strokeWidth="2"/>
    <line x1="52" y1="96" x2="68" y2="96" stroke="#2D3748" strokeWidth="2"/>
    
    {/* Lightbulb inner glow/heart shape */}
    <path d="M60 60 Q55 65 55 70 Q55 75 60 78 Q65 75 65 70 Q65 65 60 60" fill="#FFE0CC"/>
  </svg>
);

export default function MilestoneCompletionModal({ 
  isOpen, 
  userName = "Tony",
  onComplete 
}: MilestoneCompletionModalProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [launchPhase, setLaunchPhase] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const newSparkles: Sparkle[] = [];
      const colors = ['#FFD700', '#FF6600', '#FF69B4', '#00FFFF', '#7CFC00', '#FF1493', '#FFFF00'];
      
      for (let i = 0; i < 60; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        });
      }
      setSparkles(newSparkles);

      setTimeout(() => setLaunchPhase(1), 300);
      setTimeout(() => setLaunchPhase(2), 1000);
      setTimeout(() => setShowMessage(true), 2000);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 5000);
    } else {
      setShowMessage(false);
      setFadeOut(false);
      setSparkles([]);
      setLaunchPhase(0);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 overflow-hidden",
        fadeOut ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Animated Sky Background - Dawn to Day */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-600 to-orange-400 animate-sky-brighten" />
      
      {/* Stars that fade out */}
      <div className="absolute inset-0 animate-stars-fade">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Neighborhood Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-800 to-green-600" />
        
        {/* Houses silhouette */}
        <svg className="absolute bottom-10 left-0 right-0 w-full h-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
          {/* Far background houses */}
          <g fill="#1a1a2e" opacity="0.6">
            <polygon points="0,160 0,100 30,70 60,100 60,160"/>
            <polygon points="80,160 80,90 120,50 160,90 160,160"/>
            <polygon points="180,160 180,110 210,80 240,110 240,160"/>
            <polygon points="900,160 900,95 940,60 980,95 980,160"/>
            <polygon points="1020,160 1020,105 1050,75 1080,105 1080,160"/>
            <polygon points="1120,160 1120,90 1160,55 1200,90 1200,160"/>
          </g>
          
          {/* Mid houses */}
          <g fill="#2d2d44">
            <polygon points="260,160 260,85 300,50 340,85 340,160"/>
            <rect x="280" y="110" width="20" height="30" fill="#3d3d5c"/>
            <rect x="310" y="100" width="15" height="20" fill="#ffcc66"/>
            
            <polygon points="360,160 360,95 410,55 460,95 460,160"/>
            <rect x="395" y="115" width="25" height="35" fill="#3d3d5c"/>
            
            <polygon points="750,160 750,80 800,40 850,80 850,160"/>
            <rect x="785" y="100" width="25" height="40" fill="#3d3d5c"/>
            <rect x="795" y="110" width="12" height="15" fill="#ffcc66"/>
          </g>
          
          {/* Front houses */}
          <g fill="#3d3d5c">
            <polygon points="480,160 480,70 540,25 600,70 600,160"/>
            <rect x="520" y="100" width="30" height="50" fill="#4a4a6a"/>
            <rect x="528" y="108" width="14" height="20" fill="#ffcc66"/>
            <rect x="555" y="90" width="20" height="25" fill="#ffcc66"/>
            
            <polygon points="620,160 620,85 680,45 740,85 740,160"/>
            <rect x="660" y="105" width="25" height="45" fill="#4a4a6a"/>
            <rect x="667" y="112" width="12" height="18" fill="#ffcc66"/>
          </g>
          
          {/* Trees */}
          <g fill="#1a472a">
            <ellipse cx="50" cy="130" rx="25" ry="30"/>
            <ellipse cx="200" cy="135" rx="20" ry="25"/>
            <ellipse cx="420" cy="130" rx="30" ry="35"/>
            <ellipse cx="870" cy="130" rx="25" ry="30"/>
            <ellipse cx="1100" cy="135" rx="22" ry="28"/>
          </g>
        </svg>
        
        {/* Launch pad / crater effect */}
        <div className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500",
          launchPhase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-32 h-8 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent rounded-full blur-md animate-pulse" />
        </div>
      </div>

      {/* Dust clouds on liftoff */}
      {launchPhase >= 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-cloud"
              style={{
                left: `${(i - 4) * 40}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-t from-gray-400 to-transparent rounded-full opacity-70 blur-sm" />
            </div>
          ))}
        </div>
      )}

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle-float pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <div
            className="animate-sparkle-twinkle"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              background: `radial-gradient(circle, ${sparkle.color} 0%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
            }}
          />
        </div>
      ))}

      {/* FlipIQ House Rocket */}
      <div 
        className={cn(
          "absolute pointer-events-none transition-all",
          launchPhase === 0 ? "bottom-32 left-1/2 -translate-x-1/2" : "",
          launchPhase >= 1 ? "animate-house-liftoff" : ""
        )}
        style={{ zIndex: 10 }}
      >
        <div className="relative">
          {/* Rocket flames */}
          <div className={cn(
            "absolute -bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300",
            launchPhase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}>
            {/* Main flame */}
            <div className="relative">
              <div className="w-16 h-32 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 rounded-b-full animate-flame-flicker" 
                style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 50% 80%, 0% 100%)' }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-24 bg-gradient-to-t from-transparent via-yellow-400 to-white rounded-b-full animate-flame-flicker-fast"
                style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 50% 85%, 0% 100%)' }}
              />
            </div>
            
            {/* Side flames */}
            <div className="absolute -left-4 top-4 w-6 h-16 bg-gradient-to-t from-transparent via-orange-600 to-yellow-400 rounded-b-full animate-flame-side opacity-80 rotate-12" />
            <div className="absolute -right-4 top-4 w-6 h-16 bg-gradient-to-t from-transparent via-orange-600 to-yellow-400 rounded-b-full animate-flame-side opacity-80 -rotate-12" />
          </div>

          {/* The House Logo */}
          <div className="relative animate-rocket-shake">
            <FlipIQHouseLogo />
            
            {/* Glow effect around house */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl transition-opacity duration-500",
              launchPhase >= 1 ? "opacity-60" : "opacity-0"
            )}
              style={{ background: 'radial-gradient(circle, #FF6600 0%, transparent 70%)' }}
            />
          </div>

          {/* Sparkle trail behind rocket */}
          {launchPhase >= 2 && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-trail-sparkle"
                  style={{
                    left: `${(Math.random() - 0.5) * 60}px`,
                    top: `${i * 15}px`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <span 
                    className="text-xl"
                    style={{ filter: `hue-rotate(${i * 30}deg)` }}
                  >
                    ✨
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Congratulations Message */}
      <div 
        className={cn(
          "relative z-20 text-center transition-all duration-1000 transform",
          showMessage 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-75 translate-y-10"
        )}
      >
        <div className="animate-bounce-slow mb-6">
          <span className="text-6xl">🎉</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 mb-4 animate-text-shimmer drop-shadow-2xl">
          CONGRATULATIONS!
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          {userName}, you finished your Action Plan!
        </h2>
        
        <div className="flex justify-center gap-4 text-4xl animate-pulse">
          <span>🏆</span>
          <span>⭐</span>
          <span>🎯</span>
          <span>💪</span>
          <span>🚀</span>
        </div>

        <p className="mt-8 text-xl text-white/80 animate-fade-in-delayed">
          Let's review your daily summary...
        </p>
      </div>

      <style>{`
        @keyframes house-liftoff {
          0% {
            bottom: 8rem;
            left: 50%;
            transform: translateX(-50%) rotate(0deg);
          }
          10% {
            bottom: 8rem;
            transform: translateX(-50%) rotate(-2deg);
          }
          20% {
            bottom: 10rem;
            transform: translateX(-50%) rotate(2deg);
          }
          40% {
            bottom: 30%;
            transform: translateX(-50%) rotate(-1deg);
          }
          60% {
            bottom: 50%;
            transform: translateX(-50%) rotate(1deg);
          }
          80% {
            bottom: 70%;
            opacity: 1;
            transform: translateX(-50%) rotate(0deg);
          }
          100% {
            bottom: 110%;
            opacity: 0;
            transform: translateX(-50%) rotate(0deg);
          }
        }

        @keyframes sky-brighten {
          0% {
            background: linear-gradient(to bottom, #1a1a2e, #4a1a6b, #ff6b35);
          }
          50% {
            background: linear-gradient(to bottom, #2d3561, #6b3fa0, #ff8c42);
          }
          100% {
            background: linear-gradient(to bottom, #4a90e2, #87ceeb, #ffd700);
          }
        }

        @keyframes stars-fade {
          0%, 30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes dust-cloud {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-50px) translateX(var(--drift, 20px)) scale(2);
            opacity: 0;
          }
        }

        @keyframes flame-flicker {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
          }
          25% {
            transform: scaleY(1.1) scaleX(0.9);
          }
          50% {
            transform: scaleY(0.95) scaleX(1.05);
          }
          75% {
            transform: scaleY(1.05) scaleX(0.95);
          }
        }

        @keyframes flame-flicker-fast {
          0%, 100% {
            transform: scaleY(1) scaleX(1) translateX(-50%);
          }
          33% {
            transform: scaleY(1.15) scaleX(0.85) translateX(-50%);
          }
          66% {
            transform: scaleY(0.9) scaleX(1.1) translateX(-50%);
          }
        }

        @keyframes flame-side {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 0.6;
          }
        }

        @keyframes rocket-shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        @keyframes sparkle-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
        }

        @keyframes sparkle-twinkle {
          0%, 100% {
            transform: scale(0.5);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @keyframes trail-sparkle {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0) translateY(50px);
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in-delayed {
          0%, 50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-house-liftoff {
          animation: house-liftoff 3.5s ease-in forwards;
        }

        .animate-sky-brighten {
          animation: sky-brighten 4s ease-out forwards;
        }

        .animate-stars-fade {
          animation: stars-fade 3s ease-out forwards;
        }

        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }

        .animate-dust-cloud {
          animation: dust-cloud 1.5s ease-out forwards;
          --drift: ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px;
        }

        .animate-flame-flicker {
          animation: flame-flicker 0.15s ease-in-out infinite;
        }

        .animate-flame-flicker-fast {
          animation: flame-flicker-fast 0.1s ease-in-out infinite;
        }

        .animate-flame-side {
          animation: flame-side 0.2s ease-in-out infinite;
        }

        .animate-rocket-shake {
          animation: rocket-shake 0.1s ease-in-out infinite;
        }

        .animate-sparkle-float {
          animation: sparkle-float 3s ease-in-out infinite;
        }

        .animate-sparkle-twinkle {
          animation: sparkle-twinkle 1.5s ease-in-out infinite;
        }

        .animate-trail-sparkle {
          animation: trail-sparkle 0.8s ease-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

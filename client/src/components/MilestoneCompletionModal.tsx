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

export default function MilestoneCompletionModal({ 
  isOpen, 
  userName = "Tony",
  onComplete 
}: MilestoneCompletionModalProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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

      setTimeout(() => setShowMessage(true), 1500);

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
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500",
        fadeOut ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-sm" />
      
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

      <div className="absolute animate-unicorn-fly pointer-events-none" style={{ zIndex: 10 }}>
        <div className="relative">
          <span className="text-[120px] transform -scale-x-100 inline-block drop-shadow-2xl">
            🦄
          </span>
          
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-trail-sparkle"
                style={{
                  right: `${i * 25}px`,
                  top: `${Math.sin(i * 0.8) * 20}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <span 
                  className="text-2xl"
                  style={{
                    filter: `hue-rotate(${i * 30}deg)`,
                  }}
                >
                  ✨
                </span>
              </div>
            ))}
          </div>

          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-rainbow-trail"
                style={{
                  right: `${i * 30 + 20}px`,
                  top: `${Math.sin(i * 0.5) * 15}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full opacity-80"
                  style={{
                    background: `hsl(${i * 45}, 100%, 60%)`,
                    boxShadow: `0 0 20px hsl(${i * 45}, 100%, 60%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 mb-4 animate-text-shimmer">
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
        @keyframes unicorn-fly {
          0% {
            transform: translate(-200px, 100px) rotate(-10deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translate(30vw, -50px) rotate(5deg);
          }
          50% {
            transform: translate(50vw, 50px) rotate(-5deg);
          }
          75% {
            transform: translate(70vw, -30px) rotate(5deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 200px), 0px) rotate(0deg);
            opacity: 0;
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
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0) translateX(50px);
          }
        }

        @keyframes rainbow-trail {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateX(30px);
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

        .animate-unicorn-fly {
          animation: unicorn-fly 4s ease-in-out forwards;
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

        .animate-rainbow-trail {
          animation: rainbow-trail 1s ease-out infinite;
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

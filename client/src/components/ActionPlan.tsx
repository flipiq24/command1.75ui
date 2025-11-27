import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

const CircularProgress = ({ 
  count, 
  total, 
  color, 
  bgColor = "#f3f4f6",
  size = 80, 
  strokeWidth = 6 
}: { 
  count: number; 
  total: number; 
  color: string; 
  bgColor?: string;
  size?: number; 
  strokeWidth?: number; 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total === 0 ? 0 : count / total;
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Inner Text */}
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">
        {count}<span className="text-sm text-gray-400">/{total}</span>
      </div>
    </div>
  );
};

export default function ActionPlan() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nov 27, 2025 — Today's Action Plan</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-semibold">Prioritized Workflow</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-2 flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Offer Goal</div>
            <div className="text-xs text-gray-400">Target: 3 Offers</div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-blue-600">1</span>
            <span className="text-xl font-bold text-gray-300">/ 3</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Hot Deals - Start Here */}
        <div className="relative bg-white border-2 border-red-500 rounded-xl p-4 flex flex-col items-center shadow-sm">
          <div className="absolute -top-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Start Here
          </div>
          
          <div className="mb-3">
            <CircularProgress 
              count={0} 
              total={1} 
              color="#ef4444" 
              bgColor="#fee2e2" 
              size={80} 
              strokeWidth={6} 
            />
          </div>
          
          <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition">
            View Hot Deals
          </button>
        </div>

        {/* Warm Deals - Review Complete */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center opacity-75">
          <div className="w-20 h-20 mb-3 flex items-center justify-center bg-green-100 rounded-full">
            <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
          </div>
          
          <button className="w-full bg-gray-200 text-gray-500 text-xs font-bold py-2 px-4 rounded-lg cursor-default">
            Review Complete
          </button>
        </div>

        {/* Cold Deals */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center hover:border-blue-300 transition">
          <div className="mb-3">
            <CircularProgress 
              count={0} 
              total={5} 
              color="#3b82f6" 
              size={80} 
              strokeWidth={6} 
            />
          </div>
          
          <button className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold py-2 px-4 rounded-lg transition">
            Open Cold Deals
          </button>
        </div>

        {/* New Deals */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center hover:border-gray-300 transition">
          <div className="mb-3">
            <CircularProgress 
              count={56} 
              total={60} 
              color="#22c55e" 
              size={80} 
              strokeWidth={6} 
            />
          </div>
          
          <button className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold py-2 px-4 rounded-lg transition">
            Process New Deals
          </button>
        </div>

      </div>
    </div>
  );
}
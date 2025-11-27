import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';

type DealType = 'hot' | 'warm' | 'cold' | 'new';

interface ActionItem {
  id: DealType;
  count: number;
  total: number;
  buttonText: string;
  buttonClass: string;
  circleColor: string;
  circleBg: string;
  opacityClass?: string;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'hot',
    count: 0,
    total: 1,
    buttonText: 'View Hot Deals',
    buttonClass: 'bg-red-600 border border-red-600 text-white shadow-md hover:bg-red-700 animate-pulse',
    circleColor: '#ef4444',
    circleBg: '#fee2e2',
    opacityClass: ''
  },
  {
    id: 'warm',
    count: 0,
    total: 8,
    buttonText: 'Review Warm Deals',
    buttonClass: 'bg-white border border-orange-500 text-orange-600 hover:bg-orange-50',
    circleColor: '#f59e0b',
    circleBg: '#f3f4f6',
    opacityClass: 'opacity-60 hover:opacity-100 transition'
  },
  {
    id: 'cold',
    count: 0,
    total: 5,
    buttonText: 'Open Cold Deals',
    buttonClass: 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50',
    circleColor: '#3b82f6',
    circleBg: '#f3f4f6',
    opacityClass: 'opacity-60 hover:opacity-100 transition'
  },
  {
    id: 'new',
    count: 56,
    total: 60,
    buttonText: 'Process New Deals',
    buttonClass: 'bg-white border border-gray-400 text-gray-600 hover:bg-gray-50',
    circleColor: '#22c55e',
    circleBg: '#f3f4f6',
    opacityClass: 'opacity-60 hover:opacity-100 transition'
  }
];

const CircularProgress = ({ 
  count, 
  total, 
  color, 
  bgColor,
  size = 80, // w-20 = 80px
  strokeWidth = 6 
}: { 
  count: number; 
  total: number; 
  color: string; 
  bgColor: string;
  size?: number; 
  strokeWidth?: number; 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total === 0 ? 0 : count / total;
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center mb-3" style={{ width: size, height: size }}>
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">
          {count}<span className="text-sm text-gray-400 font-medium">/{total}</span>
        </span>
      </div>
    </div>
  );
};

export default function ActionPlan() {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nov 27, 2025 — Today's Action Plan</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Prioritized Workflow</p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-6 py-3 flex flex-col items-center min-w-[140px]">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Daily Offer Goal</span>
          <div className="flex items-baseline gap-1">
            <button className="text-3xl font-black text-blue-600 hover:text-blue-700 transition cursor-pointer leading-none">1</button>
            <span className="text-xl font-bold text-gray-300">/ 3</span>
          </div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 text-center">
        {ACTION_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className={cn("flex flex-col items-center group", item.opacityClass)}
          >
            <CircularProgress 
              count={item.count} 
              total={item.total} 
              color={item.circleColor} 
              bgColor={item.circleBg}
            />
            
            <button 
              className={cn(
                "w-full text-xs font-bold py-2 px-4 rounded-lg transition",
                item.buttonClass
              )}
            >
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
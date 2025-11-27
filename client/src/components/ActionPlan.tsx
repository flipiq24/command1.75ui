import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Info, Check } from 'lucide-react';

type DealType = 'hot' | 'warm' | 'cold' | 'new';

interface ActionItem {
  id: DealType;
  label: string;
  count: number;
  total: number;
  color: string;
  buttonText: string;
  tooltipTitle: string;
  tooltipText: string;
  isCompleted?: boolean;
  isPriority?: boolean;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'hot',
    label: 'Hot Deals',
    count: 0,
    total: 1,
    color: '#ef4444', // red-500
    buttonText: 'View Hot Deals',
    tooltipTitle: 'Hot Deals',
    tooltipText: 'These deals require immediate follow-up. 0 completed out of 1. Total: 1.',
    isPriority: true
  },
  {
    id: 'warm',
    label: 'Warm Deals',
    count: 0,
    total: 8,
    color: '#f59e0b', // amber-500
    buttonText: 'Review Complete',
    tooltipTitle: 'Warm Deals',
    tooltipText: 'Warm leads showing moderate engagement. 0 completed out of 8. Total: 8.',
    isCompleted: true
  },
  {
    id: 'cold',
    label: 'Cold Deals',
    count: 0,
    total: 5,
    color: '#3b82f6', // blue-500
    buttonText: 'Open Cold Deals',
    tooltipTitle: 'Cold Deals',
    tooltipText: 'Cold leads with low recent engagement. 0 completed out of 5. Total: 5.'
  },
  {
    id: 'new',
    label: 'New Deals',
    count: 56,
    total: 60,
    color: '#22c55e', // green-500
    buttonText: 'Process New Deals',
    tooltipTitle: 'New Deals',
    tooltipText: 'These are new incoming deals that do not have a temperature assigned yet (Hot, Warm, Cold) or are offer status "None"  They need to be reviewed and categorized.'
  }
];

const CircularProgress = ({ 
  count, 
  total, 
  color, 
  size = 80, 
  strokeWidth = 6 
}: { 
  count: number; 
  total: number; 
  color: string; 
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
          stroke="#f3f4f6" // gray-100
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

const CompletedCircle = () => (
  <div className="w-20 h-20 mb-3 flex items-center justify-center bg-green-100 rounded-full">
    <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
  </div>
);

export default function ActionPlan() {
  return (
    <div className="bg-white p-6 rounded-t-xl border-b border-gray-200 font-sans mb-8">
      
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

      <div className="grid grid-cols-4 gap-6">
        
        {ACTION_ITEMS.map((item) => {
          if (item.isPriority) {
            return (
              <div key={item.id} className="relative bg-white border-2 border-red-500 rounded-xl p-4 flex flex-col items-center shadow-sm">
                <div className="absolute -top-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  Start Here
                </div>
                
                <div className="relative w-20 h-20 mb-3">
                  <div className="w-full h-full bg-red-600 rounded-full animate-pulse absolute inset-0 opacity-20"></div>
                  <CircularProgress count={item.count} total={item.total} color="#ef4444" />
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition">
                  {item.buttonText}
                </button>
              </div>
            );
          }

          if (item.isCompleted) {
            return (
              <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center opacity-75">
                <CompletedCircle />
                <button className="w-full bg-gray-200 text-gray-500 text-xs font-bold py-2 px-4 rounded-lg cursor-default">
                  {item.buttonText}
                </button>
              </div>
            );
          }

          const isNewDeals = item.id === 'new';
          const borderColor = isNewDeals ? 'hover:border-gray-300' : 'hover:border-blue-300';
          const buttonClass = isNewDeals 
            ? 'border-gray-300 text-gray-600 hover:bg-gray-50' 
            : 'border-blue-200 text-blue-600 hover:bg-blue-50';

          return (
            <div key={item.id} className={cn("bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center transition", borderColor)}>
              <div className="mb-3">
                 <CircularProgress 
                   count={item.count} 
                   total={item.total} 
                   color={item.color} 
                 />
              </div>
              
              <button className={cn("w-full border text-xs font-bold py-2 px-4 rounded-lg transition", buttonClass)}>
                {item.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
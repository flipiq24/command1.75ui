import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';

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
  buttonClass: string;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'hot',
    label: 'Hot Deals',
    count: 0,
    total: 1,
    color: '#ef4444', // red-500 for circle
    buttonText: 'View Hot Deals',
    tooltipTitle: 'Hot Deals',
    tooltipText: 'These deals require immediate follow-up. 0 completed out of 1. Total: 1.',
    buttonClass: 'bg-[#FF6600] text-white hover:opacity-90 animate-pulse shadow-md'
  },
  {
    id: 'warm',
    label: 'Warm Deals',
    count: 0,
    total: 8,
    color: '#f59e0b', // amber-500
    buttonText: 'Review Warm Deals',
    tooltipTitle: 'Warm Deals',
    tooltipText: 'Warm leads showing moderate engagement. 0 completed out of 8. Total: 8.',
    buttonClass: 'bg-white border border-orange-400 text-orange-500 hover:bg-orange-50'
  },
  {
    id: 'cold',
    label: 'Cold Deals',
    count: 0,
    total: 5,
    color: '#3b82f6', // blue-500
    buttonText: 'Open Cold Deals',
    tooltipTitle: 'Cold Deals',
    tooltipText: 'Cold leads with low recent engagement. 0 completed out of 5. Total: 5.',
    buttonClass: 'bg-white border border-blue-400 text-blue-500 hover:bg-blue-50'
  },
  {
    id: 'new',
    label: 'New Deals',
    count: 56,
    total: 60,
    color: '#22c55e', // green-500
    buttonText: 'Process New Deals',
    tooltipTitle: 'New Deals',
    tooltipText: 'These are new incoming deals that do not have a temperature assigned yet. They need to be reviewed and categorized.',
    buttonClass: 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
  }
];

const CircularProgress = ({ 
  count, 
  total, 
  color, 
  size = 96, // 24 * 4 = 96px
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
  // Fix: snippet shows stroke-dashoffset logic might be different or calculated differently.
  // Snippet: stroke-dasharray="251.2" stroke-dashoffset="251.2" (for 0 progress)
  // r=40, circumference = 2 * PI * 40 ≈ 251.327
  
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="relative mb-3" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6" // gray-100/200 equivalent in snippet
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round" // Snippet didn't explicitly have round but it looks better, snippet seems standard
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">
        {count}<span className="text-sm text-gray-400">/{total}</span>
      </div>
    </div>
  );
};

export default function ActionPlan() {
  const [hoveredId, setHoveredId] = useState<DealType | null>(null);

  return (
    <div className="bg-white p-6 rounded-t-xl border-b border-gray-200 font-sans mb-8 rounded-b-xl shadow-sm border border-gray-200">
      {/* Note: Added rounded-b-xl shadow-sm border border-gray-200 to outer container to match the previous card style while keeping snippet internals */}
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Nov 27, 2025 — Today's Action Plan! — 32% of your goal
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-semibold">Prioritized Workflow</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Offer Goal</span>
          <div className="flex items-baseline justify-end gap-1">
            <button className="text-3xl font-black text-blue-600 hover:text-blue-700 transition cursor-pointer leading-none">1</button>
            <span className="text-xl font-bold text-gray-300">/ 3</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {ACTION_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col items-center group relative"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
             {/* Tooltip (Keeping the tooltip as it adds value, even if not in snippet explicitly, good UX) */}
             <div 
              className={cn(
                "absolute -top-32 left-1/2 transform -translate-x-1/2 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-100 z-20 transition-all duration-200 pointer-events-none text-center",
                hoveredId === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
            >
              <div className="font-bold text-gray-900 mb-1">{item.tooltipTitle}</div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.tooltipText}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-b border-r border-gray-100"></div>
            </div>

            <CircularProgress count={item.count} total={item.total} color={item.color} />
            
            <div className="text-xs text-gray-400 mb-2">
              Status: {item.count}/{item.total}/{item.total}
            </div>
            
            <button 
              className={cn(
                "w-full text-sm font-bold py-2 px-4 rounded-lg transition",
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

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
    tooltipText: 'These deals require immediate follow-up. 0 completed out of 1. Total: 1.'
  },
  {
    id: 'warm',
    label: 'Warm Deals',
    count: 0,
    total: 8,
    color: '#f59e0b', // amber-500
    buttonText: 'Review Warm Deals',
    tooltipTitle: 'Warm Deals',
    tooltipText: 'Warm leads showing moderate engagement. 0 completed out of 8. Total: 8.'
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
    color: '#6b7280', // gray-500
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
  strokeWidth = 4 
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
    <div className="relative flex items-center justify-center mb-3 transition transform group-hover:scale-105" style={{ width: size, height: size }}>
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">
          {count}<span className="text-sm text-gray-400 font-medium">/{total}</span>
        </span>
      </div>
    </div>
  );
};

export default function ActionPlan() {
  const [hoveredId, setHoveredId] = useState<DealType | null>(null);
  const [statusTooltipId, setStatusTooltipId] = useState<DealType | null>(null);

  return (
    <div className="p-8 border-b border-gray-100 bg-white rounded-t-2xl mb-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nov 27, 2025 — Today's Action Plan</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Deals to Follow Up Today</p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-6 py-3 flex flex-col items-center min-w-[140px]">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Offers Made Today</span>
          
          <div className="flex items-baseline gap-1">
            <button className="text-3xl font-black text-blue-600 hover:text-blue-700 transition cursor-pointer leading-none" title="Filter by Offers Made">
              0
            </button>
            <span className="text-xl font-bold text-gray-300">/ 3</span>
          </div>

          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 text-center">
        {ACTION_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col items-center group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip */}
            <div 
              className={cn(
                "absolute -top-24 left-1/2 transform -translate-x-1/2 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-100 z-20 transition-all duration-200 pointer-events-none text-center",
                hoveredId === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{ marginTop: '-20px' }} // Adjust position relative to smaller circles
            >
              <div className="font-bold text-gray-900 mb-1">{item.tooltipTitle}</div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.tooltipText}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-b border-r border-gray-100"></div>
            </div>

            {/* Circle */}
             <div className="relative">
               <CircularProgress count={item.count} total={item.total} color={item.color} />
            </div>

            {/* CTA Button */}
            <button 
              className="w-full bg-white text-xs font-bold py-2 px-4 rounded-lg transition shadow-sm border hover:bg-opacity-50"
              style={{ 
                borderColor: item.color === '#6b7280' ? '#e5e7eb' : `${item.color}40`, // lighter border for gray
                color: item.color,
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${item.color}10`; // 10% opacity bg on hover
                e.currentTarget.style.borderColor = `${item.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = item.color === '#6b7280' ? '#e5e7eb' : `${item.color}40`;
              }}
            >
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

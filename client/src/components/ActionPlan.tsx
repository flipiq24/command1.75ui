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
  size = 120, 
  strokeWidth = 10 
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
          stroke="#E5E7EB" // gray-200
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
        <span className="text-2xl font-bold text-gray-900">
          {count}<span className="text-gray-400 text-lg">/{total}</span>
        </span>
      </div>
    </div>
  );
};

export default function ActionPlan() {
  const [hoveredId, setHoveredId] = useState<DealType | null>(null);
  const [statusTooltipId, setStatusTooltipId] = useState<DealType | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nov 27, 2025 — Today's Action Plan!</h2>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide font-semibold">Deals to Follow Up Today</p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-100 rounded-xl px-6 py-3 flex flex-col items-center shadow-sm">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Daily Offer Goal</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-blue-600">1</span>
            <span className="text-xl font-bold text-gray-300">/ 3</span>
          </div>
          <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: '33%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ACTION_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip */}
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

            {/* Circle */}
            <div className="mb-4 relative">
               <CircularProgress count={item.count} total={item.total} color={item.color} />
            </div>

            {/* Labels */}
            <div className="text-center mb-4 flex flex-col items-center">
              <div className="relative flex items-center gap-1.5 mb-1">
                <div className="text-base font-semibold text-gray-700 tracking-tight">
                  Status: {item.count}/{item.total}/{item.total}
                </div>
                
                <div 
                  className="text-gray-400 hover:text-gray-600 cursor-help"
                  onMouseEnter={() => setStatusTooltipId(item.id)}
                  onMouseLeave={() => setStatusTooltipId(null)}
                >
                  <Info className="w-4 h-4" />
                </div>

                {/* Status Tooltip */}
                <div 
                  className={cn(
                    "absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-30 transition-all duration-200 pointer-events-none text-left text-xs leading-relaxed",
                    statusTooltipId === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  <div className="font-bold text-white mb-2 text-sm">Status Breakdown:</div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-gray-300">• First Number — Not Started:</span><br/>
                      <span className="text-gray-400">Deals that have NOT been opened yet.</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-300">• Second Number — In Progress:</span><br/>
                      <span className="text-gray-400">Deals that HAVE been opened but have NO completed communication.</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-300">• Third Number — Completed:</span><br/>
                      <span className="text-gray-400">Deals where communication WAS completed and the status was properly updated.</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              className="px-4 py-2 rounded-full text-sm font-bold border-2 bg-white hover:bg-gray-50 transition-colors w-full max-w-[180px]"
              style={{ 
                borderColor: item.color, 
                color: item.color 
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

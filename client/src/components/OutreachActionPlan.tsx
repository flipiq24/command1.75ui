import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';

type OutreachType = 'priority' | 'followup' | 'cold' | 'new';

interface ActionItem {
  id: OutreachType;
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
    id: 'priority',
    label: 'Priority Calls',
    count: 1,
    total: 5,
    color: '#E53935',
    buttonText: 'Call Priority',
    tooltipTitle: 'Priority Calls',
    tooltipText: 'High value agents that need immediate contact. 1 completed out of 5. Total: 5.'
  },
  {
    id: 'followup',
    label: 'Follow Ups',
    count: 2,
    total: 10,
    color: '#FB8C00',
    buttonText: 'Start Follow Ups',
    tooltipTitle: 'Follow Ups',
    tooltipText: 'Scheduled follow ups with agents. 2 completed out of 10. Total: 10.'
  },
  {
    id: 'cold',
    label: 'Cold Outreach',
    count: 0,
    total: 15,
    color: '#1E88E5',
    buttonText: 'Start Cold Calls',
    tooltipTitle: 'Cold Outreach',
    tooltipText: 'New agents to reach out to for the first time. 0 completed out of 15. Total: 15.'
  },
  {
    id: 'new',
    label: 'New Leads',
    count: 0,
    total: 0,
    color: '#43A047',
    buttonText: 'Process Leads',
    tooltipTitle: 'New Leads',
    tooltipText: 'New agent leads from campaigns. 0 completed out of 0.'
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

export default function OutreachActionPlan() {
  const [hoveredId, setHoveredId] = useState<OutreachType | null>(null);
  const [statusTooltipId, setStatusTooltipId] = useState<OutreachType | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nov 26, 2025 — Outreach Plan</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium uppercase tracking-wide">Agents to Contact Today:</p>
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
                "absolute -top-32 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-20 transition-all duration-200 pointer-events-none text-center",
                hoveredId === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
            >
              <div className="font-bold text-white mb-1">{item.tooltipTitle}</div>
              <p className="text-xs text-gray-300 leading-relaxed">{item.tooltipText}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
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
                      <span className="text-gray-400">Calls that have NOT been made yet.</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-300">• Second Number — In Progress:</span><br/>
                      <span className="text-gray-400">Calls attempted but no meaningful contact (Voicemail/Busy).</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-300">• Third Number — Completed:</span><br/>
                      <span className="text-gray-400">Calls where conversation occurred and status updated.</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
                </div>
              </div>

              <div className="text-lg font-bold text-gray-900">{item.label}</div>
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
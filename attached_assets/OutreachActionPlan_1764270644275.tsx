import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  HelpCircle,
  Check,
  Phone,
  Users,
  MessageSquare
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

type OutreachType = 'connections' | 'priority' | 'topOfMind';

interface OutreachActionPlanProps {
  activeFilter?: OutreachType | null;
  onFilterChange?: (filter: OutreachType | null) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function OutreachActionPlan({ 
  activeFilter = null, 
  onFilterChange 
}: OutreachActionPlanProps) {
  
  // Progress tracking - these would come from props/context in production
  const [connectionsCompleted] = useState(3);
  const [connectionsTotal] = useState(30);
  
  const [priorityCompleted] = useState(1);
  const [priorityTotal] = useState(5);
  
  const [topOfMindCompleted] = useState(2);
  const [topOfMindTotal] = useState(10);
  
  const [newRelationships] = useState(1);
  const [newRelationshipsGoal] = useState(5);

  // Calculate overall progress percentage
  const totalTasks = connectionsTotal + priorityTotal + topOfMindTotal;
  const completedTasks = connectionsCompleted + priorityCompleted + topOfMindCompleted;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleCircleClick = (type: OutreachType) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === type ? null : type);
    }
  };

  // Check if section is complete
  const isConnectionsComplete = connectionsCompleted >= connectionsTotal;
  const isPriorityComplete = priorityCompleted >= priorityTotal;
  const isTopOfMindComplete = topOfMindCompleted >= topOfMindTotal;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      
      {/* Header Row */}
      <div className="flex items-start justify-between mb-2">
        
        {/* Left: Title and Progress */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Nov 27, 2025 — Today's Action Plan!
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>You have completed</span>
            <span className="font-bold text-orange-500">{progressPercent}%</span>
            <span>of today's follow-ups.</span>
            <HelpCircle className="w-4 h-4 text-gray-300 cursor-help" />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full max-w-md h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: New Agent Relationships Goal (styled like Daily Offer Goal) */}
        <div className="text-right ml-8">
          <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            <span>New Agent Relationships</span>
            <HelpCircle className="w-3 h-3" />
          </div>
          <div className="text-3xl font-bold">
            <span className="text-orange-500">{newRelationships}</span>
            <span className="text-gray-300">/{newRelationshipsGoal}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Relationships Built</div>
        </div>
      </div>

      {/* 3 Activity Circles */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        
        {/* Circle 1: 30 Agent Connections */}
        <div 
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all group"
          )}
          onClick={() => handleCircleClick('connections')}
        >
          {/* Circle */}
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'connections' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              {/* Background circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              {/* Progress circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isConnectionsComplete ? "#22c55e" : "#f97316"}
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={`${(connectionsCompleted / connectionsTotal) * 301.6} 301.6`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {connectionsCompleted}<span className="text-gray-300">/{connectionsTotal}</span>
              </span>
            </div>
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {connectionsCompleted}/{connectionsTotal}/{connectionsTotal}</span>
            <HelpCircle className="w-3 h-3" />
          </div>

          {/* Button */}
          <button 
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isConnectionsComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : activeFilter === 'connections'
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
            )}
          >
            {isConnectionsComplete ? (
              <>
                <span>Connections Complete</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Start Calling</span>
              </>
            )}
          </button>
        </div>

        {/* Circle 2: Priority Calls */}
        <div 
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all group"
          )}
          onClick={() => handleCircleClick('priority')}
        >
          {/* Circle */}
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'priority' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              {/* Background circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              {/* Progress circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isPriorityComplete ? "#22c55e" : "#f97316"}
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={`${(priorityCompleted / priorityTotal) * 301.6} 301.6`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {priorityCompleted}<span className="text-gray-300">/{priorityTotal}</span>
              </span>
            </div>
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {priorityCompleted}/{priorityTotal}/{priorityTotal}</span>
            <HelpCircle className="w-3 h-3" />
          </div>

          {/* Button */}
          <button 
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isPriorityComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : activeFilter === 'priority'
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {isPriorityComplete ? (
              <>
                <span>Priority Complete</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Call Priority</span>
              </>
            )}
          </button>
        </div>

        {/* Circle 3: Top of Mind Campaigns */}
        <div 
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all group"
          )}
          onClick={() => handleCircleClick('topOfMind')}
        >
          {/* Circle */}
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'topOfMind' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              {/* Background circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              {/* Progress circle */}
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isTopOfMindComplete ? "#22c55e" : "#6b7280"}
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={`${(topOfMindCompleted / topOfMindTotal) * 301.6} 301.6`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {topOfMindCompleted}<span className="text-gray-300">/{topOfMindTotal}</span>
              </span>
            </div>
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {topOfMindCompleted}/{topOfMindTotal}/{topOfMindTotal}</span>
            <HelpCircle className="w-3 h-3" />
          </div>

          {/* Button */}
          <button 
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isTopOfMindComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : activeFilter === 'topOfMind'
                  ? "bg-gray-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {isTopOfMindComplete ? (
              <>
                <span>Campaigns Complete</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Send Campaigns</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

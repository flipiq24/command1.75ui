import React from 'react';
import { cn } from "@/lib/utils";
import { 
  HelpCircle,
  Check,
  Phone,
  Users,
  MessageSquare,
  Flame
} from 'lucide-react';

export type OutreachType = 'connections' | 'priority' | 'topOfMind';

interface OutreachActionPlanProps {
  activeFilter?: OutreachType | null;
  onFilterChange?: (filter: OutreachType | null) => void;
  currentIndex?: number;
  isStartMode?: boolean;
  hasStarted?: boolean;
  onStart?: () => void;
  connectionsMade?: number;
  dailyGoal?: number;
}

export default function OutreachActionPlan({ 
  activeFilter = null, 
  onFilterChange,
  currentIndex = 0,
  isStartMode = true,
  hasStarted = false,
  onStart,
  connectionsMade = 0,
  dailyGoal = 30
}: OutreachActionPlanProps) {
  
  const connectionsCompleted = connectionsMade;
  const connectionsTotal = dailyGoal;
  
  const priorityCompleted = 2;
  const priorityTotal = 5;
  
  const topOfMindCompleted = 2;
  const topOfMindTotal = 10;
  
  const newRelationships = 1;
  const newRelationshipsGoal = 5;

  const totalTasks = connectionsTotal + priorityTotal + topOfMindTotal;
  const completedTasks = connectionsCompleted + priorityCompleted + topOfMindCompleted;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleCircleClick = (type: OutreachType) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === type ? null : type);
    }
  };

  const isConnectionsComplete = connectionsCompleted >= connectionsTotal;
  const isPriorityComplete = priorityCompleted >= priorityTotal;
  const isTopOfMindComplete = topOfMindCompleted >= topOfMindTotal;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      
      <div className="flex items-start justify-between mb-2">
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Nov 27, 2025 — Today's Outreach Plan!
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>You have completed</span>
            <span className="font-bold text-orange-500">{progressPercent}%</span>
            <span>of today's Outreach.</span>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-300 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                Your daily outreach progress based on agent connections, priority calls, and top of mind campaigns completed.
              </div>
            </div>
          </div>
          
          <div className="mt-3 w-full max-w-md h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="text-right ml-8 group relative cursor-help">
          <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            <span>New Agent Relationships</span>
            <HelpCircle className="w-3 h-3" />
          </div>
          <div className="text-3xl font-bold">
            <span className="text-orange-500">{newRelationships}</span>
            <span className="text-gray-300">/{newRelationshipsGoal}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Relationships Built</div>
          
          <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-left">
            <div className="font-bold text-[#FF6600] mb-2">New Agent Relationships</div>
            <div className="mb-2">Goal: 5 per day (100+ relationships/year)</div>
            <div className="text-gray-300">
              Increments when an agent's relationship status changes from "Cold" or "Unassigned" to "Warm" or "Hot".
            </div>
            <div className="mt-2 text-gray-400 italic">
              Click to filter and see relationships built today.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-8">
        
        <div 
          className="flex flex-col items-center cursor-pointer transition-all group"
          onClick={() => handleCircleClick('connections')}
          data-testid="circle-connections"
        >
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'connections' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isConnectionsComplete ? "#22c55e" : "#dc2626"}
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

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {connectionsCompleted}/{connectionsTotal}/{connectionsTotal}</span>
            <div className="group/tip relative">
              <HelpCircle className="w-3 h-3 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-50 text-left leading-relaxed">
                <p className="mb-2">Focuses on <strong>High-Value Agents</strong> with Aged, Pending, and Backup listings that have a high <strong>Propensity to Sell</strong>.</p>
                <hr className="border-gray-700 my-2" />
                <p><strong>Goal:</strong> 30 Contacts per day that create <strong className="text-[#FF6600]">5 new solid relationships</strong> per day (25/week or 1,300/year).</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onStart}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isConnectionsComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : !hasStarted
                  ? "bg-red-600 text-white shadow-xl shadow-red-500/50 animate-pulse hover:bg-red-700"
                  : "bg-white text-red-600 border-2 border-red-500 hover:bg-red-50"
            )}
            data-testid="button-new-relationships"
          >
            {isConnectionsComplete ? (
              <>
                <span>Connections Complete</span>
                <Check className="w-4 h-4" />
              </>
            ) : !hasStarted ? (
              <>
                <Phone className="w-4 h-4" />
                <span>Start Calling</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>New Agent Relationships</span>
              </>
            )}
          </button>
        </div>

        <div 
          className="flex flex-col items-center cursor-pointer transition-all group"
          onClick={() => handleCircleClick('priority')}
          data-testid="circle-priority"
        >
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'priority' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isPriorityComplete ? "#22c55e" : "#f59e0b"}
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

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {priorityCompleted}/{priorityTotal}/{priorityTotal}</span>
            <div className="group/tip relative">
              <HelpCircle className="w-3 h-3 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-50 text-center leading-relaxed">
                Constant live phone calls to reinforce your <strong>100 Priority Relationships</strong>.
                <span className="text-green-400 font-bold block mt-2">This is your long term money maker!</span>
              </div>
            </div>
          </div>

          <button 
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isPriorityComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-white text-amber-500 border-2 border-amber-400 hover:bg-amber-50"
            )}
            data-testid="button-call-priority"
          >
            {isPriorityComplete ? (
              <>
                <span>Priority Complete</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Call Priority</span>
              </>
            )}
          </button>
        </div>

        <div 
          className="flex flex-col items-center cursor-pointer transition-all group"
          onClick={() => handleCircleClick('topOfMind')}
          data-testid="circle-top-of-mind"
        >
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform group-hover:scale-105",
            activeFilter === 'topOfMind' && "scale-105"
          )}>
            <svg className="w-28 h-28 transform -rotate-90">
              <circle 
                cx="56" cy="56" r="48" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
                fill="none" 
              />
              <circle 
                cx="56" cy="56" r="48" 
                stroke={isTopOfMindComplete ? "#22c55e" : "#2563eb"}
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

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Status: {topOfMindCompleted}/{topOfMindTotal}/{topOfMindTotal}</span>
            <div className="group/tip relative">
              <HelpCircle className="w-3 h-3 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-50 text-center leading-relaxed">
                Send valuable, relevant content <strong>every 2 weeks</strong> to Hot, Warm, and Cold agents to stay top of mind.
              </div>
            </div>
          </div>

          <button 
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isTopOfMindComplete 
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-white text-blue-600 border-2 border-blue-400 hover:bg-blue-50"
            )}
            data-testid="button-send-campaigns"
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

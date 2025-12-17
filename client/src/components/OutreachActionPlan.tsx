import React from 'react';
import { cn } from "@/lib/utils";
import { 
  HelpCircle,
  Check,
  Phone,
  Users,
  MessageSquare,
  Search
} from 'lucide-react';

export type OutreachType = 'connections' | 'priority' | 'topOfMind' | 'newRelationships';

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
  
  const topOfMindCompleted = 0;
  const topOfMindTotal = 3;
  
  const newRelationships = 1;
  const newRelationshipsGoal = 5;

  const totalTasks = connectionsTotal + priorityTotal + topOfMindTotal;
  const completedTasks = connectionsCompleted + priorityCompleted + topOfMindCompleted;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleButtonClick = (type: OutreachType) => {
    if (onStart) onStart();
    if (onFilterChange) {
      onFilterChange(type);
    }
  };

  const isConnectionsComplete = connectionsCompleted >= connectionsTotal;
  const isPriorityComplete = priorityCompleted >= priorityTotal;
  const isTopOfMindComplete = topOfMindCompleted >= topOfMindTotal;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      
      <div className="flex items-start justify-between mb-6">
        
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

        <div className="text-right ml-8 group relative cursor-pointer transition-all">
          <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            <span>Daily Offer Goal</span>
            <HelpCircle className="w-3 h-3" />
          </div>
          <div className="text-3xl font-bold">
            <span className="text-[#FF6600]">1</span>
            <span className="text-gray-300">/ 3</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Offers Made</div>
          
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-left">
            <div className="font-bold text-white mb-2 text-sm">
              Monthly Goal: 100+ Offers
            </div>
            <p className="text-gray-300 mb-4">
              Submit a combination of Offer Terms and Contracts to hit your
              target of 2 closed deals per month.
            </p>
            <div className="space-y-2 mb-4">
              <div>
                <span className="font-bold text-gray-300">• 1st Number:</span>{" "}
                <span className="text-gray-400">Offers made today.</span>
              </div>
              <div>
                <span className="font-bold text-gray-300">• 2nd Number:</span>{" "}
                <span className="text-gray-400">Your daily goal.</span>
              </div>
            </div>
            <div className="text-gray-400 italic border-t border-gray-700 pt-2 mt-2">
              Click to filter and see the offers you made today.
            </div>
          </div>
        </div>

        <div 
          className={cn(
            "text-right ml-8 group relative cursor-pointer transition-all border-l border-gray-200 pl-8",
            activeFilter === 'newRelationships' && "ring-2 ring-blue-400 rounded-lg p-2 -m-2 bg-blue-50"
          )}
          onClick={() => handleButtonClick('newRelationships')}
          data-testid="circle-new-relationships"
        >
          <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            <span>New Agent Relationships</span>
            <HelpCircle className="w-3 h-3" />
          </div>
          <div className="text-3xl font-bold">
            <span className="text-blue-600">{newRelationships}</span>
            <span className="text-gray-300">/{newRelationshipsGoal}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Relationships Built</div>
          
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-left">
            <div className="font-bold text-white mb-2 text-sm">
              Weekly Goal: 5 New Agent Relationships
            </div>
            <p className="text-gray-300 mb-4">
              Build new connections with agents to expand your deal pipeline and increase your chances of closing more deals.
            </p>
            <div className="space-y-2 mb-4">
              <div>
                <span className="font-bold text-gray-300">• 1st Number:</span>{" "}
                <span className="text-gray-400">Relationships built this week.</span>
              </div>
              <div>
                <span className="font-bold text-gray-300">• 2nd Number:</span>{" "}
                <span className="text-gray-400">Your weekly goal.</span>
              </div>
            </div>
            <div className="text-gray-400 italic border-t border-gray-700 pt-2 mt-2">
              Click to view your new agent relationships.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-6">
        
        {/* Column 1: Send Campaigns */}
        <div className="flex flex-col items-center">
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform hover:scale-105",
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
          <button 
            onClick={() => handleButtonClick('topOfMind')}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              activeFilter === 'topOfMind'
                ? "bg-blue-600 text-white shadow-lg"
                : isTopOfMindComplete 
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

        {/* Column 2: Call Priority Agents */}
        <div className="flex flex-col items-center">
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform hover:scale-105",
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
          <button 
            onClick={() => handleButtonClick('priority')}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              activeFilter === 'priority'
                ? "bg-amber-500 text-white shadow-lg"
                : isPriorityComplete 
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-white text-amber-600 border-2 border-amber-400 hover:bg-amber-50"
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
                <span>Call Priority Agents</span>
              </>
            )}
          </button>
        </div>

        {/* Column 3: Build Relationships While Chasing Deals */}
        <div className="flex flex-col items-center">
          <div className={cn(
            "relative w-28 h-28 mb-4 transition-transform hover:scale-105",
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
          <button 
            onClick={() => handleButtonClick('connections')}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              activeFilter === 'connections'
                ? "bg-red-600 text-white shadow-lg"
                : isConnectionsComplete 
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
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>New Relationships Building</span>
              </>
            )}
          </button>
        </div>

      </div>

      {!hasStarted && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Send Campaigns</h3>
            <p className="text-xs text-blue-600 font-medium mb-3">Relationship Maintenance</p>
            
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              The system selects agents from your Hot, Warm, and Cold called relationships.
              These are lower-value agents where you have already made initial contact and planted the seed.
              You can send templated or custom messages.
            </p>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Why It Matters</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                By staying in touch every few weeks, you stay top-of-mind.
                When these agents trip over a deal — and often lack strong buyer relationships — you are the squeaky wheel they remember to send it to.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Call Your Priority Agents</h3>
            <p className="text-xs text-amber-600 font-medium mb-3">High-Value Relationship Building</p>
            
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Priority Agents are investor-friendly, high-volume agents you are building relationships with or actively chasing.
            </p>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Why It Matters</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your job is to build the relationship and provide real value.
                These agents require phone calls, not texts or emails.
                The goal is that they send you the deal first.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Build Relationships While Chasing Deals</h3>
            <p className="text-xs text-red-600 font-medium mb-3">Deal-Driven Relationship Entry</p>
            
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Command uses your buy box to surface investor-grade properties (light to heavy fixers) at critical moments:
            </p>
            
            <ul className="text-xs text-gray-600 mb-3 space-y-1 list-disc list-inside">
              <li>Aged listings (70+ days)</li>
              <li>3 days after escrow opens (did the buyer put down the deposit?)</li>
              <li>10 days after escrow opens (did the buyer remove contingencies?)</li>
              <li>20+ days after escrow opens (why has the investor not closed?)</li>
            </ul>
            
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Wholesalers and investors often overpay to tie up deals. You want to be there when those deals start to fall apart.
            </p>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Why It Matters</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">
                The system helps you identify high-propensity opportunities and equips you with:
              </p>
              <ul className="text-xs text-gray-500 space-y-0.5 list-disc list-inside mb-2">
                <li>Property key points</li>
                <li>Seller pain points</li>
                <li>How the agent makes money</li>
                <li>A script to communicate value</li>
              </ul>
              <p className="text-xs text-gray-700 font-medium italic">
                Always chase the relationship first, using the deal as the entry point — even if it's an overpriced fixer.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

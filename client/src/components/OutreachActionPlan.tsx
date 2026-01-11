import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  HelpCircle,
  Check,
  Phone,
  Users,
  MessageSquare,
  Search,
  X,
  PlayCircle,
  Target,
  Heart
} from 'lucide-react';

export type OutreachType = 'connections' | 'priority' | 'topOfMind' | 'newRelationships';
export type CallStyleType = 'with-property' | 'without-property';

interface OutreachActionPlanProps {
  activeFilter?: OutreachType | null;
  onFilterChange?: (filter: OutreachType | null) => void;
  currentIndex?: number;
  isStartMode?: boolean;
  hasStarted?: boolean;
  onStart?: () => void;
  connectionsMade?: number;
  dailyGoal?: number;
  onCallStyleChange?: (style: CallStyleType) => void;
  currentCallStyle?: CallStyleType;
}

export default function OutreachActionPlan({ 
  activeFilter = null, 
  onFilterChange,
  currentIndex = 0,
  isStartMode = true,
  hasStarted = false,
  onStart,
  connectionsMade = 0,
  dailyGoal = 30,
  onCallStyleChange,
  currentCallStyle = 'with-property'
}: OutreachActionPlanProps) {
  
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [agentType, setAgentType] = useState<'high' | 'mid' | 'low'>('high');
  const [callStyle, setCallStyle] = useState<'with-property' | 'without-property'>('with-property');
  const [includeNewAgents, setIncludeNewAgents] = useState(true);
  const [includeAssignedAgents, setIncludeAssignedAgents] = useState(true);
  const [focusMode, setFocusMode] = useState<'deal' | 'relationship'>('deal');
  const [practiceMode, setPracticeMode] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [practiceAgentTier, setPracticeAgentTier] = useState<'high' | 'mid' | 'low'>('mid');
  
  const connectionsCompleted = connectionsMade;
  const connectionsTotal = dailyGoal;
  
  const priorityCompleted = 2;
  const priorityTotal = 5;
  
  const topOfMindCompleted = 0;
  const topOfMindTotal = 3;
  
  const newRelationships = 1;
  const newRelationshipsGoal = currentCallStyle === 'without-property' ? 30 : 5;

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
              {currentCallStyle === 'without-property' ? 'Daily Goal: 30 Relationship Calls' : 'Weekly Goal: 5 New Agent Relationships'}
            </div>
            <p className="text-gray-300 mb-4">
              {currentCallStyle === 'without-property' 
                ? 'Focus on building relationships through conversations. No property needed - just connect and establish rapport.'
                : 'Build new connections with agents to expand your deal pipeline and increase your chances of closing more deals.'}
            </p>
            <div className="space-y-2 mb-4">
              <div>
                <span className="font-bold text-gray-300">• 1st Number:</span>{" "}
                <span className="text-gray-400">{currentCallStyle === 'without-property' ? 'Calls made today.' : 'Relationships built this week.'}</span>
              </div>
              <div>
                <span className="font-bold text-gray-300">• 2nd Number:</span>{" "}
                <span className="text-gray-400">{currentCallStyle === 'without-property' ? 'Your daily goal.' : 'Your weekly goal.'}</span>
              </div>
            </div>
            <div className="text-gray-400 italic border-t border-gray-700 pt-2 mt-2">
              Click to view your new agent relationships.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 mb-6">
        
        {/* Agent Relationships Section - Columns 1 & 2 */}
        <div className="col-span-2 p-6 bg-gradient-to-b from-blue-50/50 to-white rounded-l-xl border-r border-gray-200">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">Agent Relationships</h3>
          </div>
          
          {/* Circles Row */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            {/* Circle 1: Send Campaigns */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "relative w-28 h-28 transition-transform hover:scale-105",
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
            </div>

            {/* Circle 2: Call Priority Agents */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "relative w-28 h-28 transition-transform hover:scale-105",
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
            </div>
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex justify-center">
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
            <div className="flex justify-center">
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
          </div>
        </div>

        {/* New Deals Section - Column 3 */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-red-50/30 to-rose-50/20 rounded-r-xl relative">
          <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-4">New Deals</h3>
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
                stroke={isConnectionsComplete ? "#22c55e" : "#ef4444"}
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
            onClick={() => setShowRelationshipModal(true)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 mb-4",
              activeFilter === 'connections'
                ? "bg-white text-red-500 border-2 border-red-500 shadow-lg"
                : isConnectionsComplete 
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-white text-red-500 border-2 border-red-400 hover:bg-red-50"
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
                <Phone className="w-4 h-4" />
                <span>Chase Deals While Building Relationships</span>
              </>
            )}
          </button>
          
          {/* Three Chips Row */}
          <div className="flex gap-2 w-full">
            <div className="flex-1 relative group">
              <button
                onClick={() => setFocusMode('deal')}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded-lg transition border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                data-testid="button-focus-deal"
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  focusMode === 'deal' ? "bg-red-500 border-red-500" : "border-gray-300"
                )}>
                  {focusMode === 'deal' && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Focus on Deals</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-center">
                Filter to deals with agents assigned to you
              </div>
            </div>
            <div className="flex-1 relative group">
              <button
                onClick={() => setFocusMode('relationship')}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded-lg transition border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                data-testid="button-focus-relationship"
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  focusMode === 'relationship' ? "bg-red-500 border-red-500" : "border-gray-300"
                )}>
                  {focusMode === 'relationship' && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Focus on Relationships</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-center">
                Filter to new agent relationships
              </div>
            </div>
            <div className="flex-1 relative group">
              <button
                onClick={() => setShowPracticeModal(true)}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded-lg transition border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                data-testid="button-practice-mode"
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  practiceMode ? "bg-red-500 border-red-500" : "border-gray-300"
                )}>
                  {practiceMode && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Practice Mode</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-center">
                Practice calls using actual property and agent data based on transaction history for more realistic conversations
              </div>
            </div>
          </div>
        </div>

      </div>

      
      {/* Build New Relationships Modal */}
      {showRelationshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowRelationshipModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">Build New Relationships</h2>
                <button 
                  onClick={() => setShowRelationshipModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition"
                  data-testid="button-close-relationship-modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Configure how you want to start agent conversations.</p>

              {/* Section 1: Agent Pool */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-gray-700">1. Which agents should we include?</p>
                  <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                      Select which agent pool Command should pull from. This determines whether you are expanding new relationships or working existing assignments.
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="checkbox" 
                      checked={includeNewAgents}
                      onChange={(e) => setIncludeNewAgents(e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      data-testid="checkbox-new-agents"
                    />
                    <span className="text-sm text-gray-700">New agent relationships</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="checkbox" 
                      checked={includeAssignedAgents}
                      onChange={(e) => setIncludeAssignedAgents(e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      data-testid="checkbox-assigned-agents"
                    />
                    <span className="text-sm text-gray-700">Agents assigned to me</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Agent Type */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-gray-700">2. Who do you want to call?</p>
                  <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                      Choose the agent value tier. This affects conversation difficulty, expectations, and potential deal volume — not the properties shown.
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="agentType" 
                      checked={agentType === 'high'}
                      onChange={() => setAgentType('high')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-high-value"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">High-Value Agents</span>
                      <p className="text-xs text-gray-400 mt-0.5">Proven investor activity, higher standards, higher upside</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="agentType" 
                      checked={agentType === 'mid'}
                      onChange={() => setAgentType('mid')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-mid-value"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Mid-Value Agents</span>
                      <p className="text-xs text-gray-400 mt-0.5">Active agents building investor experience</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="agentType" 
                      checked={agentType === 'low'}
                      onChange={() => setAgentType('low')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-low-value"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Low-Value Agents (Practice)</span>
                      <p className="text-xs text-gray-400 mt-0.5">Lower risk, ideal for reps and confidence</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRelationshipModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                  data-testid="button-cancel-relationship"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRelationshipModal(false);
                    if (onCallStyleChange) {
                      onCallStyleChange(callStyle);
                    }
                    handleButtonClick('connections');
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#FF6600] hover:bg-[#e55c00] text-white text-sm font-bold rounded-lg transition"
                  data-testid="button-start-calling"
                >
                  Start Calling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Mode Modal */}
      {showPracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowPracticeModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">Practice Mode</h2>
                <button 
                  onClick={() => setShowPracticeModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition"
                  data-testid="button-close-practice-modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Select which agent tier you want to practice with.</p>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-gray-700">Select Agent Value Tier</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="practiceAgentTier" 
                      checked={practiceAgentTier === 'high'}
                      onChange={() => setPracticeAgentTier('high')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-practice-high"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">High-Value Agents</span>
                      <p className="text-xs text-gray-400 mt-0.5">Proven investor activity, higher standards, higher upside</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="practiceAgentTier" 
                      checked={practiceAgentTier === 'mid'}
                      onChange={() => setPracticeAgentTier('mid')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-practice-mid"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Mid-Value Agents</span>
                      <p className="text-xs text-gray-400 mt-0.5">Active agents building investor experience</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                    <input 
                      type="radio" 
                      name="practiceAgentTier" 
                      checked={practiceAgentTier === 'low'}
                      onChange={() => setPracticeAgentTier('low')}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                      data-testid="radio-practice-low"
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Low-Value Agents</span>
                      <p className="text-xs text-gray-400 mt-0.5">Lower risk, ideal for reps and confidence</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPracticeModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                  data-testid="button-cancel-practice"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setPracticeMode(true);
                    setShowPracticeModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition"
                  data-testid="button-start-practice"
                >
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

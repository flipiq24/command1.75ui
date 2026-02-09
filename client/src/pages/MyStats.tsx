import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { 
  Phone, 
  Users, 
  Calendar,
  ChevronDown,
  Send,
  Lightbulb,
  Plus,
  Mic,
  AudioLines,
  Trophy,
  Clock,
  Info,
  MessageSquare,
  Handshake,
  Home,
  Target,
  Mail,
  UserPlus,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

type DateFilter = 'yesterday' | 'today' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const DEAL_PIPELINE_STATS = {
  texts: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  emails: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  calls: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  offersSent: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  inNegotiations: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  accepted: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  acquired: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  }
};

const AGENT_OUTREACH_STATS = {
  texts: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  emails: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  calls: { 
    value: 0, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  newRelationships: { 
    value: 1, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] 
  },
  relationshipsUpgraded: { 
    value: 1, 
    percentDiff: 0, 
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] 
  }
};

const PERFORMANCE_STATS = {
  texts: {
    total: 0,
    dealPipeline: 0,
    agentOutreach: 0,
    teamAvg: 15,
    teamAvgPercent: 0
  },
  emails: {
    total: 0,
    dealPipeline: 0,
    agentOutreach: 0,
    teamAvg: 20,
    teamAvgPercent: 0
  },
  calls: { 
    total: 0, 
    conversations: 0, 
    connectedPercent: 0,
    avgCallTime: '0:00',
    dealPipeline: 0,
    agentOutreach: 0,
    teamAvg: 29,
    teamAvgPercent: 0
  },
  newRelationships: { 
    count: 1, 
    teamAvg: 3,
    teamAvgPercent: 33
  },
  relationshipsUpgraded: { 
    total: 1,
    priority: 1,
    hot: 0,
    warm: 0,
    teamAvg: 3,
    teamAvgPercent: 33
  },
  offersSent: { 
    sent: 0, 
    termsOut: 0, 
    contractSubmitted: 0,
    teamAvg: 2.7,
    teamAvgPercent: 0
  },
  inNegotiations: {
    count: 0,
    teamAvg: 1.5,
    teamAvgPercent: 0
  },
  offersAccepted: {
    count: 0,
    teamAvg: 0.8,
    teamAvgPercent: 0
  },
  acquired: {
    count: 0,
    teamAvg: 0.5,
    teamAvgPercent: 0
  },
  dealSource: {
    total: 0,
    mls: 0,
    directMail: 0,
    coldCall: 0,
    referral: 0,
    teamAvg: 2.5,
    teamAvgPercent: 0
  },
  time: { 
    totalHours: 16.1,
    piq: 0.5,
    comps: 4.7,
    investmentAnalysis: 9.1,
    offerTerms: 0.1,
    agents: 1.7,
    teamAvg: 2.2,
    teamAvgPercent: 100
  }
};

const TEAM_LEADERBOARD = [
  { 
    rank: 1, 
    name: 'Faisal Nazik', 
    texts: 0,
    emails: 0,
    calls: 0, 
    newRelationships: 0,
    relationshipsUpgraded: 0,
    offersSent: 0, 
    inNegotiations: 0, 
    offersAccepted: 0, 
    acquired: 0, 
    time: '0h',
    isUser: false 
  },
  { 
    rank: 2, 
    name: 'Haris Aqeel', 
    texts: 0,
    emails: 0,
    calls: 0, 
    newRelationships: 0,
    relationshipsUpgraded: 0,
    offersSent: 0, 
    inNegotiations: 0, 
    offersAccepted: 0, 
    acquired: 0, 
    time: '0h',
    isUser: false 
  }
];

const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 20;
  const padding = 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#10b981" : "#6b7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isPositive ? "0" : "3 2"}
      />
    </svg>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  unit,
  percentDiff, 
  chartData,
  tooltip,
  isLast = false
}: { 
  icon: React.ElementType;
  label: string;
  value: number;
  unit?: string;
  percentDiff: number;
  chartData: number[];
  tooltip?: React.ReactNode;
  isLast?: boolean;
}) => {
  const isPositive = percentDiff >= 0;
  const textColor = isPositive ? 'text-green-600' : 'text-red-500';
  const sign = isPositive ? '+' : '';

  return (
    <div className={cn(
      "flex-1 py-3 px-4",
      !isLast && "border-r border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
          <span className="text-[11px] font-medium text-gray-500">{label}</span>
          {tooltip && (
            <div className="relative group">
              <Info className="w-2.5 h-2.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
        <span className={cn("text-[10px]", textColor)}>
          {sign}{Math.abs(percentDiff).toFixed(0)}%
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-semibold text-gray-900">{value}</span>
          {unit && <span className="text-[10px] text-gray-400">{unit}</span>}
        </div>
        <MiniSparkline data={chartData} isPositive={isPositive} />
      </div>
    </div>
  );
};

const Tooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
  <div className="relative group inline-flex">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const getDefaultDateFilter = (): DateFilter => {
  const hour = new Date().getHours();
  return hour < 12 ? 'yesterday' : 'today';
};

const formatDateRange = (filter: DateFilter): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formatSingleDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const getWeekRange = (date: Date): string => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };
  
  switch(filter) {
    case 'yesterday':
      return formatSingleDate(yesterday);
    case 'today':
      return formatSingleDate(today);
    case 'weekly':
      return getWeekRange(today);
    case 'monthly':
      return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'yearly':
      return today.getFullYear().toString();
    case 'custom':
      return 'Select dates...';
    default:
      return formatSingleDate(today);
  }
};

const getFilterLabel = (filter: DateFilter): string => {
  switch(filter) {
    case 'yesterday': return 'Yesterday';
    case 'today': return 'Today';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'yearly': return 'Yearly';
    case 'custom': return 'Custom';
    default: return 'Today';
  }
};

const generateCoachMessage = (timeOfDay: 'morning' | 'afternoon' | 'evening'): string => {
  if (timeOfDay === 'morning') {
    return `Good morning, Josh! I'm your Performance Coach. Let's review yesterday's performance.

📊 Yesterday's Results:
✓ Calls: 0 (0% of target)
✓ New Relationships: 1 (33% of target)
✗ Offers Sent: 0 (0% of target) - 3 short of goal

Your biggest opportunity is Calls where you hit 0% of team average.

🎯 Recommended focus for today:
1. Make 29 calls to hit team average
2. Send 3 offer terms on ready deals
3. Follow up with 2 warm relationships

What would you like to dive deeper into?`;
  } else if (timeOfDay === 'afternoon') {
    return `Good afternoon, Josh! Here's your progress so far today.

📈 Today's Progress:
✓ Calls: 0/29 (0% complete)
- Offers: 0/3 - need 3 more to hit target
- Relationships: 1/3 - on track!

⏰ To hit your daily targets:
- 29 more calls needed (~60 minutes)
- 3 more offers to send
- 2 follow-ups pending

💡 Quick wins available:
- 2 deals ready for offer terms
- 1 warm relationship ready for upgrade

What would you like to focus on?`;
  } else {
    return `Great work today, Josh! Here's your end-of-day summary.

📋 Today's Final Results:
✓ Calls: 0 (0% of target) Missed
✓ Offers Sent: 0 (0% of target) Missed
✓ New Relationships: 1 (33% of target)
✓ Relationships Upgraded: 1
✓ Time Invested: 16.1 hours

🏆 Wins:
- Upgraded 1 relationship to Priority

📅 Tomorrow's Priorities (based on today):
1. Focus on calls - you were 100% below target
2. Send 3 offer terms on ready deals
3. 2 hot relationships ready for outreach

See you tomorrow! 🚀`;
  }
};

function MyStatsContent() {
  const [dateFilter, setDateFilter] = useState<DateFilter>(getDefaultDateFilter);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: generateCoachMessage(timeOfDay)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('call') || lowerMessage.includes('calls')) {
        response = `Call Statistics:\n\nYou made 0 calls with 0 conversations (0% connected).\nAverage call time: 0:00\n\nBreakdown:\n• Deal Pipeline: 0\n• Agent Outreach: 0\n\n0% of Team Average (Team Avg = 29)`;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('offers')) {
        response = `Offer Pipeline:\n\n• Offers Sent: 0 (0% of Team Avg)\n• In Negotiations: 0 (0% of Team Avg)\n• Offers Accepted: 0 (0% of Team Avg)\n• Acquired: 0 (0% of Team Avg)\n\nYour conversion rate from sent to acquired: N/A`;
      } else if (lowerMessage.includes('relationship') || lowerMessage.includes('agent')) {
        response = `Relationship Statistics:\n\n• New Relationships: 1\n• Upgraded Relationships: 1\n  - Priority: 1\n  - Hot: 0\n  - Warm: 0\n\n33% of Team Average (Team Avg = 3)`;
      } else if (lowerMessage.includes('negotiat')) {
        response = `Negotiations Status:\n\n• Currently In Negotiations: 0 deals\n• 0% of Team Average (Team Avg = 1.5)\n\nNo deals currently being negotiated.`;
      } else if (lowerMessage.includes('acquired') || lowerMessage.includes('closed')) {
        response = `Acquired Deals:\n\n• Acquired: 0\n• 0% of Team Average (Team Avg = 0.5)\n\nNo deals closed yet this period.`;
      } else if (lowerMessage.includes('time')) {
        response = `Time Statistics:\n\nTotal: 16.1 hours\n\nBreakdown:\n• PIQ: 0.5 hrs\n• Comps: 4.7 hrs\n• Investment Analysis: 9.1 hrs\n• Offer Terms: 0.1 hrs\n• Agents: 1.7 hrs\n\n100% of Team Average (Team Avg = 2.2 hrs)`;
      } else if (lowerMessage.includes('text') || lowerMessage.includes('email')) {
        response = `Communication Statistics:\n\nTexts:\n• Total: 0\n• Deal Pipeline: 0\n• Agent Outreach: 0\n\nEmails:\n• Total: 0\n• Deal Pipeline: 0\n• Agent Outreach: 0\n\n0% of Team Average`;
      } else if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('help')) {
        response = `Here's your improvement plan:\n\n1. Focus on Calls - You're at 0% of team average\n   → Make 29 calls to hit team average\n\n2. Send more offers - 3 deals may be ready\n   → Review PIQ for offer-ready deals\n\n3. Upgrade relationships - 1 warm contact ready\n   → Schedule follow-up calls\n\nWant me to dive deeper into any of these?`;
      } else {
        response = `I can help you understand your acquisition pipeline! Try asking about:\n\n• "How are my calls looking?"\n• "Show me my offer pipeline"\n• "How am I doing on relationships?"\n• "What about my texts and emails?"\n• "How did I spend my time?"\n• "How can I improve?"`;
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: response
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const dateFilterOptions: DateFilter[] = ['yesterday', 'today', 'weekly', 'monthly', 'yearly', 'custom'];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">My Stats</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
              data-testid="date-filter-dropdown"
            >
              <span>{getFilterLabel(dateFilter)}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showDateDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                {dateFilterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setDateFilter(option);
                      setShowDateDropdown(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                      dateFilter === option && "bg-gray-50 font-medium"
                    )}
                    data-testid={`date-filter-${option}`}
                  >
                    {getFilterLabel(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDateRange(dateFilter)}</span>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Open all stats
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-6 pb-24 overflow-y-auto">
        {/* Team Leaderboard - TOP */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Team Leaderboard
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-1 px-2 text-left font-normal text-gray-400" rowSpan={2}></th>
                  <th className="py-1 px-2 text-left font-normal text-gray-400" rowSpan={2}>Name</th>
                  <th className="py-1 px-1 text-center font-semibold text-gray-400 uppercase tracking-wider text-[9px] border-b border-gray-100" colSpan={3}>Communication</th>
                  <th className="py-1 px-1 text-center font-semibold text-gray-400 uppercase tracking-wider text-[9px] border-b border-gray-100 border-l border-gray-100" colSpan={2}>Relationships</th>
                  <th className="py-1 px-1 text-center font-semibold text-gray-400 uppercase tracking-wider text-[9px] border-b border-gray-100 border-l border-gray-100" colSpan={4}>Deal Progress</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400 border-l border-gray-100" rowSpan={2}>Time</th>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Texts</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Emails</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Calls</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400 border-l border-gray-100">New</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Upgr.</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400 border-l border-gray-100">Offers</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Negot.</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Accept.</th>
                  <th className="py-1 px-1 text-center font-normal text-gray-400">Acq.</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_LEADERBOARD.map((member) => (
                  <tr 
                    key={member.rank}
                    className={cn(
                      "transition",
                      member.isUser ? "bg-orange-50" : "hover:bg-gray-50"
                    )}
                    data-testid={`leaderboard-row-${member.rank}`}
                  >
                    <td className="py-2 px-2 text-center text-gray-400 text-[10px]">
                      {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                    </td>
                    <td className={cn("py-2 px-2 font-medium text-xs whitespace-nowrap", member.isUser ? "text-orange-600" : "text-gray-700")}>
                      {member.name}
                    </td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.texts}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.emails}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.calls}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900 border-l border-gray-100">{member.newRelationships}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.relationshipsUpgraded}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900 border-l border-gray-100">{member.offersSent}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.inNegotiations}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.offersAccepted}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900">{member.acquired}</td>
                    <td className="py-2 px-1 text-center font-semibold text-gray-900 border-l border-gray-100">{member.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deal Pipeline & Agent Outreach - Side by Side Stats */}
        <div className="grid grid-cols-2 gap-6 mb-6 flex-shrink-0">
          {/* DEAL PIPELINE Column */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Pipeline</span>
              <Tooltip content={<p>This information is specific to deals that are in your pipeline assigned to you</p>}>
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, label: 'Texts', stat: DEAL_PIPELINE_STATS.texts, tip: 'Text messages sent on deals in your pipeline' },
                { icon: Mail, label: 'Emails', stat: DEAL_PIPELINE_STATS.emails, tip: 'Emails sent on deals in your pipeline' },
                { icon: Phone, label: 'Calls', stat: DEAL_PIPELINE_STATS.calls, tip: 'Calls made on deals in your pipeline' },
                { icon: Send, label: 'Offers Sent', stat: DEAL_PIPELINE_STATS.offersSent, tip: 'Offer Terms Sent + Contract Submitted' },
                { icon: MessageSquare, label: 'In Negotiations', stat: DEAL_PIPELINE_STATS.inNegotiations, tip: 'Deals currently being negotiated' },
                { icon: Handshake, label: 'Accepted', stat: DEAL_PIPELINE_STATS.accepted, tip: 'Offers accepted, under contract' },
                { icon: Home, label: 'Acquired', stat: DEAL_PIPELINE_STATS.acquired, tip: 'Deals closed and acquired' },
              ].map((item, idx) => {
                const Icon = item.icon;
                const isPositive = item.stat.percentDiff >= 0;
                const sign = isPositive ? '+' : '';
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <Tooltip content={<p>{item.tip}</p>}>
                        <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{item.stat.value}</span>
                      <span className={cn("text-[10px]", isPositive ? "text-green-600" : "text-red-500")}>
                        {sign}{Math.abs(item.stat.percentDiff).toFixed(0)}%
                      </span>
                      <MiniSparkline data={item.stat.chartData} isPositive={isPositive} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AGENT OUTREACH Column */}
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent Outreach</span>
              <Tooltip content={<p>Communication metrics for agent relationship building</p>}>
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, label: 'Texts', stat: AGENT_OUTREACH_STATS.texts, tip: 'Text messages sent to agents' },
                { icon: Mail, label: 'Emails', stat: AGENT_OUTREACH_STATS.emails, tip: 'Emails sent to agents' },
                { icon: Phone, label: 'Calls', stat: AGENT_OUTREACH_STATS.calls, tip: 'Calls made to agents' },
                { icon: UserPlus, label: 'New Relationships', stat: AGENT_OUTREACH_STATS.newRelationships, tip: 'Brand new agent relationships created' },
                { icon: TrendingUp, label: 'Rel. Upgraded', stat: AGENT_OUTREACH_STATS.relationshipsUpgraded, tip: 'Existing relationships upgraded to higher tier' },
              ].map((item, idx) => {
                const Icon = item.icon;
                const isPositive = item.stat.percentDiff >= 0;
                const sign = isPositive ? '+' : '';
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <Tooltip content={<p>{item.tip}</p>}>
                        <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{item.stat.value}</span>
                      <span className={cn("text-[10px]", isPositive ? "text-green-600" : "text-red-500")}>
                        {sign}{Math.abs(item.stat.percentDiff).toFixed(0)}%
                      </span>
                      <MiniSparkline data={item.stat.chartData} isPositive={isPositive} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Report - Organized by Category */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Report</h3>
          
          {/* COMMUNICATION */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Communication</span>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Texts</span>
                  <Tooltip content={<p>Total text messages sent (Deal Pipeline + Agent Outreach)</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.texts.total}</span>
                  <span className="text-[10px] text-gray-400">texts</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>Deal Pipeline: {PERFORMANCE_STATS.texts.dealPipeline}</div>
                  <div>Agent Outreach: {PERFORMANCE_STATS.texts.agentOutreach}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.texts.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.texts.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.texts.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Emails</span>
                  <Tooltip content={<p>Total emails sent (Deal Pipeline + Agent Outreach)</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.emails.total}</span>
                  <span className="text-[10px] text-gray-400">emails</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>Deal Pipeline: {PERFORMANCE_STATS.emails.dealPipeline}</div>
                  <div>Agent Outreach: {PERFORMANCE_STATS.emails.agentOutreach}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.emails.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.emails.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.emails.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Calls</span>
                  <Tooltip content={<p>Total calls made (Deal Pipeline + Agent Outreach)</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.calls.total}</span>
                  <span className="text-[10px] text-gray-400">calls</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>Conv: {PERFORMANCE_STATS.calls.conversations} ({PERFORMANCE_STATS.calls.connectedPercent}%)</div>
                  <div>Avg: {PERFORMANCE_STATS.calls.avgCallTime}</div>
                  <div>Deal Pipeline: {PERFORMANCE_STATS.calls.dealPipeline}</div>
                  <div>Agent Outreach: {PERFORMANCE_STATS.calls.agentOutreach}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.calls.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.calls.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.calls.teamAvg})
                </div>
              </div>
            </div>
          </div>

          {/* RELATIONSHIPS */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Relationships</span>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <UserPlus className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">New Relationships</span>
                  <Tooltip content={<p>Brand new agent relationships created during this period</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.newRelationships.count}</span>
                  <span className="text-[10px] text-gray-400">new</span>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.newRelationships.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.newRelationships.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.newRelationships.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Upgraded</span>
                  <Tooltip content={<p>Existing agent relationships upgraded to higher tier</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.relationshipsUpgraded.total}</span>
                  <span className="text-[10px] text-gray-400">upgraded</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>Priority: {PERFORMANCE_STATS.relationshipsUpgraded.priority}</div>
                  <div>Hot: {PERFORMANCE_STATS.relationshipsUpgraded.hot}</div>
                  <div>Warm: {PERFORMANCE_STATS.relationshipsUpgraded.warm}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.relationshipsUpgraded.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.relationshipsUpgraded.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.relationshipsUpgraded.teamAvg})
                </div>
              </div>
            </div>
          </div>

          {/* DEAL PROGRESS */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Deal Progress</span>
            <div className="grid grid-cols-4 gap-3 mt-2">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Send className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Offers Sent</span>
                  <Tooltip content={<p>Offer Terms Sent + Contract Submitted</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.offersSent.sent}</span>
                  <span className="text-[10px] text-gray-400">sent</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>Terms: {PERFORMANCE_STATS.offersSent.termsOut}</div>
                  <div>Contract: {PERFORMANCE_STATS.offersSent.contractSubmitted}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.offersSent.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.offersSent.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.offersSent.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Negotiations</span>
                  <Tooltip content={<p>Offers received and currently being negotiated</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.inNegotiations.count}</span>
                  <span className="text-[10px] text-gray-400">deals</span>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.inNegotiations.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.inNegotiations.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.inNegotiations.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Handshake className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Accepted</span>
                  <Tooltip content={<p>Negotiation successful - Under contract</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.offersAccepted.count}</span>
                  <span className="text-[10px] text-gray-400">accepted</span>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.offersAccepted.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.offersAccepted.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.offersAccepted.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Home className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Acquired</span>
                  <Tooltip content={<p>Deals closed and acquired</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-600">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.acquired.count}</span>
                  <span className="text-[10px] text-gray-400">closed</span>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.acquired.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.acquired.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.acquired.teamAvg})
                </div>
              </div>
            </div>
          </div>

          {/* OTHER */}
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Other</span>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Deal Source</span>
                  <Tooltip content={<p>Where acquired deals originated from</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.dealSource.total}</span>
                  <span className="text-[10px] text-gray-400">total</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>MLS: {PERFORMANCE_STATS.dealSource.mls}</div>
                  <div>Direct Mail: {PERFORMANCE_STATS.dealSource.directMail}</div>
                  <div>Cold Call: {PERFORMANCE_STATS.dealSource.coldCall}</div>
                  <div>Referral: {PERFORMANCE_STATS.dealSource.referral}</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.dealSource.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.dealSource.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.dealSource.teamAvg})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Time</span>
                  <Tooltip content={<p>Total time spent across all modules</p>}>
                    <Info className="w-2.5 h-2.5 text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900">{PERFORMANCE_STATS.time.totalHours}</span>
                  <span className="text-[10px] text-gray-400">hours</span>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <div>PIQ: {PERFORMANCE_STATS.time.piq} hrs</div>
                  <div>Comps: {PERFORMANCE_STATS.time.comps} hrs</div>
                  <div>Inv Anly: {PERFORMANCE_STATS.time.investmentAnalysis} hrs</div>
                  <div>Offer: {PERFORMANCE_STATS.time.offerTerms} hrs</div>
                  <div>Agents: {PERFORMANCE_STATS.time.agents} hrs</div>
                </div>
                <div className={cn("text-[10px] font-medium pt-1", PERFORMANCE_STATS.time.teamAvgPercent >= 100 ? "text-green-600" : "text-red-500")}>
                  {PERFORMANCE_STATS.time.teamAvgPercent}% of Team Avg ({PERFORMANCE_STATS.time.teamAvg} hrs)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Section - Fills remaining space */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 flex-1 min-h-0 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-orange-500" />
            AI Performance Coach
          </h3>
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'ai' && (
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2">
                        <p className="text-xs text-gray-700 whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'user' && (
                    <div className="bg-[#FF6600] text-white rounded-xl rounded-tr-sm px-3 py-2 max-w-[70%]">
                      <p className="text-xs">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="mt-3 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
              <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your stats..."
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400"
                data-testid="coach-input"
              />
              <Mic className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              <AudioLines className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            <button
              onClick={handleSend}
              className="w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center hover:bg-[#FF7722] transition"
              data-testid="coach-send-button"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyStats() {
  return <MyStatsContent />;
}

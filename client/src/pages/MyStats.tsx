import React, { useState, useRef, useEffect } from 'react';
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
  Home
} from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

const MOCK_STATS = {
  calls: {
    value: 32,
    percentDiff: 7.0,
    chartData: [28, 30, 29, 31, 30, 32, 29, 30, 31, 30, 32, 31, 30, 32]
  },
  relationships: {
    value: 3,
    percentDiff: -50.0,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  },
  offersSent: {
    value: 3,
    percentDiff: 7.7,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  },
  inNegotiations: {
    value: 2,
    percentDiff: 15.0,
    chartData: [1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2]
  },
  offersAccepted: {
    value: 1,
    percentDiff: 25.0,
    chartData: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1]
  },
  acquired: {
    value: 1,
    percentDiff: 50.0,
    chartData: [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1]
  },
  time: {
    value: 145,
    percentDiff: 12.5,
    chartData: [120, 135, 140, 145, 130, 145, 140, 135, 145, 150, 145, 140, 145, 145]
  }
};

const DAILY_STATS = {
  calls: { 
    total: 32, 
    conversations: 8, 
    connectedPercent: 25,
    avgCallTime: '2:37',
    texts: 12, 
    emails: 15,
    teamAvg: 29,
    teamAvgPercent: 107
  },
  relationships: { 
    newRelationships: 3, 
    upgrades: 3,
    priority: 1,
    hot: 0,
    warm: 2,
    cold: 0,
    teamAvg: 6,
    teamAvgPercent: 50
  },
  offersSent: { 
    sent: 3, 
    termsOut: 3, 
    contractSubmitted: 0,
    teamAvg: 2.7,
    teamAvgPercent: 107
  },
  inNegotiations: {
    count: 2,
    teamAvg: 1.5,
    teamAvgPercent: 133
  },
  offersAccepted: {
    count: 1,
    teamAvg: 0.8,
    teamAvgPercent: 125
  },
  acquired: {
    count: 1,
    teamAvg: 0.5,
    teamAvgPercent: 200
  },
  time: { 
    totalMinutes: 145,
    piq: 42,
    comps: 78,
    investmentAnalysis: 5,
    offerTerms: 25,
    agents: 10,
    teamAvg: 130,
    teamAvgPercent: 112
  }
};

const TEAM_LEADERBOARD = [
  { rank: 1, name: 'Maria', calls: 38, relationships: 6, offersSent: 5, inNegotiations: 3, offersAccepted: 2, acquired: 1, time: 180, isUser: false },
  { rank: 2, name: 'Tony (You)', calls: 32, relationships: 3, offersSent: 3, inNegotiations: 2, offersAccepted: 1, acquired: 1, time: 145, isUser: true },
  { rank: 3, name: 'James', calls: 28, relationships: 4, offersSent: 3, inNegotiations: 2, offersAccepted: 1, acquired: 0, time: 160, isUser: false },
  { rank: 4, name: 'Sarah', calls: 30, relationships: 5, offersSent: 2, inNegotiations: 1, offersAccepted: 1, acquired: 1, time: 155, isUser: false },
  { rank: 5, name: 'Mike', calls: 25, relationships: 3, offersSent: 2, inNegotiations: 1, offersAccepted: 0, acquired: 0, time: 140, isUser: false },
  { rank: 6, name: 'Jennifer', calls: 22, relationships: 2, offersSent: 1, inNegotiations: 1, offersAccepted: 0, acquired: 0, time: 130, isUser: false },
  { rank: 7, name: 'David', calls: 18, relationships: 1, offersSent: 1, inNegotiations: 0, offersAccepted: 0, acquired: 0, time: 120, isUser: false },
  { rank: 8, name: 'Lisa', calls: 15, relationships: 2, offersSent: 0, inNegotiations: 0, offersAccepted: 0, acquired: 0, time: 110, isUser: false }
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

function MyStatsContent() {
  const [dateRange] = useState('Weekly');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hey Tony! Here's your acquisition pipeline overview.\n\nYou're currently #2 on the team leaderboard. Your pipeline shows:\n• Calls: 32 (107% of Team Avg)\n• Relationships: 3 new\n• Offers Sent: 3\n• In Negotiations: 2\n• Offers Accepted: 1\n• Acquired: 1\n\nGreat conversion rate from negotiations to accepted!`
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
        response = `Call Statistics:\n\nToday you made 32 calls with 8 conversations (25% connected).\nAverage call time: 2:37\n\nBreakdown:\n• Connected: 8 (25%)\n• Texts: 12\n• Emails: 15\n\n107% of Team Average (Team Avg = 29)`;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('offers')) {
        response = `Offer Pipeline:\n\n• Offers Sent: 3 (107% of Team Avg)\n• In Negotiations: 2 (133% of Team Avg)\n• Offers Accepted: 1 (125% of Team Avg)\n• Acquired: 1 (200% of Team Avg)\n\nYour conversion rate from sent to acquired: 33%`;
      } else if (lowerMessage.includes('relationship') || lowerMessage.includes('agent')) {
        response = `Relationship Statistics:\n\n• New Relationships: 3\n• Upgraded Relationships: 3\n  - Priority: 1\n  - Hot: 0\n  - Warm: 2\n\n50% of Team Average (Team Avg = 6)`;
      } else if (lowerMessage.includes('negotiat')) {
        response = `Negotiations Status:\n\n• Currently In Negotiations: 2 deals\n• 133% of Team Average (Team Avg = 1.5)\n\nThese are offers that have been received and are actively being negotiated.`;
      } else if (lowerMessage.includes('acquired') || lowerMessage.includes('closed')) {
        response = `Acquired Deals:\n\n• Acquired Today: 1\n• 200% of Team Average (Team Avg = 0.5)\n\nExcellent! You're closing at twice the team rate.`;
      } else if (lowerMessage.includes('time')) {
        response = `Time Statistics:\n\nTotal: 145 minutes\n\nBreakdown:\n• PIQ: 42 min\n• Comps: 78 min\n• Investment Analysis: 5 min\n• Offer Terms: 25 min\n• Agents: 10 min\n\n112% of Team Average (Team Avg = 130)`;
      } else {
        response = `I can help you understand your acquisition pipeline! Try asking about:\n\n• "How are my calls looking?"\n• "Show me my offer pipeline"\n• "How am I doing on relationships?"\n• "What's my negotiation status?"\n• "How many deals have I acquired?"\n• "How did I spend my time?"`;
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

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">My Stats</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Nov 17 - Nov 23, 2025</span>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Open all stats
          </button>
        </div>
      </div>

      {/* Stats Cards - WORKFLOW ORDER: Calls → Relationships → Offers Sent → In Negotiations → Offers Accepted → Acquired → Time */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        <StatCard
          icon={Phone}
          label="Calls"
          value={MOCK_STATS.calls.value}
          percentDiff={MOCK_STATS.calls.percentDiff}
          chartData={MOCK_STATS.calls.chartData}
          tooltip={<p>Total outbound calls placed today.</p>}
        />
        <StatCard
          icon={Users}
          label="Relationships"
          value={MOCK_STATS.relationships.value}
          percentDiff={MOCK_STATS.relationships.percentDiff}
          chartData={MOCK_STATS.relationships.chartData}
          tooltip={<p>New relationships created today.</p>}
        />
        <StatCard
          icon={Send}
          label="Offers Sent"
          value={MOCK_STATS.offersSent.value}
          percentDiff={MOCK_STATS.offersSent.percentDiff}
          chartData={MOCK_STATS.offersSent.chartData}
          tooltip={<p>Offer Terms Sent + Contract Submitted.</p>}
        />
        <StatCard
          icon={MessageSquare}
          label="In Negotiations"
          value={MOCK_STATS.inNegotiations.value}
          percentDiff={MOCK_STATS.inNegotiations.percentDiff}
          chartData={MOCK_STATS.inNegotiations.chartData}
          tooltip={<p>Offers currently being negotiated.</p>}
        />
        <StatCard
          icon={Handshake}
          label="Accepted"
          value={MOCK_STATS.offersAccepted.value}
          percentDiff={MOCK_STATS.offersAccepted.percentDiff}
          chartData={MOCK_STATS.offersAccepted.chartData}
          tooltip={<p>Offers accepted, under contract.</p>}
        />
        <StatCard
          icon={Home}
          label="Acquired"
          value={MOCK_STATS.acquired.value}
          percentDiff={MOCK_STATS.acquired.percentDiff}
          chartData={MOCK_STATS.acquired.chartData}
          tooltip={<p>Deals closed and acquired.</p>}
        />
        <StatCard
          icon={Clock}
          label="Time"
          value={MOCK_STATS.time.value}
          unit="min"
          percentDiff={MOCK_STATS.time.percentDiff}
          chartData={MOCK_STATS.time.chartData}
          tooltip={<p>Total time spent across all modules.</p>}
          isLast
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-6 pb-24 overflow-y-auto">
        {/* Team Leaderboard - WORKFLOW ORDER */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Team Leaderboard Today
          </h3>
          
          {/* Column Headers */}
          <div className="flex items-center py-2 px-2 text-[10px] text-gray-400 border-b border-gray-100 mb-1">
            <div className="flex items-center gap-2 w-28 flex-shrink-0">
              <span className="w-5"></span>
              <span>Name</span>
            </div>
            <div className="flex-1 grid grid-cols-7 gap-1 text-center">
              <span>Calls</span>
              <span>Relations</span>
              <span>Offers</span>
              <span>Negot.</span>
              <span>Accepted</span>
              <span>Acquired</span>
              <span>Time</span>
            </div>
          </div>

          <div className="space-y-0.5">
            {TEAM_LEADERBOARD.map((member) => (
              <div 
                key={member.rank}
                className={cn(
                  "flex items-center py-1.5 px-2 rounded transition text-xs",
                  member.isUser ? "bg-orange-50" : "hover:bg-gray-50"
                )}
                data-testid={`leaderboard-row-${member.rank}`}
              >
                <div className="flex items-center gap-2 w-28 flex-shrink-0">
                  <span className="w-5 text-center text-gray-400 text-[10px]">
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                  </span>
                  <span className={cn("font-medium text-xs truncate", member.isUser ? "text-orange-600" : "text-gray-700")}>
                    {member.name}
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500">
                  <span><strong className="text-gray-900">{member.calls}</strong></span>
                  <span><strong className="text-gray-900">{member.relationships}</strong></span>
                  <span><strong className="text-gray-900">{member.offersSent}</strong></span>
                  <span><strong className="text-gray-900">{member.inNegotiations}</strong></span>
                  <span><strong className="text-gray-900">{member.offersAccepted}</strong></span>
                  <span><strong className="text-gray-900">{member.acquired}</strong></span>
                  <span><strong className="text-gray-900">{member.time}</strong>m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Performance Report - WORKFLOW ORDER */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Performance Report</h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* 1. CALLS */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Calls</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Calls</p>
                    <p className="text-gray-300 text-[10px]">Source: My Stats → IDX Note (call agent)</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.calls.total}</span>
                <span className="text-xs text-gray-400">calls</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Conversations: {DAILY_STATS.calls.conversations} ({DAILY_STATS.calls.connectedPercent}% connected)</div>
                <div>Avg Call Time: {DAILY_STATS.calls.avgCallTime}</div>
                <div>Texts: {DAILY_STATS.calls.texts}</div>
                <div>Emails: {DAILY_STATS.calls.emails}</div>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.calls.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.calls.teamAvg})
              </div>
            </div>

            {/* 2. RELATIONSHIPS */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Relationships</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Relationships</p>
                    <p className="text-gray-300 text-[10px]">New = Total Added Today (not upgrades)</p>
                    <p className="text-gray-300 text-[10px]">Upgraded = Tier increases</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.relationships.newRelationships}</span>
                <span className="text-xs text-gray-400">new</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Upgraded: {DAILY_STATS.relationships.upgrades}</div>
                <div className="pl-2">Priority: {DAILY_STATS.relationships.priority}</div>
                <div className="pl-2">Hot: {DAILY_STATS.relationships.hot}</div>
                <div className="pl-2">Warm: {DAILY_STATS.relationships.warm}</div>
              </div>
              <div className="text-xs text-red-500 font-medium pt-1">
                {DAILY_STATS.relationships.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.relationships.teamAvg})
              </div>
            </div>

            {/* 3. OFFERS SENT */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Send className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Offers Sent</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Offers Sent</p>
                    <p className="text-gray-300 text-[10px]">= Offer Terms Sent + Contract Submitted</p>
                    <p className="text-gray-400 text-[10px]">Source: Offer Status Change KPIs</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.offersSent.sent}</span>
                <span className="text-xs text-gray-400">sent</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Offer Terms Sent: {DAILY_STATS.offersSent.termsOut}</div>
                <div>Contract Submitted: {DAILY_STATS.offersSent.contractSubmitted}</div>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.offersSent.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.offersSent.teamAvg})
              </div>
            </div>

            {/* 4. IN NEGOTIATIONS */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">In Negotiations</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">In Negotiations</p>
                    <p className="text-gray-300 text-[10px]">Offers received and being negotiated.</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.inNegotiations.count}</span>
                <span className="text-xs text-gray-400">deals</span>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.inNegotiations.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.inNegotiations.teamAvg})
              </div>
            </div>
          </div>

          {/* Second row: Offers Accepted, Acquired, Time */}
          <div className="grid grid-cols-4 gap-4">
            {/* 5. OFFERS ACCEPTED */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Handshake className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Offers Accepted</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Offers Accepted</p>
                    <p className="text-gray-300 text-[10px]">Negotiation successful → Under contract.</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.offersAccepted.count}</span>
                <span className="text-xs text-gray-400">accepted</span>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.offersAccepted.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.offersAccepted.teamAvg})
              </div>
            </div>

            {/* 6. ACQUIRED */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Home className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Acquired</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Acquired</p>
                    <p className="text-gray-300 text-[10px]">Deal closed and acquired.</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.acquired.count}</span>
                <span className="text-xs text-gray-400">closed</span>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.acquired.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.acquired.teamAvg})
              </div>
            </div>

            {/* 7. TIME - with full breakdown */}
            <div className="space-y-2 col-span-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time</span>
                <Tooltip content={
                  <div className="space-y-1">
                    <p className="font-medium">Time Spent</p>
                    <p className="text-gray-300 text-[10px]">= SUM of all module minutes for today</p>
                    <p className="text-gray-400 text-[10px]">Source: Time Spent per Module</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.time.totalMinutes}</span>
                <span className="text-xs text-gray-400">minutes</span>
              </div>
              <div className="text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-0.5">
                <div>PIQ: {DAILY_STATS.time.piq}</div>
                <div>Comps: {DAILY_STATS.time.comps}</div>
                <div>Investment Analysis: {DAILY_STATS.time.investmentAnalysis}</div>
                <div>Offer Terms: {DAILY_STATS.time.offerTerms}</div>
                <div>Agents: {DAILY_STATS.time.agents}</div>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.time.teamAvgPercent}% of Team Average (Team Avg = {DAILY_STATS.time.teamAvg})
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Section - Fills remaining space */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 flex-1 min-h-0 flex flex-col">
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
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Input Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="max-w-3xl mx-auto">
          <div 
            className="flex items-center gap-2 bg-white rounded-full px-4 py-3 border border-gray-200"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), 0 -1px 0 rgba(255, 255, 255, 0.8) inset',
              background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
            }}
          >
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-100">
              <Plus className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your stats..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              data-testid="input-stats-chat"
            />
            
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-100">
              <Mic className="w-4 h-4" />
            </button>
            
            {inputValue.trim() ? (
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="w-9 h-9 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition shadow-md"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                data-testid="button-send-stats"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="w-9 h-9 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition shadow-md"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                data-testid="button-voice-stats"
              >
                <AudioLines className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyStats() {
  return <MyStatsContent />;
}

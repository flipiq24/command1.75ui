import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { 
  Phone, 
  MessageSquare, 
  FileText, 
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
  Info
} from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

const MOCK_STATS = {
  offers: {
    value: 3,
    percentDiff: 7.7,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  },
  communication: {
    value: 32,
    percentDiff: 7.0,
    chartData: [28, 30, 29, 31, 30, 32, 29, 30, 31, 30, 32, 31, 30, 32]
  },
  relationships: {
    value: 3,
    percentDiff: -50.0,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  },
  time: {
    value: 145,
    percentDiff: 12.5,
    chartData: [120, 135, 140, 145, 130, 145, 140, 135, 145, 150, 145, 140, 145, 145]
  }
};

const DAILY_STATS = {
  offers: { 
    sent: 3, 
    termsOut: 3, 
    contractSubmitted: 0,
    negotiations: 2,
    teamAvgPercent: 107
  },
  communication: { 
    calls: 32, 
    conversations: 8, 
    connectedPercent: 25,
    avgCallTime: '2:37',
    texts: 12, 
    emails: 15,
    teamAvgPercent: 107
  },
  relationships: { 
    newRelationships: 3, 
    upgrades: 3,
    priority: 1,
    hot: 0,
    warm: 2,
    cold: 0,
    teamAvgPercent: 50
  },
  time: { 
    totalMinutes: 145,
    piq: 42,
    comps: 78,
    investmentAnalysis: 5,
    offerTerms: 25,
    agents: 10
  }
};

const TEAM_LEADERBOARD = [
  { rank: 1, name: 'Maria', offers: 5, calls: 38, relationships: 6, time: 180, isUser: false },
  { rank: 2, name: 'Tony (You)', offers: 3, calls: 32, relationships: 3, time: 145, isUser: true },
  { rank: 3, name: 'James', offers: 3, calls: 28, relationships: 4, time: 160, isUser: false },
  { rank: 4, name: 'Sarah', offers: 2, calls: 30, relationships: 5, time: 155, isUser: false },
  { rank: 5, name: 'Mike', offers: 2, calls: 25, relationships: 3, time: 140, isUser: false },
  { rank: 6, name: 'Jennifer', offers: 1, calls: 22, relationships: 2, time: 130, isUser: false },
  { rank: 7, name: 'David', offers: 1, calls: 18, relationships: 1, time: 120, isUser: false },
  { rank: 8, name: 'Lisa', offers: 0, calls: 15, relationships: 2, time: 110, isUser: false }
];

const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 24;
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
  isLast = false
}: { 
  icon: React.ElementType;
  label: string;
  value: number;
  unit?: string;
  percentDiff: number;
  chartData: number[];
  isLast?: boolean;
}) => {
  const isPositive = percentDiff > 0;
  const textColor = isPositive ? 'text-green-600' : 'text-red-500';
  const sign = isPositive ? '+' : '';

  return (
    <div className={cn(
      "flex-1 py-4 px-5",
      !isLast && "border-r border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <span className="text-xs font-medium text-gray-500">{label}</span>
        </div>
        <span className={cn("text-xs", textColor)}>
          {sign}{Math.abs(percentDiff).toFixed(1)}% than average
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
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
      content: `Hey Tony! Here's your performance overview.\n\nYou're currently #2 on the team leaderboard with 3 offers and 32 calls today. Great job on exceeding your conversation goal!\n\nToday's Highlights:\n• Offers: 3 sent (107% of Team Avg)\n• Calls: 32 (25% connected)\n• Relationships: 3 new\n\nAsk me anything about your stats, trends, or how to improve!`
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
        response = `Call Statistics:\n\nToday you made 32 calls with 8 conversations (25% connected).\nAverage call time: 2:37\n\nBreakdown:\n• Connected: 8\n• Texts: 12\n• Emails: 15\n\n107% of Team Average`;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('offers')) {
        response = `Offer Statistics:\n\nToday you sent 3 offers (107% of Team Avg)\n\nBreakdown:\n• Offer Terms Sent: 3\n• Contract Submitted: 0\n• In Negotiations: 2\n\nData Source: My Stats → Offer Status Change KPIs`;
      } else if (lowerMessage.includes('relationship') || lowerMessage.includes('agent')) {
        response = `Relationship Statistics:\n\nToday's Progress:\n• New Relationships: 3\n• Upgraded Relationships: 3\n  - Priority: 1\n  - Hot: 0\n  - Warm: 2\n  - Cold: 0\n\n50% of Team Average`;
      } else if (lowerMessage.includes('team') || lowerMessage.includes('leaderboard') || lowerMessage.includes('rank')) {
        response = `Team Leaderboard:\n\n1. Maria - 5 offers, 38 calls, 6 relationships\n2. Tony (You) - 3 offers, 32 calls, 3 relationships\n3. James - 3 offers, 28 calls, 4 relationships\n4. Sarah - 2 offers, 30 calls, 5 relationships\n5. Mike - 2 offers, 25 calls, 3 relationships`;
      } else if (lowerMessage.includes('time')) {
        response = `Time Statistics:\n\nTotal: 145 minutes\n\nBreakdown:\n• PIQ: 42 min\n• Comps: 78 min\n• Investment Analysis: 5 min\n• Offer Terms: 25 min\n• Agents: 10 min\n\nSource: My Stats → Time Spent per Module`;
      } else {
        response = `I can help you understand your performance stats! Try asking about:\n\n• "How are my calls looking?"\n• "Show me my offer statistics"\n• "How am I doing on relationships?"\n• "Where do I rank on the team?"\n• "How did I spend my time?"`;
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

      {/* Stats Cards - NEW ORDER: Offers, Communication, Relationships, Time */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        <StatCard
          icon={FileText}
          label="Offers"
          value={MOCK_STATS.offers.value}
          percentDiff={MOCK_STATS.offers.percentDiff}
          chartData={MOCK_STATS.offers.chartData}
        />
        <StatCard
          icon={Phone}
          label="Communication"
          value={MOCK_STATS.communication.value}
          percentDiff={MOCK_STATS.communication.percentDiff}
          chartData={MOCK_STATS.communication.chartData}
        />
        <StatCard
          icon={Users}
          label="Relationships"
          value={MOCK_STATS.relationships.value}
          percentDiff={MOCK_STATS.relationships.percentDiff}
          chartData={MOCK_STATS.relationships.chartData}
        />
        <StatCard
          icon={Clock}
          label="Time"
          value={MOCK_STATS.time.value}
          unit="min"
          percentDiff={MOCK_STATS.time.percentDiff}
          chartData={MOCK_STATS.time.chartData}
          isLast
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-6 pb-24 overflow-y-auto">
        {/* Team Leaderboard - NEW ORDER: Offers, Communication, Relationships, Time */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Team Leaderboard Today
          </h3>
          
          {/* Column Headers */}
          <div className="flex items-center justify-between py-2 px-3 text-xs text-gray-400 border-b border-gray-100 mb-1">
            <div className="flex items-center gap-3 w-40">
              <span className="w-6"></span>
              <span>Name</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="w-16 text-center">Offers</span>
              <span className="w-16 text-center">Comms</span>
              <span className="w-20 text-center">Relations</span>
              <span className="w-16 text-center">Time</span>
            </div>
          </div>

          <div className="space-y-1">
            {TEAM_LEADERBOARD.map((member) => (
              <div 
                key={member.rank}
                className={cn(
                  "flex items-center justify-between py-2 px-3 rounded transition text-sm",
                  member.isUser ? "bg-orange-50" : "hover:bg-gray-50"
                )}
                data-testid={`leaderboard-row-${member.rank}`}
              >
                <div className="flex items-center gap-3 w-40">
                  <span className="w-6 text-center text-gray-400 text-xs">
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                  </span>
                  <span className={cn("font-medium", member.isUser ? "text-orange-600" : "text-gray-700")}>
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span className="w-16 text-center"><strong className="text-gray-900">{member.offers}</strong></span>
                  <span className="w-16 text-center"><strong className="text-gray-900">{member.calls}</strong></span>
                  <span className="w-20 text-center"><strong className="text-gray-900">{member.relationships}</strong></span>
                  <span className="w-16 text-center"><strong className="text-gray-900">{member.time}</strong>m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Performance Report - NEW FORMAT */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Performance Report</h3>
          
          <div className="grid grid-cols-4 gap-6">
            {/* OFFERS */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Offers</span>
                <span className="text-xs text-gray-400">(Goal: 3-5/day)</span>
                <Tooltip content={
                  <div>
                    <p className="font-medium mb-1">Offers Sent</p>
                    <p className="text-gray-300">= Offer Terms Sent + Contract Submitted</p>
                    <p className="text-gray-400 mt-2 text-[10px]">Source: My Stats → Offer Status Change KPIs</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.offers.sent}</span>
                <span className="text-xs text-gray-400">offers sent</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Offer Terms Sent: {DAILY_STATS.offers.termsOut}</div>
                <div>Contract Submitted: {DAILY_STATS.offers.contractSubmitted}</div>
                <div>In Negotiations: {DAILY_STATS.offers.negotiations}</div>
              </div>
              <div className="text-xs text-green-600 font-medium pt-1">
                {DAILY_STATS.offers.teamAvgPercent}% of Team Average
              </div>
            </div>

            {/* COMMUNICATION */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Communication</span>
                <Tooltip content={
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Calls</p>
                      <p className="text-gray-300 text-[10px]">Total outbound calls placed.</p>
                      <p className="text-gray-400 text-[10px]">Source: My Stats → IDX Note (call agent)</p>
                    </div>
                    <div>
                      <p className="font-medium">Conversations</p>
                      <p className="text-gray-300 text-[10px]">Connected calls.</p>
                      <p className="text-gray-400 text-[10px]">Source: Dialpad API → connected_calls_count</p>
                    </div>
                    <div>
                      <p className="font-medium">% Connected</p>
                      <p className="text-gray-300 text-[10px]">Conversations ÷ Calls</p>
                    </div>
                    <div>
                      <p className="font-medium">Average Call Time</p>
                      <p className="text-gray-400 text-[10px]">Source: Dialpad API → average_call_duration</p>
                    </div>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.communication.calls}</span>
                <span className="text-xs text-gray-400">calls ({DAILY_STATS.communication.teamAvgPercent}% of Team Avg)</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Conversations: {DAILY_STATS.communication.conversations} ({DAILY_STATS.communication.connectedPercent}% connected)</div>
                <div>Average Call Time: {DAILY_STATS.communication.avgCallTime}</div>
                <div>Texts: {DAILY_STATS.communication.texts}</div>
                <div>Emails: {DAILY_STATS.communication.emails}</div>
              </div>
            </div>

            {/* RELATIONSHIPS */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Relationships</span>
                <span className="text-xs text-gray-400">(Goal: 5/day)</span>
                <Tooltip content={
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">New Relationships</p>
                      <p className="text-gray-300 text-[10px]">Brand new relationships created today.</p>
                      <p className="text-gray-400 text-[10px]">Source: My Stats → Acquisition Listing Agent Relationship → Total Added</p>
                    </div>
                    <div>
                      <p className="font-medium">Upgraded Relationships</p>
                      <p className="text-gray-300 text-[10px]">Existing relationships that moved up categories (Cold/Warm → Hot/Priority).</p>
                      <p className="text-gray-400 text-[10px]">Source: Relationship Status Change Log</p>
                    </div>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.relationships.newRelationships}</span>
                <span className="text-xs text-gray-400">new relationships</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Upgraded Relationships: {DAILY_STATS.relationships.upgrades}</div>
                <div className="pl-3">Priority: {DAILY_STATS.relationships.priority}</div>
                <div className="pl-3">Hot: {DAILY_STATS.relationships.hot}</div>
                <div className="pl-3">Warm: {DAILY_STATS.relationships.warm}</div>
                <div className="pl-3">Cold: {DAILY_STATS.relationships.cold}</div>
              </div>
              <div className="text-xs text-amber-600 font-medium pt-1">
                {DAILY_STATS.relationships.teamAvgPercent}% of Team Average
              </div>
            </div>

            {/* TIME */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time</span>
                <Tooltip content={
                  <div>
                    <p className="font-medium mb-1">Time Spent</p>
                    <p className="text-gray-300">Total minutes spent across all modules.</p>
                    <p className="text-gray-400 mt-2 text-[10px]">Source: My Stats → Time Spent per Module</p>
                  </div>
                }>
                  <Info className="w-3 h-3 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.time.totalMinutes}</span>
                <span className="text-xs text-gray-400">minutes</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>PIQ: {DAILY_STATS.time.piq}</div>
                <div>Comps: {DAILY_STATS.time.comps}</div>
                <div>Investment Analysis: {DAILY_STATS.time.investmentAnalysis}</div>
                <div>Offer Terms: {DAILY_STATS.time.offerTerms}</div>
                <div>Agents: {DAILY_STATS.time.agents}</div>
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

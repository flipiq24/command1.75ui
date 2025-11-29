import React, { useState, useRef, useEffect } from 'react';
import Layout, { useLayout } from "@/components/Layout";
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
  Trophy
} from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

const MOCK_STATS = {
  calls: {
    value: 4,
    percentDiff: -82.5,
    chartData: [3, 4, 3, 4, 5, 4, 3, 4, 4, 3, 4, 5, 4, 4]
  },
  text: {
    value: 11,
    percentDiff: -98.3,
    chartData: [8, 10, 9, 11, 10, 11, 9, 10, 11, 10, 11, 11, 10, 11]
  },
  offers: {
    value: 7,
    percentDiff: 7.7,
    chartData: [5, 6, 5, 7, 6, 7, 6, 7, 8, 7, 6, 7, 8, 7]
  },
  relationships: {
    value: 3,
    percentDiff: -94.3,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  }
};

const DAILY_STATS = {
  offers: { sent: 3, goal: 3, statusUpdates: 7, termsOut: 3, negotiations: 2, followUp: 2 },
  communication: { calls: 32, callGoal: 30, conversations: 8, convGoal: 5, texts: 12, emails: 15 },
  relationships: { newRelationships: 3, upgrades: 2, priorityContacted: 5, priorityGoal: 5, eliteProgress: 45, eliteGoal: 100 },
  time: { dealReview: 42, agentOutreach: 78, piqAnalysis: 25, totalProductive: 145, productivityScore: 87 }
};

const TEAM_LEADERBOARD = [
  { rank: 1, name: 'Maria', offers: 5, calls: 38, isUser: false },
  { rank: 2, name: 'Tony (You)', offers: 3, calls: 32, isUser: true },
  { rank: 3, name: 'James', offers: 3, calls: 28, isUser: false },
  { rank: 4, name: 'Sarah', offers: 2, calls: 30, isUser: false },
  { rank: 5, name: 'Mike', offers: 2, calls: 25, isUser: false },
  { rank: 6, name: 'Jennifer', offers: 1, calls: 22, isUser: false },
  { rank: 7, name: 'David', offers: 1, calls: 18, isUser: false },
  { rank: 8, name: 'Lisa', offers: 0, calls: 15, isUser: false }
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
  percentDiff, 
  chartData,
  isLast = false
}: { 
  icon: React.ElementType;
  label: string;
  value: number;
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
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <MiniSparkline data={chartData} isPositive={isPositive} />
      </div>
    </div>
  );
};

function MyStatsContent() {
  const [dateRange] = useState('Weekly');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hey Tony! Here's your performance overview.\n\nYou're currently #2 on the team leaderboard with 3 offers and 32 calls today. Great job on exceeding your conversation goal (160% of target)!\n\nToday's Highlights:\n• Calls: 32 (107% of goal)\n• Conversations: 8 (Leading the team!)\n• Offers Sent: 3/3 ✓\n\nAsk me anything about your stats, trends, or how to improve!`
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
        response = `Call Statistics:\n\nToday you made 32 calls, which is 107% of your daily goal of 30.\n\nBreakdown:\n• Connected: 8 conversations\n• Voicemails: 18\n• No answer: 6\n\nTrend: Your call volume is up 15% from last week.`;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('offers')) {
        response = `Offer Statistics:\n\nToday you sent 3 offers out of your goal of 3. Goal met!\n\nStatus Breakdown:\n• Offer Terms Sent: 3\n• In Negotiations: 2\n• Continue to Follow: 2\n\nTeam Ranking: #3 of 8 AAs (Team Avg: 2.1 offers/day)`;
      } else if (lowerMessage.includes('relationship') || lowerMessage.includes('agent')) {
        response = `Relationship Statistics:\n\nToday's Progress:\n• New Relationships: 3\n• Relationship Upgrades: 2 (Cold → Warm)\n• Priority Agents Contacted: 5/5 ✓\n\nProgress to 100 Elite: 45/100 (45%)\n\nYou're on track to hit your 100 Elite Agent goal by end of quarter!`;
      } else if (lowerMessage.includes('team') || lowerMessage.includes('leaderboard') || lowerMessage.includes('rank')) {
        response = `Team Leaderboard:\n\n1. Maria - 5 offers, 38 calls\n2. Tony (You) - 3 offers, 32 calls\n3. James - 3 offers, 28 calls\n4. Sarah - 2 offers, 30 calls\n5. Mike - 2 offers, 25 calls\n\nYour Strengths:\n• Leading in conversation quality (8 vs team avg 4.2)\n• Above average call volume (+33% vs team)`;
      } else if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('tip')) {
        response = `Tips to Improve:\n\n1. Call Timing: Your best conversion rate is between 9-11 AM. Try scheduling more calls during this window.\n\n2. Follow-up Speed: Agents who get follow-up within 24 hours have 40% higher conversion.\n\n3. Priority Focus: You have 5 Priority agents who haven't been contacted in 7+ days.\n\nWant me to create a prioritized call list for tomorrow?`;
      } else {
        response = `I can help you understand your performance stats! Try asking about:\n\n• "How are my calls looking?"\n• "Show me my offer statistics"\n• "How am I doing on relationships?"\n• "Where do I rank on the team?"\n• "How can I improve?"`;
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

      {/* Stats Cards - Fixed */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        <StatCard
          icon={Phone}
          label="Calls"
          value={MOCK_STATS.calls.value}
          percentDiff={MOCK_STATS.calls.percentDiff}
          chartData={MOCK_STATS.calls.chartData}
        />
        <StatCard
          icon={MessageSquare}
          label="Text"
          value={MOCK_STATS.text.value}
          percentDiff={MOCK_STATS.text.percentDiff}
          chartData={MOCK_STATS.text.chartData}
        />
        <StatCard
          icon={FileText}
          label="Offers"
          value={MOCK_STATS.offers.value}
          percentDiff={MOCK_STATS.offers.percentDiff}
          chartData={MOCK_STATS.offers.chartData}
        />
        <StatCard
          icon={Users}
          label="Relationships"
          value={MOCK_STATS.relationships.value}
          percentDiff={MOCK_STATS.relationships.percentDiff}
          chartData={MOCK_STATS.relationships.chartData}
          isLast
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-6 pb-24">
        {/* Team Leaderboard */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Team Leaderboard Today
          </h3>
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
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-gray-400 text-xs">
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                  </span>
                  <span className={cn("font-medium", member.isUser ? "text-orange-600" : "text-gray-700")}>
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span><strong className="text-gray-900">{member.offers}</strong> offers</span>
                  <span><strong className="text-gray-900">{member.calls}</strong> calls</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Performance Report */}
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Performance Report</h3>
          
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Offers (Goal: 3-5/day)</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.offers.sent}</span>
                <span className="text-xs text-gray-400">sent</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>• Offer Terms Sent: {DAILY_STATS.offers.termsOut}</div>
                <div>• In Negotiations: {DAILY_STATS.offers.negotiations}</div>
                <div>• Continue to Follow: {DAILY_STATS.offers.followUp}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Communication</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.communication.calls}</span>
                <span className="text-xs text-gray-400">calls (107%)</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>• Conversations: {DAILY_STATS.communication.conversations} (160%)</div>
                <div>• Texts: {DAILY_STATS.communication.texts}</div>
                <div>• Emails: {DAILY_STATS.communication.emails}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Relationships</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.relationships.newRelationships}</span>
                <span className="text-xs text-gray-400">new</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>• Upgrades: {DAILY_STATS.relationships.upgrades}</div>
                <div>• Priority: {DAILY_STATS.relationships.priorityContacted}/{DAILY_STATS.relationships.priorityGoal}</div>
                <div>• Elite: {DAILY_STATS.relationships.eliteProgress}/{DAILY_STATS.relationships.eliteGoal}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">{DAILY_STATS.time.totalProductive}</span>
                <span className="text-xs text-gray-400">min</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>• Deal Review: {DAILY_STATS.time.dealReview} min</div>
                <div>• Outreach: {DAILY_STATS.time.agentOutreach} min</div>
                <div>• PIQ: {DAILY_STATS.time.piqAnalysis} min</div>
                <div className="text-green-600 font-medium">Score: {DAILY_STATS.time.productivityScore}%</div>
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
  return (
    <Layout>
      <MyStatsContent />
    </Layout>
  );
}

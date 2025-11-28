import React, { useState, useRef, useEffect } from 'react';
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import { 
  Phone, 
  MessageSquare, 
  Target, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  ChevronDown,
  ExternalLink,
  Send,
  Lightbulb,
  Plus,
  Mic,
  AudioLines,
  Trophy,
  Medal,
  Award
} from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

const MOCK_STATS = {
  calls: {
    today: 4,
    average: 23,
    percentDiff: -82.5,
    trend: 'down' as const,
    chartData: [12, 18, 8, 22, 15, 4, 0]
  },
  text: {
    today: 11,
    average: 11,
    percentDiff: -98.3,
    trend: 'down' as const,
    chartData: [8, 14, 11, 9, 15, 11, 0]
  },
  offers: {
    today: 7,
    average: 6.5,
    percentDiff: 7.7,
    trend: 'up' as const,
    chartData: [5, 7, 6, 8, 5, 7, 0]
  },
  relationships: {
    today: 3,
    average: 3.2,
    percentDiff: -94.3,
    trend: 'down' as const,
    chartData: [2, 4, 3, 5, 2, 3, 0]
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

const MiniSparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const width = 120;
  const height = 32;
  const padding = 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / max) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  average, 
  percentDiff, 
  trend, 
  chartData, 
  color 
}: { 
  icon: React.ElementType;
  label: string;
  value: number;
  average: number;
  percentDiff: number;
  trend: 'up' | 'down' | 'neutral';
  chartData: number[];
  color: string;
}) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(percentDiff).toFixed(1)}% than average</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-400 mt-1">
            Average Value: {average}
          </div>
        </div>
        <MiniSparkline data={chartData} color={color.includes('purple') ? '#8b5cf6' : color.includes('blue') ? '#3b82f6' : color.includes('orange') ? '#f97316' : '#22c55e'} />
      </div>
    </div>
  );
};

export default function MyStats() {
  const [dateRange, setDateRange] = useState('Weekly');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hey Tony! 👋 Here's your performance overview.\n\nYou're currently **#2 on the team leaderboard** with 3 offers and 32 calls today. Great job on exceeding your conversation goal (160% of target)!\n\n**Today's Highlights:**\n• Calls: 32 (107% of goal)\n• Conversations: 8 (Leading the team!)\n• Offers Sent: 3/3 ✓\n\nAsk me anything about your stats, trends, or how to improve!`
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

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('call') || lowerMessage.includes('calls')) {
        response = `📞 **Call Statistics:**\n\nToday you made **32 calls**, which is 107% of your daily goal of 30.\n\n**Breakdown:**\n• Connected: 8 conversations\n• Voicemails: 18\n• No answer: 6\n\n**Trend:** Your call volume is up 15% from last week. Keep it up!`;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('offers')) {
        response = `📝 **Offer Statistics:**\n\nToday you sent **3 offers** out of your goal of 3. Goal met! 🎯\n\n**Status Breakdown:**\n• Offer Terms Sent: 3\n• In Negotiations: 2\n• Continue to Follow: 2\n\n**Team Ranking:** #3 of 8 AAs (Team Avg: 2.1 offers/day)`;
      } else if (lowerMessage.includes('relationship') || lowerMessage.includes('agent')) {
        response = `👥 **Relationship Statistics:**\n\n**Today's Progress:**\n• New Relationships: 3\n• Relationship Upgrades: 2 (Cold → Warm)\n• Priority Agents Contacted: 5/5 ✓\n\n**Progress to 100 Elite:** 45/100 (45%)\n\nYou're on track to hit your 100 Elite Agent goal by end of quarter!`;
      } else if (lowerMessage.includes('team') || lowerMessage.includes('leaderboard') || lowerMessage.includes('rank')) {
        response = `🏆 **Team Leaderboard:**\n\n1. 🥇 Maria - 5 offers, 38 calls\n2. 🥈 Tony (You) - 3 offers, 32 calls\n3. 🥉 James - 3 offers, 28 calls\n4. Sarah - 2 offers, 30 calls\n5. Mike - 2 offers, 25 calls\n\n**Your Strengths:**\n• Leading in conversation quality (8 vs team avg 4.2)\n• Above average call volume (+33% vs team)`;
      } else if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('tip')) {
        response = `💡 **Tips to Improve:**\n\n1. **Call Timing:** Your best conversion rate is between 9-11 AM. Try scheduling more calls during this window.\n\n2. **Follow-up Speed:** Agents who get follow-up within 24 hours have 40% higher conversion.\n\n3. **Priority Focus:** You have 5 Priority agents who haven't been contacted in 7+ days.\n\nWant me to create a prioritized call list for tomorrow?`;
      } else {
        response = `I can help you understand your performance stats! Try asking about:\n\n• "How are my calls looking?"\n• "Show me my offer statistics"\n• "How am I doing on relationships?"\n• "Where do I rank on the team?"\n• "How can I improve?"\n\nOr ask any specific question about your daily, weekly, or monthly performance!`;
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
    <Layout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Stats</h1>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4" />
                <span>{dateRange}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="text-sm text-gray-500">
                Nov 17 - Nov 23, 2025
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#FF6600] font-medium hover:bg-orange-50 rounded-lg">
                <ExternalLink className="w-4 h-4" />
                Open all stats
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Phone}
                label="Calls"
                value={MOCK_STATS.calls.today}
                average={MOCK_STATS.calls.average}
                percentDiff={MOCK_STATS.calls.percentDiff}
                trend={MOCK_STATS.calls.trend}
                chartData={MOCK_STATS.calls.chartData}
                color="bg-purple-500"
              />
              <StatCard
                icon={MessageSquare}
                label="Text"
                value={MOCK_STATS.text.today}
                average={MOCK_STATS.text.average}
                percentDiff={MOCK_STATS.text.percentDiff}
                trend={MOCK_STATS.text.trend}
                chartData={MOCK_STATS.text.chartData}
                color="bg-blue-500"
              />
              <StatCard
                icon={Target}
                label="Offers"
                value={MOCK_STATS.offers.today}
                average={MOCK_STATS.offers.average}
                percentDiff={MOCK_STATS.offers.percentDiff}
                trend={MOCK_STATS.offers.trend}
                chartData={MOCK_STATS.offers.chartData}
                color="bg-orange-500"
              />
              <StatCard
                icon={Users}
                label="Relationships"
                value={MOCK_STATS.relationships.today}
                average={MOCK_STATS.relationships.average}
                percentDiff={MOCK_STATS.relationships.percentDiff}
                trend={MOCK_STATS.relationships.trend}
                chartData={MOCK_STATS.relationships.chartData}
                color="bg-green-500"
              />
            </div>

            {/* Team Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Team Leaderboard Today
              </h3>
              <div className="space-y-2">
                {TEAM_LEADERBOARD.map((member) => (
                  <div 
                    key={member.rank}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition",
                      member.isUser ? "bg-orange-50 border border-orange-200" : "hover:bg-gray-50"
                    )}
                    data-testid={`leaderboard-row-${member.rank}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        member.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                        member.rank === 2 ? "bg-gray-100 text-gray-600" :
                        member.rank === 3 ? "bg-orange-100 text-orange-700" :
                        "bg-gray-50 text-gray-500"
                      )}>
                        {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                      </div>
                      <span className={cn("font-medium", member.isUser ? "text-orange-700" : "text-gray-700")}>
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-gray-600">
                        <span className="font-bold text-gray-900">{member.offers}</span> offers
                      </div>
                      <div className="text-gray-600">
                        <span className="font-bold text-gray-900">{member.calls}</span> calls
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Performance Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Performance Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Offers */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Offers (Goal: 3-5/day)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">✓</span>
                    <span className="text-xl font-bold text-gray-900">{DAILY_STATS.offers.sent}</span>
                    <span className="text-gray-400">sent</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Offer Terms Sent: {DAILY_STATS.offers.termsOut}</div>
                    <div>• In Negotiations: {DAILY_STATS.offers.negotiations}</div>
                    <div>• Continue to Follow: {DAILY_STATS.offers.followUp}</div>
                  </div>
                </div>

                {/* Communication */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Communication</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">✓</span>
                    <span className="text-xl font-bold text-gray-900">{DAILY_STATS.communication.calls}</span>
                    <span className="text-gray-400">calls (107%)</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Conversations: {DAILY_STATS.communication.conversations} (160% of goal)</div>
                    <div>• Texts: {DAILY_STATS.communication.texts}</div>
                    <div>• Emails: {DAILY_STATS.communication.emails}</div>
                  </div>
                </div>

                {/* Relationships */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Agent Relationships</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">✓</span>
                    <span className="text-xl font-bold text-gray-900">{DAILY_STATS.relationships.newRelationships}</span>
                    <span className="text-gray-400">new</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Upgrades: {DAILY_STATS.relationships.upgrades} (Cold → Warm)</div>
                    <div>• Priority Contacted: {DAILY_STATS.relationships.priorityContacted}/{DAILY_STATS.relationships.priorityGoal}</div>
                    <div>• Progress to 100 Elite: {DAILY_STATS.relationships.eliteProgress}/{DAILY_STATS.relationships.eliteGoal}</div>
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Time Allocation</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{DAILY_STATS.time.totalProductive}</span>
                    <span className="text-gray-400">min productive</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Deal Review: {DAILY_STATS.time.dealReview} min</div>
                    <div>• Agent Outreach: {DAILY_STATS.time.agentOutreach} min</div>
                    <div>• PIQ Analysis: {DAILY_STATS.time.piqAnalysis} min</div>
                    <div className="text-green-600 font-medium">Score: {DAILY_STATS.time.productivityScore}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iQ Chat Interface - Fixed at Bottom */}
        <div className="bg-white border-t border-gray-200">
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-64 overflow-y-auto px-6 py-4"
          >
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'ai' && (
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-gray-800 whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'user' && (
                    <div className="bg-[#FF6600] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[70%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Bar */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                  <Plus className="w-5 h-5" />
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
                
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                  <Mic className="w-5 h-5" />
                </button>
                
                {inputValue.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={isTyping}
                    className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition"
                    data-testid="button-send-stats"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition"
                    data-testid="button-voice-stats"
                  >
                    <AudioLines className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

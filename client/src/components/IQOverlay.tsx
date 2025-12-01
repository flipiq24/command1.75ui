import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Lightbulb, Flame, Clock, Phone, Home, ChevronRight, ExternalLink, Plus, Mic, AudioLines, Users, Mail, BarChart2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import MilestoneCompletionModal from './MilestoneCompletionModal';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isStreaming?: boolean;
  component?: React.ReactNode;
}

interface PropertyCard {
  id: number;
  type: 'hot' | 'warm' | 'cold' | 'new';
  address: string;
  price: string;
  propensity: number;
  specs: string;
  flags: string[];
  lastOpened: string;
  lastCalled: string;
  offerStatus: string;
  offerPercent: string;
  whyPriority: string;
  recommendedAction: string;
}

interface IQOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  deals?: any[];
  sidebarCollapsed?: boolean;
  showDealComplete?: boolean;
  showCelebration?: boolean;
  onDealCompleteFinished?: () => void;
  onCelebrationFinished?: () => void;
}

const SAMPLE_PROPERTIES: PropertyCard[] = [
  {
    id: 1,
    type: 'hot',
    address: '2842 Rosarita St, San Bernardino, CA 92407',
    price: '$390,000',
    propensity: 11,
    specs: 'SFR / 3 BR / 2 BA / 1,169 sqft / Built 1990',
    flags: ['Notice of Default (NOD)', 'Tax Delinquency'],
    lastOpened: '11/26/25',
    lastCalled: '11/21/25',
    offerStatus: 'Offer Terms Sent',
    offerPercent: '30%',
    whyPriority: 'NOD flag + high propensity + 5 days since last call. Agent may have seller update.',
    recommendedAction: 'Call agent to check seller temperature and push for signed terms.'
  },
  {
    id: 2,
    type: 'hot',
    address: '15620 Ramona Rd, Apple Valley, CA 92307',
    price: '$375,000',
    propensity: 9,
    specs: 'SFR / 4 BR / 3 BA / 2,134 sqft / Built 1980',
    flags: ['Vacant Property', 'Non-Owner Occupied'],
    lastOpened: '11/24/25',
    lastCalled: '10/27/25',
    offerStatus: 'Acquired',
    offerPercent: '100%',
    whyPriority: 'Vacant property with high propensity. Ready to close.',
    recommendedAction: 'Confirm closing details and timeline with agent.'
  },
  {
    id: 3,
    type: 'warm',
    address: '40591 Chantemar Way, Temecula, CA 92591',
    price: '$580,000',
    propensity: 7,
    specs: 'SFR / 5 BR / 3 BA / 2,558 sqft / Built 2000',
    flags: ['Involuntary Liens', 'Expired Listing'],
    lastOpened: '11/26/25',
    lastCalled: '11/18/25',
    offerStatus: 'Offer Terms Sent',
    offerPercent: '30%',
    whyPriority: 'Expired listing with liens. Seller may be motivated.',
    recommendedAction: 'Follow up on offer terms and address seller concerns.'
  }
];

export default function IQOverlay({ isOpen, onClose, userName = 'Tony', deals = [], sidebarCollapsed = false, showDealComplete = false, showCelebration: showCelebrationProp = false, onDealCompleteFinished, onCelebrationFinished }: IQOverlayProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'checkin' | 'briefing' | 'dealreview' | 'deal_complete' | 'outreach_intro' | 'outreach_complete' | 'summary'>('checkin');
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [checkinStep, setCheckinStep] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [helpRequestDetails, setHelpRequestDetails] = useState<string | null>(null);
  const [blockerDetails, setBlockerDetails] = useState<string | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDealComplete && isOpen && currentPhase !== 'deal_complete' && currentPhase !== 'outreach_intro') {
      setCurrentPhase('deal_complete');
      setMessages([]);
      showDealCompleteSummary();
    }
  }, [showDealComplete, isOpen, currentPhase]);

  useEffect(() => {
    if (showCelebrationProp && isOpen && currentPhase !== 'summary' && !showCelebrationModal) {
      setCurrentPhase('summary');
      setMessages([]);
      setShowCelebrationModal(true);
    }
  }, [showCelebrationProp, isOpen, currentPhase, showCelebrationModal]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebrationModal(false);
    if (onCelebrationFinished) {
      onCelebrationFinished();
    }
    generateFinalSummary();
  }, [onCelebrationFinished]);

  const properties = SAMPLE_PROPERTIES;
  const currentProperty = properties[currentPropertyIndex];

  // Pipeline stats that match the Action Plan component
  const pipelineStats = {
    criticals: 5,
    reminders: 3,
    hot: 2,
    warm: 1,
    cold: 1,
    new: 52,
    offersNone: 12,
    totalProperties: 56,
    agentCalls: 30,
    priorityCalls: 5,
    campaigns: 3,
    offersOut: 0,
    offersGoal: 3,
    conversations: 0,
    conversationsGoal: 30
  };

  // Outreach stats
  const outreachStats = {
    newRelationships: 30,
    priorityAgents: 5,
    campaignsToSend: 3
  };

  // Completed stats (for summaries)
  const completedStats = {
    dealsProcessed: 56,
    hotDeals: 2,
    warmDeals: 1,
    coldDeals: 1,
    newDeals: 52,
    offersSent: 3,
    callsMade: 30,
    conversationsHad: 15,
    newRelationships: 5,
    priorityAgentsCalled: 5,
    campaignsSent: 3
  };

  const getDayDescriptor = () => {
    const dayOfWeek = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const descriptors = [
      'beautiful day',
      'productive Monday',
      'exciting Tuesday',
      'wonderful Wednesday',
      'productive Thursday',
      'exciting Friday',
      'great Saturday'
    ];
    return descriptors[dayOfWeek];
  };

  const getDynamicGreeting = () => {
    const greetings = [
      "a full plate",
      "lots of opportunities",
      "some hot deals"
    ];
    const dayOfWeek = new Date().getDay();
    return greetings[dayOfWeek % greetings.length];
  };

  const goToDealReview = () => {
    onClose();
    setLocation('/?filter=hot');
  };

  const goToDailyOutreach = () => {
    if (onDealCompleteFinished) {
      onDealCompleteFinished();
    }
    onClose();
    setLocation('/daily-outreach');
  };

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: '🎙️ Voice mode activated. I\'m listening...'
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: 'Voice mode deactivated. You can type your message.'
      }]);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 17) return 'afternoon';
    return 'evening';
  };

  const getSessionState = () => {
    const lastSession = localStorage.getItem('flipiq_last_session');
    const morningCheckin = localStorage.getItem('flipiq_morning_checkin');
    const today = new Date().toDateString();
    
    if (!lastSession) {
      return 'first';
    }
    
    const lastSessionDate = new Date(parseInt(lastSession));
    const timeSinceLastSession = Date.now() - parseInt(lastSession);
    const hoursSinceLastSession = timeSinceLastSession / (1000 * 60 * 60);
    
    if (lastSessionDate.toDateString() !== today) {
      return 'new_day';
    }
    
    if (morningCheckin === today && hoursSinceLastSession > 0.5) {
      const timeOfDay = getTimeOfDay();
      if (timeOfDay === 'lunch' || timeOfDay === 'afternoon') {
        return 'returning_after_lunch';
      }
      return 'returning';
    }
    
    if (morningCheckin === today) {
      return 'continuing';
    }
    
    return 'new_day';
  };

  const progressStats = {
    dealsReviewedAM: 12,
    offersOutAM: 2,
    callsMadeAM: 8,
    dealsLeft: 44,
    offersLeft: 3,
    callsLeft: 22
  };

  const getContextualGreeting = () => {
    const sessionState = getSessionState();
    const timeOfDay = getTimeOfDay();
    const dynamicGreeting = getDynamicGreeting();
    const dayDescriptor = getDayDescriptor();
    
    if (sessionState === 'returning_after_lunch') {
      return `Welcome back, ${userName}!\n\nHope you had a good lunch.\n\nThis morning you:\n• Reviewed ${progressStats.dealsReviewedAM} deals\n• Sent ${progressStats.offersOutAM} offers\n• Made ${progressStats.callsMadeAM} calls\n\nYou've got ${progressStats.dealsLeft} deals, ${progressStats.offersLeft} offers, and ${progressStats.callsLeft} calls left for today.\n\nReady to finish strong?`;
    }
    
    if (sessionState === 'returning') {
      return `Welcome back, ${userName}!\n\nLooks like you stepped away for a bit. No worries.\n\nSo far today you've:\n• Reviewed ${progressStats.dealsReviewedAM} deals\n• Sent ${progressStats.offersOutAM} offers\n• Made ${progressStats.callsMadeAM} calls\n\nYou've got ${progressStats.dealsLeft} deals, ${progressStats.offersLeft} offers, and ${progressStats.callsLeft} calls remaining.\n\nReady to pick up where you left off?`;
    }
    
    if (sessionState === 'continuing') {
      return `Hey ${userName}, still going strong!\n\nQuick check-in: Is everything going smoothly, or do you need any help?`;
    }
    
    if (timeOfDay === 'afternoon') {
      return `Good afternoon, ${userName}.\n\nI'll check you in at ${getCurrentTime()}.\n\nYou've got ${dynamicGreeting} today, so I just want to make sure you're ready to take it on.\n\nAre you able to work the rest of the day?`;
    }
    
    if (timeOfDay === 'evening') {
      return `Good evening, ${userName}.\n\nI'll check you in at ${getCurrentTime()}.\n\nLate session? Let's make it count.\n\nHow much time do you have to work tonight?`;
    }
    
    return `Good morning, ${userName}.\n\nI'll check you in for this ${dayDescriptor} at ${getCurrentTime()}.\n\nYou've got ${dynamicGreeting} today, so I just want to make sure you're ready to take it on.\n\nAre you able to work a full day today?`;
  };

  const streamMessage = useCallback(async (text: string, callback?: () => void) => {
    setIsTyping(true);
    setStreamingText('');
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setStreamingText(currentText);
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
    }
    
    setIsTyping(false);
    setStreamingText('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      content: text
    }]);
    
    if (callback) callback();
  }, []);

  const getAIResponse = async (userMessage: string, dealContext?: any): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          dealContext: dealContext || currentProperty
        })
      });
      
      if (!response.ok) {
        throw new Error('AI request failed');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI error:', error);
      return "I'm having trouble connecting right now. Let me help you with what I know about this property.";
    }
  };

  // AA2 Deal Complete Summary - "Why it Matters"
  const showDealCompleteSummary = async () => {
    setCurrentPhase('deal_complete');
    
    const summaryMessage = `All done with your active properties for today. This is what you did and why it matters:

**Summary:**
✓ ${pipelineStats.criticals} criticals completed
✓ ${pipelineStats.reminders} reminders logged
✓ ${pipelineStats.hot} hot properties followed up
✓ AutoTrackers activated where needed and notes made

**Why it Matters:**
iQ's job is to keep you in front of each property and agent when it matters. By communicating with efficiency and staying on top of it, this lets the agent know you're consistent and professional. This will translate moving forward to open escrow and all the way to closing.

If you want to see your deals you can always ask me or go to Pipeline > My Deals and it's all there. You can also ask me and I will get you a report with clickable links to any or all your daily, weekly or monthly work and updates so you can verify all your work is properly processed and easily available!

**Great Job!!** I'm sending this summary to your AM now.

Are you ready to build relationships while finding deals? :)`;

    await streamMessage(summaryMessage);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'start-outreach-button',
        role: 'ai',
        content: '',
        component: (
          <div className="flex gap-3 mt-4">
            <button
              onClick={showOutreachIntro}
              className="px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              data-testid="button-start-daily-outreach"
            >
              <Phone className="w-5 h-5" />
              Start Daily Outreach
            </button>
          </div>
        )
      }]);
    }, 300);
  };

  // AA3 Daily Outreach Intro
  const showOutreachIntro = async () => {
    setCurrentPhase('outreach_intro');
    setMessages(prev => prev.filter(m => m.id !== 'start-outreach-button'));
    
    await streamMessage(`Awesome!! I hand-picked deals for you that have high propensity to sell and I will give you a script on each on how to talk to the agent so we can make ${outreachStats.newRelationships} solid contacts!

Let's build relationships while finding high propensity to sell deals!`);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'outreach-stats-card',
        role: 'ai',
        content: '',
        component: (
          <div className="my-4">
            <div className="border-2 border-gray-300 rounded-xl p-5 bg-white">
              <div className="text-center font-bold text-gray-700 mb-4">📞 DAILY OUTREACH GOALS</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-black text-blue-600">0/{outreachStats.newRelationships}</div>
                  <div className="text-xs text-gray-500 mt-1">New Agent Relationships</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-3xl font-black text-orange-600">0/{outreachStats.priorityAgents}</div>
                  <div className="text-xs text-gray-500 mt-1">Call Priority Agents</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-3xl font-black text-purple-600">0/{outreachStats.campaignsToSend}</div>
                  <div className="text-xs text-gray-500 mt-1">Send Campaigns</div>
                </div>
              </div>
            </div>
          </div>
        )
      }]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'go-outreach-button',
          role: 'ai',
          content: '',
          component: (
            <div className="flex gap-3 mt-4">
              <button
                onClick={goToDailyOutreach}
                className="px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
                data-testid="button-go-daily-outreach-aa3"
              >
                <Phone className="w-5 h-5" />
                Start Daily Outreach
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )
        }]);
      }, 300);
    }, 300);
  };

  // Final Summary after ALL daily tasks complete (AA3 complete)
  const generateFinalSummary = useCallback(() => {
    const summaryMessage = `🎉 **Daily Summary Complete!**

Great work today, ${userName}! Here's what you accomplished:

📊 **Deal Activity**
• Processed ${completedStats.dealsProcessed} total deals
• High Priority: ${completedStats.hotDeals} reviewed
• Medium Priority: ${completedStats.warmDeals} reviewed
• Low Priority: ${completedStats.coldDeals} reviewed
• New Deals: ${completedStats.newDeals} categorized

📝 **Offers**
• Offers Sent: ${completedStats.offersSent}/${pipelineStats.offersGoal} ✅
• Goal Met: Yes! 🎯

📞 **Outreach**
• Calls Made: ${completedStats.callsMade}/${pipelineStats.agentCalls} ✅
• Conversations: ${completedStats.conversationsHad}
• New Relationships Built: ${completedStats.newRelationships}
• Priority Agents Called: ${completedStats.priorityAgentsCalled}
• Campaigns Sent: ${completedStats.campaignsSent}

🏆 **Achievement Unlocked!**

**This is why this matters:**
Now you have ${completedStats.offersSent} more offers sent and ${completedStats.newRelationships} new agent relationships that you can add to campaigns. You made ${completedStats.offersSent} offers and connected with ${completedStats.callsMade} agents.

Here is how we track your updates and you can always easily find them by asking iQ or going to My Deals on the sidebar navigation.

Let's debrief and see how you did today!`;

    setMessages([{
      id: Date.now().toString(),
      role: 'ai',
      content: summaryMessage
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'view-stats-button',
        role: 'ai',
        content: '',
        component: (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                onClose();
                setLocation('/my-stats');
              }}
              className="px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              data-testid="button-view-my-stats"
            >
              <BarChart2 className="w-5 h-5" />
              View My Stats Report
            </button>
          </div>
        )
      }]);
    }, 500);
  }, [userName, onClose, setLocation]);

  const addPropertyCard = useCallback((property: PropertyCard) => {
    const typeEmoji = property.type === 'hot' ? '🔥 HOT' : property.type === 'warm' ? '🌡️ WARM' : property.type === 'cold' ? '❄️ COLD' : '🆕 NEW';
    const typeColor = property.type === 'hot' ? 'border-orange-400 bg-orange-50' : property.type === 'warm' ? 'border-amber-400 bg-amber-50' : property.type === 'cold' ? 'border-blue-400 bg-blue-50' : 'border-gray-400 bg-gray-50';
    
    setMessages(prev => [...prev, {
      id: `property-${property.id}`,
      role: 'ai',
      content: '',
      component: (
        <div className={cn("border-2 rounded-xl p-5 my-2", typeColor)}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-black">{typeEmoji}</span>
            <span className="text-lg font-bold text-gray-900">{property.address}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 uppercase">Price</div>
              <div className="text-lg font-bold text-gray-900">{property.price}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Propensity</div>
              <div className="text-lg font-bold text-orange-600">{property.propensity}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <Home className="w-4 h-4 inline mr-1" />
            {property.specs}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {property.flags.map((flag, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {flag}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4 border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Last Opened:</span>
              <span className="font-medium">{property.lastOpened}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Last Called:</span>
              <span className="font-medium">{property.lastCalled}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-500 uppercase mb-1">Offer Status</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: property.offerPercent }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900">{property.offerPercent}</span>
            </div>
            <div className="text-sm text-gray-700 mt-1">{property.offerStatus}</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="text-xs text-blue-600 uppercase font-bold mb-1">Why This Is Priority</div>
            <p className="text-sm text-blue-800">{property.whyPriority}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-600 uppercase font-bold mb-1">Recommended Action</div>
            <p className="text-sm text-green-800">{property.recommendedAction}</p>
          </div>
        </div>
      )
    }]);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !showDealComplete && !showCelebrationProp) {
      const sessionState = getSessionState();
      const greeting = getContextualGreeting();
      
      localStorage.setItem('flipiq_last_session', Date.now().toString());
      
      if (sessionState === 'new_day' || sessionState === 'first') {
        localStorage.setItem('flipiq_morning_checkin', new Date().toDateString());
      }
      
      setTimeout(() => {
        streamMessage(greeting);
        
        if (sessionState === 'returning_after_lunch' || sessionState === 'returning') {
          setCheckinStep(3);
        } else if (sessionState === 'continuing') {
          setCheckinStep(4);
        } else {
          setCheckinStep(1);
        }
      }, 500);
    }
  }, [isOpen, messages.length, userName, streamMessage, showDealComplete, showCelebrationProp]);

  const showDailyBriefing = async () => {
    setCurrentPhase('briefing');
    
    await streamMessage(`Here's your action plan for today:`);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'briefing-stats',
        role: 'ai',
        content: '',
        component: (
          <div className="my-4 font-mono text-sm">
            <div className="border-2 border-gray-300 rounded-xl p-5 bg-white">
              <div className="text-center font-bold text-gray-700 mb-4">📋 TODAY'S ACTION PLAN</div>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span>🚨 Critical Calls:</span>
                  <span className="font-bold text-red-600">{pipelineStats.criticals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>⏰ Reminders:</span>
                  <span className="font-bold text-amber-600">{pipelineStats.reminders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🔥 Hot Properties:</span>
                  <span className="font-bold text-orange-600">{pipelineStats.hot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🌡️ Warm Properties:</span>
                  <span className="font-bold text-amber-500">{pipelineStats.warm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>❄️ Cold Properties:</span>
                  <span className="font-bold text-blue-600">{pipelineStats.cold}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🆕 New Follow-ups:</span>
                  <span className="font-bold text-gray-600">{pipelineStats.new}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                  <span>📝 Offers showing "None":</span>
                  <span className="font-bold text-purple-600">{pipelineStats.offersNone}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }]);
      
      setTimeout(async () => {
        await streamMessage(`Let's start by navigating to your Deal Review.`);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 'start-review-button',
            role: 'ai',
            content: '',
            component: (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={goToDealReview}
                  className="px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
                  data-testid="button-go-deal-review"
                >
                  <Flame className="w-5 h-5" />
                  Go to Deal Review
                </button>
              </div>
            )
          }]);
        }, 300);
      }, 500);
    }, 300);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim().toLowerCase();
    const originalInput = inputValue.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: originalInput
    }]);
    setInputValue('');

    if (currentPhase === 'checkin') {
      if (checkinStep === 1) {
        // Step 1: Are you able to work a full day?
        const isPositive = userMessage === 'yes' || userMessage === 'y' || userMessage.includes('yes') || 
                          userMessage.includes('ready') || userMessage.includes('full day') ||
                          userMessage.includes('hour') || userMessage.includes('minute') ||
                          userMessage.includes('half') || userMessage.includes('few') ||
                          /\d+/.test(userMessage);
        
        if (isPositive) {
          setTimeout(async () => {
            await streamMessage(`Great — let's get moving.\n\nAs we go through the day, I'll help where needed or get your Acquisition Manager involved if anything stalls.\n\nBefore we jump in, is there anything you already know you'll need help with today?`);
            setCheckinStep(2);
          }, 300);
        } else if (userMessage === 'no' || userMessage === 'n' || userMessage.includes("can't") || userMessage.includes('not today')) {
          setTimeout(async () => {
            await streamMessage("No problem! Let me know when you're ready to start. Just say 'ready' when you want to begin.");
          }, 300);
        } else {
          setTimeout(async () => {
            await streamMessage(`Great — let's get moving.\n\nAs we go through the day, I'll help where needed or get your Acquisition Manager involved if anything stalls.\n\nBefore we jump in, is there anything you already know you'll need help with today?`);
            setCheckinStep(2);
          }, 300);
        }
      } else if (checkinStep === 2) {
        // Step 2: Is there anything you'll need help with?
        const isNo = userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing') || userMessage.includes("i'm good") || userMessage.includes("nope");
        
        if (isNo) {
          setTimeout(async () => {
            await streamMessage(`Alright ${userName}, today we're going to go over all your active properties, Criticals and notifications. After that we will help you connect with about ${pipelineStats.agentCalls} agents with high-propensity-to-sell listings. Once you complete that we will help you connect with your Priority Agents and then send out a few campaigns to your Hot, Warm and Cold to keep you top of mind.\n\nIs there anything that might prevent you from getting to all those items today?`);
            setCheckinStep(3);
          }, 300);
        } else {
          // User needs help - capture details
          setHelpRequestDetails(originalInput);
          setTimeout(async () => {
            await streamMessage(`Got it. Tell me what you need help with:`);
            setCheckinStep(2.5); // Waiting for help details
          }, 300);
        }
      } else if (checkinStep === 2.5) {
        // Step 2.5: Capture help details and show confirmation
        setHelpRequestDetails(originalInput);
        setTimeout(async () => {
          await streamMessage(`I'll send this note to your AM right now:\n\n"${userName} needs help with: ${originalInput}"\n\nIs this correct?`);
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: 'confirm-help-buttons',
              role: 'ai',
              content: '',
              component: (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={async () => {
                      setMessages(prev => prev.filter(m => m.id !== 'confirm-help-buttons'));
                      await streamMessage(`✓ Note sent to your AM.\n\nAlright ${userName}, today we're going to go over all your active properties, Criticals and notifications. After that we will help you connect with about ${pipelineStats.agentCalls} agents with high-propensity-to-sell listings. Once you complete that we will help you connect with your Priority Agents and then send out a few campaigns to your Hot, Warm and Cold to keep you top of mind.\n\nIs there anything that might prevent you from getting to all those items today?`);
                      setCheckinStep(3);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
                    data-testid="button-confirm-help-yes"
                  >
                    Yes, Send It
                  </button>
                  <button
                    onClick={async () => {
                      setMessages(prev => prev.filter(m => m.id !== 'confirm-help-buttons'));
                      await streamMessage(`No problem. Tell me again what you need help with:`);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition"
                    data-testid="button-confirm-help-no"
                  >
                    No, Let Me Rephrase
                  </button>
                </div>
              )
            }]);
          }, 300);
        }, 300);
      } else if (checkinStep === 3) {
        // Step 3: Any blockers for calls? (Also handles returning users)
        const isNo = userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing') || userMessage.includes('nope') || userMessage.includes('ready') || userMessage.includes('yes') || userMessage.includes('good');
        
        if (isNo) {
          setTimeout(async () => {
            await streamMessage(`Perfect. You're locked in for a full day.\n\nI'll mark you as available and load your Action Plan to get started.`);
            setCheckinStep(5);
            
            setTimeout(() => {
              showDailyBriefing();
            }, 800);
          }, 300);
        } else {
          // User has blockers - capture details
          setBlockerDetails(originalInput);
          setTimeout(async () => {
            await streamMessage(`Understood — I'll make a note of that and send an update to your AM.\n\nLet's clear what we can now so you can focus on the calls.`);
            setCheckinStep(5);
            
            setTimeout(() => {
              showDailyBriefing();
            }, 800);
          }, 300);
        }
      } else if (checkinStep === 4) {
        // Step 4: Quick check-in for continuing sessions ("Is everything going smoothly?")
        setTimeout(async () => {
          if (userMessage.includes('help') || userMessage.includes('stuck') || userMessage.includes('issue') || userMessage.includes('problem')) {
            await streamMessage(`Got it. I'll send a note to your AM right now so they can support you.\n\nIn the meantime, let me pull up your Action Plan so we can keep moving.`);
          } else {
            await streamMessage(`Excellent! Let's keep the momentum going.\n\nHere's where you're at:`);
          }
          setCheckinStep(5);
          
          setTimeout(() => {
            showDailyBriefing();
          }, 800);
        }, 300);
      }
    } else if (currentPhase === 'briefing') {
      if (userMessage.includes('start') || userMessage.includes('ready') || userMessage.includes('go') || userMessage.includes('begin') || userMessage.includes('deal')) {
        goToDealReview();
      } else if (userMessage.includes('outreach') || userMessage.includes('call') || userMessage.includes('agent')) {
        goToDailyOutreach();
      } else {
        // Use AI for free-form questions during briefing
        setIsTyping(true);
        setStreamingText('Thinking...');
        try {
          const aiResponse = await getAIResponse(
            `User is in the daily briefing phase. They have ${pipelineStats.hot} hot deals, ${pipelineStats.warm} warm deals, ${pipelineStats.cold} cold deals, and ${pipelineStats.new} new deals. Goals: ${pipelineStats.offersGoal} offers, ${pipelineStats.conversationsGoal} conversations. User asks: ${originalInput}`
          );
          setIsTyping(false);
          setStreamingText('');
          await streamMessage(aiResponse);
        } catch (error) {
          setIsTyping(false);
          setStreamingText('');
          await streamMessage("Click the 'Go to Deal Review' button above when you're ready to begin!");
        }
      }
    } else if (currentPhase === 'dealreview') {
      if (userMessage === 'next' || userMessage === 'n') {
        goToNextProperty();
      } else {
        // Use AI for free-form questions about properties
        setIsTyping(true);
        setStreamingText('Analyzing...');
        try {
          const aiResponse = await getAIResponse(
            `User is reviewing a property at ${currentProperty.address}. Price: ${currentProperty.price}, Propensity: ${currentProperty.propensity}, Flags: ${currentProperty.flags.join(', ')}. User asks: ${originalInput}`
          );
          setIsTyping(false);
          setStreamingText('');
          await streamMessage(aiResponse);
        } catch (error) {
          setIsTyping(false);
          setStreamingText('');
          await streamMessage(`Based on the property at ${currentProperty.address}:\n\nThe ${currentProperty.flags.join(' and ')} flags indicate higher seller motivation. With a propensity score of ${currentProperty.propensity}, this is a strong opportunity.\n\nWould you like me to draft talking points for your call, or shall we move to the next property?`);
        }
      }
    } else if (currentPhase === 'deal_complete') {
      if (userMessage.includes('yes') || userMessage.includes('ready') || userMessage.includes('outreach') || userMessage.includes('build')) {
        showOutreachIntro();
      } else {
        await streamMessage(`Great question! Click "Start Daily Outreach" when you're ready to build relationships with ${outreachStats.newRelationships} agents with high propensity deals.`);
      }
    } else if (currentPhase === 'summary') {
      // AI-powered chat for stats questions
      setIsTyping(true);
      setStreamingText('Analyzing your stats...');
      try {
        const aiResponse = await getAIResponse(
          `User completed their daily workflow. Stats: ${completedStats.dealsProcessed} deals processed, ${completedStats.offersSent} offers sent, ${completedStats.callsMade} calls made, ${completedStats.conversationsHad} conversations. User asks: ${originalInput}`
        );
        setIsTyping(false);
        setStreamingText('');
        await streamMessage(aiResponse);
      } catch (error) {
        setIsTyping(false);
        setStreamingText('');
        await streamMessage(`Great job today! You processed ${completedStats.dealsProcessed} deals, sent ${completedStats.offersSent} offers, and made ${completedStats.callsMade} calls. Click "View My Stats Report" for the full breakdown.`);
      }
    }
  };

  const startDealReview = async () => {
    setCurrentPhase('dealreview');
    setMessages(prev => prev.filter(m => m.id !== 'start-review-button'));
    
    await streamMessage(`Loading your Deal Review...\n\nStarting with your High Priority deals first, then we'll work through Medium Priority, Low Priority, and New.\n\nYou have ${pipelineStats.hot} high priority properties that need immediate attention today. Click the link below to start reviewing them.`);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'deal-review-link',
        role: 'ai',
        content: '',
        component: (
          <button
            onClick={goToDealReview}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF6600] to-[#FF8533] hover:from-[#e65c00] hover:to-[#FF6600] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-3"
            data-testid="button-go-to-deal-review"
          >
            <Flame className="w-5 h-5" />
            <span>Go to Deal Review — High Priority</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        )
      }]);
    }, 300);
  };

  const goToNextProperty = async () => {
    if (currentPropertyIndex < properties.length - 1) {
      const nextIndex = currentPropertyIndex + 1;
      setCurrentPropertyIndex(nextIndex);
      
      await streamMessage(`Moving to property ${nextIndex + 1} of ${properties.length}...\n\nHere's your next priority property:`);
      
      setTimeout(() => {
        addPropertyCard(properties[nextIndex]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `next-prompt-${nextIndex}`,
            role: 'ai',
            content: "Ready to proceed? Type 'next' or ask me anything about this property."
          }]);
        }, 300);
      }, 500);
    } else {
      // All properties reviewed - show deal complete summary
      showDealCompleteSummary();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'checkin': return 'AA1 Check-In';
      case 'briefing': return 'AA2 Today\'s Action Plan';
      case 'dealreview': return `AA2 Deal Review — Property ${currentPropertyIndex + 1}/${properties.length}`;
      case 'deal_complete': return 'AA2 Deal Review Complete';
      case 'outreach_intro': return 'AA3 Daily Outreach';
      case 'outreach_complete': return 'AA3 Outreach Complete';
      case 'summary': return 'Daily Summary';
      default: return '';
    }
  };

  return (
    <>
    <MilestoneCompletionModal 
      isOpen={showCelebrationModal} 
      userName={userName}
      onComplete={handleCelebrationComplete}
    />
    {isOpen && (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex"
        style={{ left: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="flex-1 bg-gray-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">FlipIQ Assistant</h2>
                <p className="text-xs text-gray-500">{getPhaseLabel()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              data-testid="button-close-iq-overlay"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Chat Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-6 py-6"
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
                  {message.role === 'ai' && !message.component && (
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-800 whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'ai' && message.component && (
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {message.component}
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
              
              {/* Streaming indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-800 whitespace-pre-line">
                      {streamingText}
                      <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Bar - Floating Style */}
          <div className="px-6 py-6 bg-gradient-to-t from-gray-100 to-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-lg border border-gray-200">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  data-testid="button-add-attachment"
                >
                  <Plus className="w-5 h-5" />
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  data-testid="input-iq-chat"
                />
                
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  data-testid="button-mic"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                {inputValue.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={isTyping}
                    className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition"
                    data-testid="button-send-iq"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={toggleVoice}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition",
                      isVoiceActive
                        ? "bg-[#FF6600] text-white animate-pulse"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    )}
                    data-testid="button-voice-activate"
                  >
                    <AudioLines className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    )}
    </>
  );
}

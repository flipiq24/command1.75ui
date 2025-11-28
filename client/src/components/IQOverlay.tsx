import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Lightbulb, Flame, Clock, Phone, Home, ChevronRight, ExternalLink, Plus, Mic, AudioLines } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

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

export default function IQOverlay({ isOpen, onClose, userName = 'Josh', deals = [], sidebarCollapsed = false }: IQOverlayProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'checkin' | 'briefing' | 'dealreview'>('checkin');
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [checkinStep, setCheckinStep] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const properties = SAMPLE_PROPERTIES;
  const currentProperty = properties[currentPropertyIndex];

  const pipelineStats = {
    hot: 2,
    warm: 1,
    warmComplete: true,
    cold: 1,
    new: 56,
    offersOut: 0,
    offersGoal: 5,
    conversations: 3,
    conversationsGoal: 30,
    priorityCalls: 0,
    priorityCallsGoal: 5,
    campaignsSent: 0,
    campaignsGoal: 3
  };

  const goToDealReview = () => {
    onClose();
    setLocation('/?filter=hot');
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

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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
      return `Good afternoon, ${userName}.\n\nChecking you in at ${getCurrentTime()}.\n\nYou've got a productive afternoon ahead — let me make sure you're set.\n\nAre you able to work the rest of the day?`;
    }
    
    if (timeOfDay === 'evening') {
      return `Good evening, ${userName}.\n\nChecking you in at ${getCurrentTime()}.\n\nLate session? Let's make it count.\n\nHow much time do you have to work tonight?`;
    }
    
    return `Good morning, ${userName}.\n\nChecking you in at ${getCurrentTime()}.\n\nYou've got a strong day ahead — let me make sure you're ready.\n\nAre you able to work a full day today?`;
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
    if (isOpen && messages.length === 0) {
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
  }, [isOpen, messages.length, userName, streamMessage]);

  const showDailyBriefing = async () => {
    setCurrentPhase('briefing');
    
    await streamMessage(`Alright ${userName}, let me pull up your pipeline...`);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 'briefing-stats',
        role: 'ai',
        content: '',
        component: (
          <div className="my-4 font-mono text-sm">
            <div className="border-2 border-gray-300 rounded-xl p-5 bg-white">
              <div className="text-center font-bold text-gray-700 mb-4">📊 TODAY'S DEAL REVIEW</div>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span>🔥 Hot Deals:</span>
                  <span className="font-bold text-orange-600">{pipelineStats.hot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🌡️ Warm Deals:</span>
                  <span className="font-bold text-amber-600">{pipelineStats.warm} {pipelineStats.warmComplete && <span className="text-green-600">✓ Complete</span>}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>❄️ Cold Deals:</span>
                  <span className="font-bold text-blue-600">{pipelineStats.cold}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🆕 New Deals:</span>
                  <span className="font-bold text-gray-600">{pipelineStats.new}</span>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-gray-300 rounded-xl p-5 bg-white mt-4">
              <div className="text-center font-bold text-gray-700 mb-4">🎯 TODAY'S GOALS</div>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span>📝 Offers Out:</span>
                  <span className={pipelineStats.offersOut >= pipelineStats.offersGoal ? "font-bold text-green-600" : "font-bold text-gray-600"}>
                    {pipelineStats.offersOut} / {pipelineStats.offersGoal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📞 Agent Conversations:</span>
                  <span className={pipelineStats.conversations >= pipelineStats.conversationsGoal ? "font-bold text-green-600" : "font-bold text-gray-600"}>
                    {pipelineStats.conversations} / {pipelineStats.conversationsGoal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>⭐ Priority Agent Calls:</span>
                  <span className={pipelineStats.priorityCalls >= pipelineStats.priorityCallsGoal ? "font-bold text-green-600" : "font-bold text-gray-600"}>
                    {pipelineStats.priorityCalls} / {pipelineStats.priorityCallsGoal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📣 Campaigns Sent:</span>
                  <span className={pipelineStats.campaignsSent >= pipelineStats.campaignsGoal ? "font-bold text-green-600" : "font-bold text-gray-600"}>
                    {pipelineStats.campaignsSent} / {pipelineStats.campaignsGoal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      }]);
      
      setTimeout(async () => {
        await streamMessage(`The goal today is simple:\n\n→ Get ${pipelineStats.offersGoal} offers out the door\n→ Have ${pipelineStats.conversationsGoal} solid conversations with high-value agents\n→ Build relationships while chasing high-propensity deals\n→ Connect with your ${pipelineStats.priorityCallsGoal} Priority agents\n→ Send ${pipelineStats.campaignsGoal} targeted campaigns\n\nWith my help and our tools, we can move through this quickly — while still giving you time to evaluate new deals as they come in.\n\nReady to start?`);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 'start-review-button',
            role: 'ai',
            content: '',
            component: (
              <button
                onClick={startDealReview}
                className="mt-4 px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
                data-testid="button-start-deal-review"
              >
                <ChevronRight className="w-5 h-5" />
                Start Deal Review
              </button>
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
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    }]);
    setInputValue('');

    if (currentPhase === 'checkin') {
      if (checkinStep === 1) {
        // Accept any positive response or time commitment as moving forward
        const isPositive = userMessage === 'yes' || userMessage === 'y' || userMessage.includes('yes') || 
                          userMessage.includes('ready') || userMessage.includes('full day') ||
                          userMessage.includes('hour') || userMessage.includes('minute') ||
                          userMessage.includes('half') || userMessage.includes('few') ||
                          /\d+/.test(userMessage); // Any number indicates time commitment
        
        if (isPositive) {
          setTimeout(async () => {
            await streamMessage("Perfect. Before we dive in, anything you already know you'll need help with today?");
            setCheckinStep(2);
          }, 300);
        } else if (userMessage === 'no' || userMessage === 'n' || userMessage.includes("can't") || userMessage.includes('not today')) {
          setTimeout(async () => {
            await streamMessage("No problem! Let me know when you're ready to start. Just say 'ready' when you want to begin.");
          }, 300);
        } else {
          // Default to moving forward with any response
          setTimeout(async () => {
            await streamMessage("Got it! Before we dive in, anything you already know you'll need help with today?");
            setCheckinStep(2);
          }, 300);
        }
      } else if (checkinStep === 2) {
        if (userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing') || userMessage.includes("i'm good") || userMessage.includes("nope")) {
          setTimeout(async () => {
            await streamMessage("Great! Is there anything that might prevent you from completing your goals today?");
            setCheckinStep(3);
          }, 300);
        } else {
          setTimeout(async () => {
            await streamMessage(`Got it — I've noted that down and will notify your AM about your request.\n\nIs there anything that might prevent you from completing your goals today?`);
            setCheckinStep(3);
          }, 300);
        }
      } else if (checkinStep === 3) {
        setTimeout(async () => {
          if (userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing') || userMessage.includes('nope')) {
            await streamMessage("Perfect! Let's see what you've got on the docket today...");
          } else {
            await streamMessage(`Understood — I've logged that potential blocker. Your AM will be notified.\n\nLet's see what you've got on the docket today...`);
          }
          setCheckinStep(4);
          
          setTimeout(() => {
            showDailyBriefing();
          }, 500);
        }, 300);
      }
    } else if (currentPhase === 'briefing') {
      setTimeout(async () => {
        await streamMessage("Click the 'Start Deal Review' button above when you're ready to begin!");
      }, 300);
    } else if (currentPhase === 'dealreview') {
      if (userMessage === 'next' || userMessage === 'n') {
        goToNextProperty();
      } else {
        setTimeout(async () => {
          await streamMessage(`Based on the property at ${currentProperty.address}:\n\nThe ${currentProperty.flags.join(' and ')} flags indicate higher seller motivation. With a propensity score of ${currentProperty.propensity}, this is a strong opportunity.\n\nWould you like me to draft talking points for your call, or shall we move to the next property?`);
        }, 300);
      }
    }
  };

  const startDealReview = async () => {
    setCurrentPhase('dealreview');
    setMessages(prev => prev.filter(m => m.id !== 'start-review-button'));
    
    await streamMessage(`Loading your Deal Review...\n\nStarting with your Hot deals first, then we'll work through Warm, Cold, and New.\n\nYou have ${pipelineStats.hot} hot properties that need immediate attention today. Click the link below to start reviewing them.`);
    
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
            <span>Go to Deal Review — Hot Deals</span>
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
      await streamMessage("🎉 Great work! You've reviewed all priority properties for today.\n\nWould you like me to:\n• Generate a summary of today's review\n• Move to Daily Outreach calls\n• Exit and return to dashboard");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
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
                <p className="text-xs text-gray-500">
                  {currentPhase === 'checkin' ? 'Daily Check-In' : `Deal Review — Property ${currentPropertyIndex + 1}/${properties.length}`}
                </p>
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
  );
}

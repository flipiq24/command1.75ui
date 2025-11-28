import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Lightbulb, Flame, Clock, Phone, Home, ChevronRight, ExternalLink } from 'lucide-react';
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

export default function IQOverlay({ isOpen, onClose, userName = 'Josh', deals = [] }: IQOverlayProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'checkin' | 'dealreview'>('checkin');
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [checkinStep, setCheckinStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const properties = SAMPLE_PROPERTIES;
  const currentProperty = properties[currentPropertyIndex];

  const goToDealReview = () => {
    onClose();
    setLocation('/?filter=hot');
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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
      const greeting = `Good morning, ${userName}.\n\nI'll check you in for this beautiful ${getCurrentDate()} at ${getCurrentTime()}.\n\nYou've got a solid lineup today, so I want to make sure you're ready.\n\nAre you able to work a full day today?`;
      
      setTimeout(() => {
        streamMessage(greeting);
        setCheckinStep(1);
      }, 500);
    }
  }, [isOpen, messages.length, userName, streamMessage]);

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
        if (userMessage === 'yes' || userMessage === 'y' || userMessage.includes('yes')) {
          setTimeout(async () => {
            await streamMessage("Great — let's get moving.\n\nBefore we jump in, is there anything you already know you'll need help with today?");
            setCheckinStep(2);
          }, 300);
        } else {
          setTimeout(async () => {
            await streamMessage("No worries! Let me know when you're ready to start. Just type 'ready' when you want to begin.");
          }, 300);
        }
      } else if (checkinStep === 2) {
        if (userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing') || userMessage.includes("i'm good")) {
          setTimeout(async () => {
            await streamMessage(`Alright ${userName}, today we're going to:\n\n• Review 56 properties in Deal Review\n• Make about 30 calls to high-propensity agents\n\nIs there anything that might prevent you from getting those calls done today?`);
            setCheckinStep(3);
          }, 300);
        } else {
          setTimeout(async () => {
            await streamMessage(`Got it — I've noted that down and will notify your AM about your request.\n\nAlright ${userName}, today we're going to:\n\n• Review 56 properties in Deal Review\n• Make about 30 calls to high-propensity agents\n\nIs there anything that might prevent you from getting those calls done today?`);
            setCheckinStep(3);
          }, 300);
        }
      } else if (checkinStep === 3) {
        setTimeout(async () => {
          if (userMessage === 'no' || userMessage === 'n' || userMessage.includes('no') || userMessage.includes('nothing')) {
            await streamMessage("Perfect! You're all set. Click the button below to start reviewing your priority properties.");
          } else {
            await streamMessage(`Understood — I've logged that potential blocker. Your AM will be notified.\n\nClick the button below when you're ready to start reviewing your priority properties.`);
          }
          setCheckinStep(4);
          
          setMessages(prev => [...prev, {
            id: 'start-button',
            role: 'ai',
            content: '',
            component: (
              <button
                onClick={startDealReview}
                className="mt-4 px-6 py-3 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                Start Deal Review
              </button>
            )
          }]);
        }, 300);
      }
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
    setMessages(prev => prev.filter(m => m.id !== 'start-button'));
    
    await streamMessage("Great! I've prepared your Deal Review with Hot Deals ready to go.\n\nYou have 2 hot properties that need immediate attention today. Click the link below to start reviewing them.");
    
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
        style={{ left: '16rem' }}
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

          {/* Input Bar */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentPhase === 'dealreview' ? "Ask me anything about this property or type 'next'..." : "Type your response..."}
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  data-testid="input-iq-chat"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition",
                  inputValue.trim() && !isTyping
                    ? "bg-[#FF6600] hover:bg-[#e65c00] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
                data-testid="button-send-iq"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

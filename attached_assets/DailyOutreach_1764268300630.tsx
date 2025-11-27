import React, { useState } from 'react';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Target,
  HelpCircle,
  Mail,
  Clock,
  Phone,
  MessageSquare,
  Mic,
  Bot,
  Flame,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  Home,
  Calendar,
  DollarSign
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { useLocation } from "wouter";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Property {
  id: number;
  address: string;
  specs: string;
  price: string;
  ptfv: string; // Price to Future Value %
  dom: number; // Days on Market
  propensityScore: number;
  propensityIndicators: string[];
  status: 'Active' | 'Pending' | 'Backup';
  keywords: string[]; // Distress indicators
  agent: {
    name: string;
    phone: string;
    email: string;
    brokerage: string;
    location: string;
    relationshipStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold' | 'Unassigned';
    investorSourceCount: number;
    lastCommunication: string | null;
    lastAddressDiscussed: string | null;
  };
  whyChasing: string[];
}

interface AgentContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  brokerage: string;
  location: string;
  relationshipStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold';
  lastSpoke: string;
  daysAgo: number;
  taskType: string;
  lastInteractionType: string;
}

type OutreachType = 'connections' | 'priority' | 'topOfMind' | 'relationships';

// ============================================
// SAMPLE DATA - Properties with AA3 Logic
// ============================================

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 1,
    address: "2011 Windsor Cir, Duarte, CA 91010",
    specs: "SFR / 3 Br / 2 Ba / 1,654 ft² / 1981",
    price: "$500,000",
    ptfv: "72%",
    dom: 94,
    propensityScore: 7,
    propensityIndicators: ["Notice of Default (NOD)", "Tax Delinquency"],
    status: "Active",
    keywords: ["as is", "motivated seller", "price reduced"],
    agent: {
      name: "Sarah Jenkins",
      phone: "(909) 555-0123",
      email: "sarah.j@kw.com",
      brokerage: "Keller Williams Realty",
      location: "San Bernardino, CA",
      relationshipStatus: "Hot",
      investorSourceCount: 12,
      lastCommunication: "11/20/25",
      lastAddressDiscussed: "1845 Oak St, Fontana"
    },
    whyChasing: [
      "Aged listing at 94 DOM — seller likely more motivated",
      "PTFV at 72% indicates strong discount potential",
      "NOD + Tax Delinquency = high propensity to sell (Score: 7)",
      "Agent has 12 investor transactions — understands our process",
      "Keywords detected: 'as is', 'motivated seller', 'price reduced'"
    ]
  },
  {
    id: 2,
    address: "8832 Elm Street, Rancho Cucamonga, CA 91730",
    specs: "SFR / 4 Br / 2 Ba / 2,100 ft² / 1975",
    price: "$620,000",
    ptfv: "68%",
    dom: 112,
    propensityScore: 8,
    propensityIndicators: ["Notice of Trustee Sale (NTS)", "Vacant Property"],
    status: "Active",
    keywords: ["vacant", "court ordered", "estate sale"],
    agent: {
      name: "Michael Ross",
      phone: "(909) 555-0888",
      email: "mike.ross@c21.com",
      brokerage: "Century 21 Lois Lauer",
      location: "Redlands, CA",
      relationshipStatus: "Warm",
      investorSourceCount: 8,
      lastCommunication: "11/15/25",
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Highest propensity score (8) — NTS means imminent foreclosure",
      "112 DOM + Vacant = zero holding costs motivation",
      "PTFV at 68% — significant equity capture opportunity",
      "Agent has 8 investor transactions — familiar with cash offers",
      "Keywords: 'vacant', 'court ordered', 'estate sale'"
    ]
  },
  {
    id: 3,
    address: "1245 Oak Avenue, Ontario, CA 91764",
    specs: "SFR / 3 Br / 1 Ba / 1,200 ft² / 1955",
    price: "$450,000",
    ptfv: "75%",
    dom: 78,
    propensityScore: 5,
    propensityIndicators: ["Affidavit of Death", "High Equity (>50%)"],
    status: "Backup",
    keywords: ["probate", "heir", "as is"],
    agent: {
      name: "Jennifer Chen",
      phone: "(626) 555-0456",
      email: "jchen@remax.com",
      brokerage: "RE/MAX Premier",
      location: "Ontario, CA",
      relationshipStatus: "Cold",
      investorSourceCount: 15,
      lastCommunication: null,
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Backup position — primary buyer may fall through",
      "Probate property = motivated heirs wanting quick close",
      "Agent has 15 investor transactions — HIGH VALUE target",
      "Currently Cold relationship — opportunity to build connection",
      "High equity means flexible on price"
    ]
  },
  {
    id: 4,
    address: "40591 Chantemar Way, Temecula, CA 92591",
    specs: "SFR / 5 Br / 3 Ba / 2,558 ft² / 2000",
    price: "$580,000",
    ptfv: "71%",
    dom: 86,
    propensityScore: 4,
    propensityIndicators: ["Expired Listing", "High Mortgage / Debt"],
    status: "Active",
    keywords: ["price reduced", "bring all offers"],
    agent: {
      name: "David Martinez",
      phone: "(951) 555-0777",
      email: "dmartinez@exp.com",
      brokerage: "eXp Realty",
      location: "Temecula, CA",
      relationshipStatus: "Unassigned",
      investorSourceCount: 22,
      lastCommunication: null,
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Unassigned agent with 22 investor transactions — WHALE ALERT",
      "86 DOM + 'bring all offers' = seller exhausted",
      "High mortgage debt means motivated to avoid foreclosure",
      "PTFV at 71% — solid spread potential",
      "First contact = opportunity to build new relationship"
    ]
  }
];

// Sample Priority/Hot/Warm/Cold agents for Top of Mind campaigns
const SAMPLE_AGENTS: AgentContact[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    phone: "(909) 555-0123",
    email: "sarah.j@kw.com",
    brokerage: "Keller Williams Realty",
    location: "San Bernardino, CA",
    relationshipStatus: "Priority",
    lastSpoke: "11/20/25",
    daysAgo: 5,
    taskType: "Call today",
    lastInteractionType: "Last Spoke"
  },
  {
    id: 2,
    name: "Michael Ross",
    phone: "(909) 555-0888",
    email: "mike.ross@c21.com",
    brokerage: "Century 21 Lois Lauer",
    location: "Redlands, CA",
    relationshipStatus: "Hot",
    lastSpoke: "11/24/25",
    daysAgo: 2,
    taskType: "Check email",
    lastInteractionType: "Left Voicemail"
  },
  {
    id: 3,
    name: "Jennifer Chen",
    phone: "(626) 555-0456",
    email: "jchen@remax.com",
    brokerage: "RE/MAX Premier",
    location: "Ontario, CA",
    relationshipStatus: "Warm",
    lastSpoke: "11/18/25",
    daysAgo: 8,
    taskType: "Send market update",
    lastInteractionType: "Email Sent"
  },
  {
    id: 4,
    name: "Robert Kim",
    phone: "(714) 555-0999",
    email: "rkim@compass.com",
    brokerage: "Compass",
    location: "Irvine, CA",
    relationshipStatus: "Cold",
    lastSpoke: "10/15/25",
    daysAgo: 42,
    taskType: "Re-engage",
    lastInteractionType: "No Response"
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getPropensityColor = (indicator: string) => {
  const t = indicator.toLowerCase();
  if (t.includes("trustee") || t.includes("default") || t.includes("tax") || t.includes("death") || t.includes("bankruptcy")) return "text-red-600 bg-red-50";
  if (t.includes("lien") || t.includes("expired") || t.includes("vacant") || t.includes("debt") || t.includes("equity") || t.includes("owner") || t.includes("years")) return "text-green-600 bg-green-50";
  if (t.includes("trust") || t.includes("corporate") || t.includes("multiple") || t.includes("adjustable") || t.includes("free") || t.includes("transferred")) return "text-blue-600 bg-blue-50";
  return "text-gray-600 bg-gray-50";
};

const getRelationshipColor = (status: string) => {
  switch (status) {
    case 'Priority': return 'bg-orange-500 text-white';
    case 'Hot': return 'bg-red-500 text-white';
    case 'Warm': return 'bg-yellow-500 text-white';
    case 'Cold': return 'bg-blue-500 text-white';
    case 'Unassigned': return 'bg-gray-400 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const getRelationshipBadgeColor = (status: string) => {
  switch (status) {
    case 'Priority': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Hot': return 'bg-red-50 text-red-600 border-red-200';
    case 'Warm': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    case 'Cold': return 'bg-blue-50 text-blue-600 border-blue-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DailyOutreach() {
  const [location] = useLocation();
  
  // Current view state
  const [activeSection, setActiveSection] = useState<OutreachType>('connections');
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  
  // Progress tracking
  const [connectionsCompleted, setConnectionsCompleted] = useState(3);
  const [priorityCallsCompleted, setPriorityCallsCompleted] = useState(1);
  const [topOfMindCompleted, setTopOfMindCompleted] = useState(2);
  const [newRelationships, setNewRelationships] = useState(1);
  
  // Campaign counts
  const campaignCounts = {
    priority: 6,
    hot: 75,
    warm: 52,
    cold: 180
  };

  const currentProperty = SAMPLE_PROPERTIES[currentPropertyIndex];
  const currentAgent = SAMPLE_AGENTS[currentAgentIndex];
  
  const handleNextProperty = () => {
    if (currentPropertyIndex < SAMPLE_PROPERTIES.length - 1) {
      setCurrentPropertyIndex(prev => prev + 1);
    }
  };
  
  const handlePrevProperty = () => {
    if (currentPropertyIndex > 0) {
      setCurrentPropertyIndex(prev => prev - 1);
    }
  };

  const handleNextAgent = () => {
    if (currentAgentIndex < SAMPLE_AGENTS.length - 1) {
      setCurrentAgentIndex(prev => prev + 1);
    }
  };
  
  const handlePrevAgent = () => {
    if (currentAgentIndex > 0) {
      setCurrentAgentIndex(prev => prev - 1);
    }
  };

  // Simulate call connection (increments counter)
  const handleCallConnected = () => {
    if (activeSection === 'connections') {
      setConnectionsCompleted(prev => Math.min(prev + 1, 30));
    } else if (activeSection === 'priority') {
      setPriorityCallsCompleted(prev => Math.min(prev + 1, 5));
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Wednesday, November 26</div>
            <h1 className="text-xl font-bold text-gray-900">Daily Outreach</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* New Relationships Goal - Top Right */}
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                New Agent Relationships
                <HelpCircle className="w-3 h-3" />
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {newRelationships}<span className="text-gray-300">/5</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          
          {/* ============================================ */}
          {/* OUTREACH ACTION PLAN - 4 Circles */}
          {/* ============================================ */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Nov 26, 2025 — Outreach Plan</h2>
                <p className="text-sm text-gray-500">AGENTS TO CONTACT TODAY:</p>
              </div>
              
              {/* Campaign Counts Dashboard */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-gray-600">Priority: <span className="font-bold">{campaignCounts.priority}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-gray-600">Hot: <span className="font-bold">{campaignCounts.hot}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-gray-600">Warm: <span className="font-bold">{campaignCounts.warm}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600">Cold: <span className="font-bold">{campaignCounts.cold}</span></span>
                </div>
              </div>
            </div>

            {/* 4 Activity Circles */}
            <div className="grid grid-cols-4 gap-6">
              
              {/* Circle 1: 30 Agent Connections */}
              <div 
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all",
                  activeSection === 'connections' ? "bg-orange-50 border-2 border-orange-300" : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setActiveSection('connections')}
              >
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke="#f97316" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${(connectionsCompleted / 30) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{connectionsCompleted}<span className="text-gray-400">/30</span></span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mb-1">Status: {connectionsCompleted}/30/30</div>
                <div className="font-semibold text-gray-900 text-center">Agent Connections</div>
                <button 
                  className={cn(
                    "mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === 'connections' 
                      ? "bg-orange-500 text-white" 
                      : "bg-white border border-orange-300 text-orange-600 hover:bg-orange-50"
                  )}
                >
                  Start Calling
                </button>
              </div>

              {/* Circle 2: Priority Calls */}
              <div 
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all",
                  activeSection === 'priority' ? "bg-orange-50 border-2 border-orange-300" : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setActiveSection('priority')}
              >
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke="#f97316" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${(priorityCallsCompleted / 5) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{priorityCallsCompleted}<span className="text-gray-400">/5</span></span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mb-1">Status: {priorityCallsCompleted}/5/5</div>
                <div className="font-semibold text-gray-900 text-center">Priority Calls</div>
                <button 
                  className={cn(
                    "mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === 'priority' 
                      ? "bg-orange-500 text-white" 
                      : "bg-white border border-orange-300 text-orange-600 hover:bg-orange-50"
                  )}
                >
                  Call Priority
                </button>
              </div>

              {/* Circle 3: Top of Mind Campaigns */}
              <div 
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all",
                  activeSection === 'topOfMind' ? "bg-gray-100 border-2 border-gray-400" : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setActiveSection('topOfMind')}
              >
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke="#6b7280" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${(topOfMindCompleted / 15) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{topOfMindCompleted}<span className="text-gray-400">/15</span></span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mb-1">Status: {topOfMindCompleted}/15/15</div>
                <div className="font-semibold text-gray-900 text-center">Top of Mind</div>
                <button 
                  className={cn(
                    "mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === 'topOfMind' 
                      ? "bg-gray-600 text-white" 
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  Send Campaigns
                </button>
              </div>

              {/* Circle 4: New Leads */}
              <div 
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all",
                  activeSection === 'relationships' ? "bg-gray-100 border-2 border-gray-400" : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setActiveSection('relationships')}
              >
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke="#6b7280" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray="0 220"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">0<span className="text-gray-400">/0</span></span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mb-1">Status: 0/0/0</div>
                <div className="font-semibold text-gray-900 text-center">New Leads</div>
                <button 
                  className={cn(
                    "mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === 'relationships' 
                      ? "bg-gray-600 text-white" 
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  Process Leads
                </button>
              </div>

            </div>
          </div>

          {/* ============================================ */}
          {/* MAIN CONTENT AREA - One Property at a Time */}
          {/* ============================================ */}
          
          {(activeSection === 'connections' || activeSection === 'priority') && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Navigation Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrevProperty}
                    disabled={currentPropertyIndex === 0}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Property {currentPropertyIndex + 1} of {SAMPLE_PROPERTIES.length}
                  </span>
                  <button 
                    onClick={handleNextProperty}
                    disabled={currentPropertyIndex === SAMPLE_PROPERTIES.length - 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <button 
                  onClick={handleNextProperty}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Next Property <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* WHY ARE WE CHASING THIS PROPERTY? */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100 px-6 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Why Are We Chasing This Property?</h3>
                </div>
                <ul className="space-y-2">
                  {currentProperty.whyChasing.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Property Card */}
              <div className="p-6">
                <div className="flex gap-6">
                  
                  {/* Left: Property Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                        currentProperty.status === 'Active' ? "bg-green-100 text-green-700" :
                        currentProperty.status === 'Pending' ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {currentProperty.status}
                      </span>
                      <span className="text-sm text-gray-500">{currentProperty.dom} Days on Market</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{currentProperty.address}</h2>
                    <p className="text-sm text-gray-500 mb-4">{currentProperty.specs}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">List Price</div>
                        <div className="text-xl font-bold text-gray-900">{currentProperty.price}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price to Future Value</div>
                        <div className="text-xl font-bold text-green-600">{currentProperty.ptfv}</div>
                      </div>
                    </div>

                    {/* Propensity Indicators */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Propensity Score: <span className="font-bold text-gray-900">{currentProperty.propensityScore}/8</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentProperty.propensityIndicators.map((indicator, idx) => (
                          <span key={idx} className={cn("px-2 py-1 rounded text-xs font-medium", getPropensityColor(indicator))}>
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Distress Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {currentProperty.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Agent Details & Actions */}
                  <div className="w-80 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">Listing Agent</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        getRelationshipColor(currentProperty.agent.relationshipStatus)
                      )}>
                        {currentProperty.agent.relationshipStatus}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="font-semibold text-gray-900">{currentProperty.agent.name}</div>
                      <div className="text-sm text-gray-500">{currentProperty.agent.brokerage}</div>
                      <div className="text-sm text-gray-500">{currentProperty.agent.location}</div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Phone: </span>
                        <span className="font-medium text-gray-900">{currentProperty.agent.phone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Email: </span>
                        <span className="font-medium text-blue-600">{currentProperty.agent.email}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Investor Transactions: </span>
                        <span className="font-bold text-orange-600">{currentProperty.agent.investorSourceCount}</span>
                      </div>
                    </div>

                    {currentProperty.agent.lastCommunication && (
                      <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Last Communication</div>
                        <div className="text-sm font-medium text-gray-900">{currentProperty.agent.lastCommunication}</div>
                        {currentProperty.agent.lastAddressDiscussed && (
                          <div className="text-xs text-gray-500 mt-1">
                            Re: {currentProperty.agent.lastAddressDiscussed}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Call to Action */}
                    <div className="space-y-2">
                      <button 
                        onClick={handleCallConnected}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        Call Agent
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button className="flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          Text
                        </button>
                        <button className="flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm transition-colors">
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button className="flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm transition-colors">
                          <Mic className="w-4 h-4" />
                          VM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Script */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Suggested Script</span>
                  </div>
                  <p className="text-sm text-blue-800 italic">
                    "Hey {currentProperty.agent.name.split(' ')[0]}, this is Tony from FlipIQ. 
                    I noticed {currentProperty.address} has been on the market {currentProperty.dom} days and the price is {currentProperty.ptfv} below ARV. 
                    We're proven investors that move quickly — wanted to see if your seller is open to a quick close cash offer?"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top of Mind Campaign View */}
          {activeSection === 'topOfMind' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Top of Mind Campaigns — Hot, Warm, Cold Agents</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Bulk Text
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Bulk Email
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                    <Mic className="w-4 h-4" /> Bulk Voicemail
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">
                  Send text, email, and direct-to-voicemail campaigns to stay top of mind with your Hot, Warm, and Cold relationships.
                </p>
                
                {/* Agent List for Top of Mind */}
                <div className="space-y-3">
                  {SAMPLE_AGENTS.filter(a => a.relationshipStatus !== 'Priority').map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          getRelationshipColor(agent.relationshipStatus)
                        )}>
                          {agent.relationshipStatus}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.brokerage} • {agent.location}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        <div>{agent.lastInteractionType}: {agent.lastSpoke}</div>
                        <div className="text-xs text-gray-400">{agent.daysAgo} days ago</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Mic className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

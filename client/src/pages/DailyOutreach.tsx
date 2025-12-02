import React, { useState, useMemo, useEffect, useCallback, useLayoutEffect } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import OutreachActionPlan, { OutreachType } from "@/components/OutreachActionPlan";
import PriorityAgentPanel from "@/components/PriorityAgentPanel";
import StatusPipelineWidget from "@/components/StatusPipelineWidget";
import { useLayout } from "@/components/Layout";
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessagesSquare,
  Target,
  Flame,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Bot,
  Lightbulb,
  Plus,
  Globe,
  Sparkles,
  Check,
  AlertTriangle,
  X,
  Users,
  Building2,
  Calendar,
  Play,
  Square,
  Send,
  Clock,
  FileText,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Deal {
  id: number;
  address: string;
  specs: string;
  price: string;
  propensity: string | string[];
  source: string;
  mlsStatus?: string;
  type: 'hot' | 'warm' | 'cold' | 'new';
  status: string;
  statusPercent: string;
  lastOpen: string;
  lastCalled: string;
  isHot?: boolean;
}

interface Agent {
  id: number;
  agentName: string;
  officeName: string;
  phone: string;
  email: string;
  assignedUser: string;
  relationshipStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold' | 'Unknown';
  basket: 'Clients' | 'High Value' | 'Low Value';
  requiredAction: number;
  followUpStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold' | 'Unknown' | 'Attempt 5';
  followUpDate: string;
  investorSourceCount: number | null;
  activeInLastTwoYears: boolean;
  pending: number;
  backup: number;
  sold: number;
}

const PRIORITY_AGENTS: Agent[] = [
  {
    id: 1,
    agentName: "Jeremy Flores",
    officeName: "ABC Realty",
    phone: "2135367426",
    email: "jeremydtla@gmail.com",
    assignedUser: "Michael May",
    relationshipStatus: "Priority",
    basket: "Clients",
    requiredAction: 0,
    followUpStatus: "Attempt 5",
    followUpDate: "11/27/2025",
    investorSourceCount: 9,
    activeInLastTwoYears: true,
    pending: 0,
    backup: 0,
    sold: 6
  },
  {
    id: 2,
    agentName: "Brian Tran",
    officeName: "HPT Realty",
    phone: "714-501-1770",
    email: "briantran3154@gmail.com",
    assignedUser: "Josh Santos",
    relationshipStatus: "Priority",
    basket: "High Value",
    requiredAction: 0,
    followUpStatus: "Priority",
    followUpDate: "11/23/2025",
    investorSourceCount: 2,
    activeInLastTwoYears: true,
    pending: 1,
    backup: 0,
    sold: 0
  },
  {
    id: 3,
    agentName: "Brian Meuse",
    officeName: "Desert Sky Real Estate Inc",
    phone: "760-329-7892",
    email: "desertproperty4u@msn.com",
    assignedUser: "Josh Santos",
    relationshipStatus: "Priority",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Priority",
    followUpDate: "N/A",
    investorSourceCount: 3,
    activeInLastTwoYears: true,
    pending: 3,
    backup: 1,
    sold: 3
  },
  {
    id: 4,
    agentName: "Jihe Xu",
    officeName: "Carefree Realty & Management",
    phone: "858-699-1693",
    email: "xujihe@gmail.com",
    assignedUser: "Josh Santos",
    relationshipStatus: "Priority",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Priority",
    followUpDate: "N/A",
    investorSourceCount: null,
    activeInLastTwoYears: false,
    pending: 0,
    backup: 0,
    sold: 0
  },
  {
    id: 5,
    agentName: "Salvador Armijo",
    officeName: "CARNAVAL REALTY",
    phone: "626-290-0373",
    email: "salvadorarmijo007@gmail.com",
    assignedUser: "Josh Santos",
    relationshipStatus: "Priority",
    basket: "High Value",
    requiredAction: 0,
    followUpStatus: "Priority",
    followUpDate: "N/A",
    investorSourceCount: null,
    activeInLastTwoYears: true,
    pending: 3,
    backup: 0,
    sold: 1
  }
];

const CAMPAIGN_SEGMENTS = {
  hot: {
    total: 35,
    todaysCampaign: 4,
    lastCommunication: '11/15/2025',
    lastTemplate: 'Market Update Q4',
    agents: [
      { id: 101, agentName: 'Jennifer Martinez', officeName: 'Century 21 Premier', phone: '714-555-1234', email: 'jmartinez@c21.com', assignedUser: 'Josh Santos', relationshipStatus: 'Hot', basket: 'High Value', followUpStatus: 'Active', followUpDate: '11/20/2025', investorSourceCount: 8, activeInLastTwoYears: true },
      { id: 102, agentName: 'Michael Chen', officeName: 'RE/MAX Elite', phone: '949-555-5678', email: 'mchen@remax.com', assignedUser: 'Sarah Johnson', relationshipStatus: 'Hot', basket: 'High Value', followUpStatus: 'Pending', followUpDate: '11/22/2025', investorSourceCount: 12, activeInLastTwoYears: true },
      { id: 103, agentName: 'David Thompson', officeName: 'Keller Williams Realty', phone: '562-555-9012', email: 'dthompson@kw.com', assignedUser: 'Josh Santos', relationshipStatus: 'Hot', basket: 'Medium Value', followUpStatus: 'Active', followUpDate: '11/18/2025', investorSourceCount: 5, activeInLastTwoYears: true },
      { id: 104, agentName: 'Lisa Anderson', officeName: 'Coldwell Banker', phone: '310-555-3456', email: 'landerson@cb.com', assignedUser: 'Mike Wilson', relationshipStatus: 'Hot', basket: 'High Value', followUpStatus: 'Scheduled', followUpDate: '11/25/2025', investorSourceCount: 15, activeInLastTwoYears: true },
    ]
  },
  warm: {
    total: 51,
    todaysCampaign: 5,
    lastCommunication: '11/10/2025',
    lastTemplate: 'New Listings Alert',
    agents: [
      { id: 201, agentName: 'Robert Williams', officeName: 'Berkshire Hathaway', phone: '818-555-1111', email: 'rwilliams@bh.com', assignedUser: 'Josh Santos', relationshipStatus: 'Warm', basket: 'Medium Value', followUpStatus: 'Active', followUpDate: '11/12/2025', investorSourceCount: 3, activeInLastTwoYears: true },
      { id: 202, agentName: 'Emily Davis', officeName: 'Sothebys International', phone: '323-555-2222', email: 'edavis@sothebys.com', assignedUser: 'Sarah Johnson', relationshipStatus: 'Warm', basket: 'High Value', followUpStatus: 'Pending', followUpDate: '11/14/2025', investorSourceCount: 6, activeInLastTwoYears: true },
      { id: 203, agentName: 'James Wilson', officeName: 'eXp Realty', phone: '626-555-3333', email: 'jwilson@exp.com', assignedUser: 'Josh Santos', relationshipStatus: 'Warm', basket: 'Low Value', followUpStatus: 'Active', followUpDate: '11/16/2025', investorSourceCount: 2, activeInLastTwoYears: false },
      { id: 204, agentName: 'Amanda Brown', officeName: 'Compass Real Estate', phone: '714-555-4444', email: 'abrown@compass.com', assignedUser: 'Mike Wilson', relationshipStatus: 'Warm', basket: 'Medium Value', followUpStatus: 'Scheduled', followUpDate: '11/19/2025', investorSourceCount: 4, activeInLastTwoYears: true },
      { id: 205, agentName: 'Christopher Lee', officeName: 'HomeSmart Realty', phone: '949-555-5555', email: 'clee@homesmart.com', assignedUser: 'Josh Santos', relationshipStatus: 'Warm', basket: 'Medium Value', followUpStatus: 'Active', followUpDate: '11/21/2025', investorSourceCount: 5, activeInLastTwoYears: true },
    ]
  },
  cold: {
    total: 50,
    todaysCampaign: 5,
    lastCommunication: '11/01/2025',
    lastTemplate: 'Re-engagement',
    agents: [
      { id: 301, agentName: 'Patricia Garcia', officeName: 'Exit Realty', phone: '562-555-6666', email: 'pgarcia@exit.com', assignedUser: 'Josh Santos', relationshipStatus: 'Cold', basket: 'Low Value', followUpStatus: 'Inactive', followUpDate: '10/15/2025', investorSourceCount: 1, activeInLastTwoYears: false },
      { id: 302, agentName: 'Kevin Johnson', officeName: 'Redfin', phone: '310-555-7777', email: 'kjohnson@redfin.com', assignedUser: 'Sarah Johnson', relationshipStatus: 'Cold', basket: 'Medium Value', followUpStatus: 'Inactive', followUpDate: '10/20/2025', investorSourceCount: 2, activeInLastTwoYears: false },
      { id: 303, agentName: 'Michelle White', officeName: 'Weichert Realtors', phone: '818-555-8888', email: 'mwhite@weichert.com', assignedUser: 'Josh Santos', relationshipStatus: 'Cold', basket: 'Low Value', followUpStatus: 'Re-engage', followUpDate: '10/25/2025', investorSourceCount: 0, activeInLastTwoYears: false },
      { id: 304, agentName: 'Steven Taylor', officeName: 'Real Living', phone: '323-555-9999', email: 'staylor@realliving.com', assignedUser: 'Mike Wilson', relationshipStatus: 'Cold', basket: 'Low Value', followUpStatus: 'Inactive', followUpDate: '10/30/2025', investorSourceCount: 1, activeInLastTwoYears: false },
      { id: 305, agentName: 'Nancy Moore', officeName: 'Better Homes', phone: '626-555-0000', email: 'nmoore@bhg.com', assignedUser: 'Josh Santos', relationshipStatus: 'Cold', basket: 'Medium Value', followUpStatus: 'Re-engage', followUpDate: '11/02/2025', investorSourceCount: 3, activeInLastTwoYears: true },
    ]
  }
};

const CAMPAIGN_TEMPLATES = {
  text: ['Quick Check-In', 'New Listing Alert', 'Market Update', 'Just Sold Nearby', 'Holiday Greeting'],
  email: ['Monthly Market Report', 'New Listings in Your Area', 'Investment Opportunity', 'Re-engagement - Miss You', 'Quarterly Newsletter'],
  voicemail: ['Quick Hello', 'Checking In', 'New Opportunity', 'Following Up']
};

const getPropensityScore = (propensity: string | string[]) => {
  if (!Array.isArray(propensity)) return 0;
  
  let score = 0;
  propensity.forEach(p => {
    const item = PROPENSITY_LEGEND.find(l => l.indicator === p);
    if (item) score += item.points;
  });
  return score;
};

interface StreamingLine {
  type: 'stat' | 'header' | 'bullet' | 'action';
  label?: string;
  value?: string;
  isLink?: boolean;
  linkUrl?: string;
  color?: string;
  isDiveIn?: boolean;
}

const useTypingEffect = (lines: StreamingLine[], triggerKey: number) => {
  const [displayedLines, setDisplayedLines] = useState<Map<number, string>>(() => new Map());
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useLayoutEffect(() => {
    setDisplayedLines(new Map());
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsComplete(false);
    setCursorVisible(true);
  }, [triggerKey]);

  useEffect(() => {
    if (isComplete) return;
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [isComplete]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      setCursorVisible(false);
      return;
    }

    const currentLine = lines[currentLineIndex];
    let fullText = '';
    
    if (currentLine.type === 'stat' && currentLine.label && currentLine.value) {
      fullText = `${currentLine.label}: ${currentLine.value}`;
    } else if (currentLine.type === 'header' && currentLine.value) {
      fullText = currentLine.value;
    } else if (currentLine.type === 'bullet' && currentLine.value) {
      fullText = currentLine.value;
    } else if (currentLine.type === 'action' && currentLine.value) {
      fullText = currentLine.value;
    }

    if (currentCharIndex >= fullText.length) {
      const pauseTime = currentLine.type === 'header' ? 80 : 40;
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    const randomDelay = Math.floor(Math.random() * 2) + 1;
    const timeout = setTimeout(() => {
      setDisplayedLines(prev => {
        const newMap = new Map(prev);
        newMap.set(currentLineIndex, fullText.slice(0, currentCharIndex + 1));
        return newMap;
      });
      setCurrentCharIndex(prev => prev + 1);
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex, lines, triggerKey]);

  const showCursor = cursorVisible && !isComplete;

  return { displayedLines, currentLineIndex, isComplete, showCursor };
};


const STATUS_OPTIONS = [
  { percent: "100%", label: "Acquired" },
  { percent: "80%", label: "Offer Accepted" },
  { percent: "60%", label: "In Negotiations" },
  { percent: "50%", label: "Contract Submitted" },
  { percent: "30%", label: "Back Up" },
  { percent: "30%", label: "Offer Terms Sent" },
  { percent: "20%", label: "Continue to Follow" },
  { percent: "10%", label: "Initial Contact Started" },
  { percent: "0%", label: "Cancelled FEC" },
  { percent: "0%", label: "DO NOT USE" },
  { percent: "0%", label: "None" },
  { percent: "0%", label: "Pass" },
  { percent: "0%", label: "Sold Others/Closed" },
];

const PROPENSITY_LEGEND = [
  { color: "text-red-500", label: "🔴 RED", indicator: "Notice of Trustee Sale (NTS)", category: "Foreclosure", points: 8, source: "Foreclosure Status / Auction Date" },
  { color: "text-red-500", label: "🔴 RED", indicator: "Notice of Default (NOD)", category: "Foreclosure", points: 6, source: "Foreclosure Status / Recording Date" },
  { color: "text-red-500", label: "🔴 RED", indicator: "Tax Delinquency", category: "Financial", points: 5, source: "Tax Status / Total Tax Due" },
  { color: "text-red-500", label: "🔴 RED", indicator: "Affidavit of Death", category: "Life Event", points: 5, source: "Transfer Document Type / Grantor Name" },
  { color: "text-red-500", label: "🔴 RED", indicator: "Bankruptcy / Judgment", category: "Financial", points: 4, source: "Involuntary Liens (Bankruptcy Flag)" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "Involuntary Liens", category: "Financial", points: 3, source: "Lien Type (HOA, Mechanics, Judgment)" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "Expired Listing", category: "Market Status", points: 3, source: "Listing Status (Expired, Withdrawn, Canceled)" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "Vacant Property", category: "Occupancy", points: 2, source: "Vacancy Status (USPS Data)" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "High Mortgage / Debt", category: "Financial", points: 2, source: "Open Loans / Estimated Equity" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "Non-Owner Occupied", category: "Occupancy", points: 2, source: "Absentee Owner (Yes/No)" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "High Equity (>50%)", category: "Financial", points: 2, source: "Estimated Equity %" },
  { color: "text-green-500", label: "🟢 GREEN", indicator: "Long Term Owner (20+ Yrs)", category: "Ownership", points: 2, source: "Last Sale Date" },
  { color: "text-blue-500", label: "🔵 BLUE", indicator: "Corporate / Trust Owned", category: "Ownership", points: 1, source: "Owner Type (Trust, LLC, Corp)" },
  { color: "text-blue-500", label: "🔵 BLUE", indicator: "Owns Multiple Properties", category: "Ownership", points: 1, source: "Properties Owned Count" },
  { color: "text-blue-500", label: "🔵 BLUE", indicator: "Adjustable Rate Mortgage", category: "Financial", points: 1, source: "Loan Rate Type (ARM vs Fixed)" },
  { color: "text-blue-500", label: "🔵 BLUE", indicator: "Free & Clear", category: "Financial", points: 1, source: "Open Loans = 0" },
  { color: "text-blue-500", label: "🔵 BLUE", indicator: "Transferred in Last 2 Years", category: "Ownership", points: 0, source: "Last Sale Date" },
];

const getPropensityColor = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("trustee") || t.includes("default") || t.includes("tax") || t.includes("death") || t.includes("bankruptcy")) return "text-red-600";
  if (t.includes("lien") || t.includes("expired") || t.includes("vacant") || t.includes("debt") || t.includes("equity") || t.includes("owner") || t.includes("years")) return "text-green-600";
  if (t.includes("trust") || t.includes("corporate") || t.includes("multiple") || t.includes("adjustable") || t.includes("free") || t.includes("transferred")) return "text-blue-600";
  return "text-gray-500";
};

function DailyOutreachContent() {
  const [, setLocation] = useLocation();
  const { openIQWithCelebration } = useLayout();
  const [activeFilter, setActiveFilter] = useState<OutreachType | null>('connections');
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  const [iQViewMode, setIQViewMode] = useState<'stats' | 'description'>('stats');
  const [propertyStory, setPropertyStory] = useState<string>('');
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [connectionsMade, setConnectionsMade] = useState(0);
  const [iqRevealKey, setIqRevealKey] = useState(0);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [formFields, setFormFields] = useState<Record<number, {
    offerStatus: string;
    todo: string;
    notes: string;
    assignedUser: string;
    relationshipStatus: string;
    followUpStatus: string;
    followUpDate: string;
  }>>({});
  const queryClient = useQueryClient();
  
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [priorityCallsMade, setPriorityCallsMade] = useState(0);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [showAgentIQModal, setShowAgentIQModal] = useState(false);
  const [agentIQReport, setAgentIQReport] = useState<string>('');
  const [isLoadingAgentIQ, setIsLoadingAgentIQ] = useState(false);
  const [showAgentValidationModal, setShowAgentValidationModal] = useState(false);
  const [agentFormFields, setAgentFormFields] = useState<Record<number, {
    notes: string;
    relationshipStatus: string;
    followUpStatus: string;
  }>>({});
  const [agentCallsMade, setAgentCallsMade] = useState<Record<number, boolean>>({});
  const [showCallFirstWarning, setShowCallFirstWarning] = useState(false);
  const [campaignSegments, setCampaignSegments] = useState([
    { 
      id: 'hot' as const, label: 'High Priority', color: 'red' as const,
      total: 35, pending: 4, 
      lastDate: '11/15/25', 
      lastTemplate: 'Market Update Q4',
      templateContent: "Hey [Name], market shifted 2% this week. Here are the stats...",
      selected: true 
    },
    { 
      id: 'warm' as const, label: 'Medium Priority', color: 'yellow' as const,
      total: 51, pending: 5, 
      lastDate: '11/10/25', 
      lastTemplate: 'New Listings Alert',
      templateContent: "Just got 3 new off-market deals in Riverside. Interested?",
      selected: false 
    },
    { 
      id: 'cold' as const, label: 'Low Priority', color: 'blue' as const,
      total: 50, pending: 5, 
      lastDate: '11/01/25', 
      lastTemplate: 'Re-engagement v2',
      templateContent: "It's been a while! Are you still working with investors?",
      selected: false 
    }
  ]);
  const [campaignChannels, setCampaignChannels] = useState({ sms: true, email: false, vm: false });

  const toggleCampaignSegment = (id: string) => {
    setCampaignSegments(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const toggleCampaignChannel = (ch: 'sms' | 'email' | 'vm') => {
    setCampaignChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days ago`;
  };

  const campaignTotal = campaignSegments.filter(s => s.selected).reduce((a, c) => a + c.pending, 0);
  
  const priorityAgents = PRIORITY_AGENTS;
  const currentAgent = priorityAgents[currentAgentIndex];
  
  const getCurrentAgentFields = () => {
    const agentId = currentAgent?.id;
    if (!agentId) return null;
    return agentFormFields[agentId] || {
      notes: '',
      relationshipStatus: currentAgent?.relationshipStatus || 'Unknown',
      followUpStatus: ''
    };
  };
  
  const updateAgentFormField = (field: string, value: string) => {
    const agentId = currentAgent?.id;
    if (!agentId) return;
    setAgentFormFields(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId] || { notes: '', relationshipStatus: currentAgent?.relationshipStatus || 'Unknown', followUpStatus: '' },
        [field]: value
      }
    }));
  };
  
  const validateAgentFields = () => {
    const fields = getCurrentAgentFields();
    if (!fields) return { isValid: true, missing: [], completed: [] };
    
    const requiredFields = [
      { key: 'notes', label: 'Notes', value: fields.notes },
      { key: 'relationshipStatus', label: 'Relationship Status', value: fields.relationshipStatus },
      { key: 'followUpStatus', label: 'Follow Up Status', value: fields.followUpStatus },
    ];
    
    const missing = requiredFields.filter(f => !f.value || f.value === '' || f.value === 'Unknown');
    const completed = requiredFields.filter(f => f.value && f.value !== '' && f.value !== 'Unknown');
    
    return {
      isValid: missing.length === 0,
      missing,
      completed
    };
  };
  
  const handlePrevAgent = () => {
    if (currentAgentIndex > 0) {
      setCurrentAgentIndex(prev => prev - 1);
      setShowAgentIQModal(false);
    }
  };
  
  const handleNextAgent = () => {
    if (currentAgentIndex < priorityAgents.length - 1) {
      const validation = validateAgentFields();
      if (!validation.isValid) {
        setShowAgentValidationModal(true);
        return;
      }
      setCurrentAgentIndex(prev => prev + 1);
      setShowAgentIQModal(false);
    }
  };
  
  const handleSkipAgentAnyway = () => {
    setShowAgentValidationModal(false);
    if (currentAgentIndex < priorityAgents.length - 1) {
      setCurrentAgentIndex(prev => prev + 1);
      setShowAgentIQModal(false);
    }
  };
  
  const handleCallNow = () => {
    setPriorityCallsMade(prev => prev + 1);
    if (currentAgent) {
      setAgentCallsMade(prev => ({ ...prev, [currentAgent.id]: true }));
    }
    window.open(`tel:${currentAgent?.phone}`, '_self');
  };
  
  const handleTextEmailClick = (action: 'text' | 'email') => {
    if (!currentAgent || !agentCallsMade[currentAgent.id]) {
      setShowCallFirstWarning(true);
      return;
    }
    if (action === 'text') {
      window.open(`sms:${currentAgent?.phone}`, '_self');
    } else {
      window.open(`mailto:${currentAgent?.email}`, '_self');
    }
  };
  
  const handleSelectAgent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAgentIds(prev => [...prev, id]);
    } else {
      setSelectedAgentIds(prev => prev.filter(agentId => agentId !== id));
    }
  };
  
  const handleGenerateAgentIQReport = async () => {
    if (!currentAgent) return;
    
    setIsLoadingAgentIQ(true);
    setShowAgentIQModal(true);
    setAgentIQReport('');
    
    try {
      const response = await fetch('/api/ai/agent-iq-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentData: {
            agentName: currentAgent.agentName,
            officeName: currentAgent.officeName,
            phone: currentAgent.phone,
            email: currentAgent.email,
            assignedUser: currentAgent.assignedUser,
            relationshipStatus: currentAgent.relationshipStatus,
            basket: currentAgent.basket,
            followUpStatus: currentAgent.followUpStatus,
            followUpDate: currentAgent.followUpDate,
            investorSourceCount: currentAgent.investorSourceCount,
            activeInLastTwoYears: currentAgent.activeInLastTwoYears,
          }
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const data = await response.json();
      setAgentIQReport(data.report);
    } catch (error) {
      console.error('Error generating Agent iQ Report:', error);
      setAgentIQReport('Unable to generate report. Please try again.');
    } finally {
      setIsLoadingAgentIQ(false);
    }
  };
  
  const totalDeals = 30;
  const dailyGoal = 30;
  const isStartMode = currentIndex === 0;
  
  const triggerIQAnimation = () => {
    setIqRevealKey(prev => prev + 1);
  };
  
  const handleStart = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setActiveFilter('connections');
    triggerIQAnimation();
  };

  // Reset state when activeFilter changes
  useEffect(() => {
    setCurrentIndex(0);
    setCurrentAgentIndex(0);
    setFormFields({});
    setAgentFormFields({});
    setSelectedDealIds([]);
    setSelectedAgentIds([]);
    triggerIQAnimation();
  }, [activeFilter]);
  
  const getCurrentDealFields = () => {
    const dealId = filteredDeals[currentIndex]?.id;
    if (!dealId) return null;
    return formFields[dealId] || {
      offerStatus: '',
      todo: '',
      notes: '',
      assignedUser: '',
      relationshipStatus: '',
      followUpStatus: '',
      followUpDate: ''
    };
  };

  const updateFormField = (field: string, value: string) => {
    const dealId = filteredDeals[currentIndex]?.id;
    if (!dealId) return;
    setFormFields(prev => ({
      ...prev,
      [dealId]: {
        ...prev[dealId] || {
          offerStatus: '',
          todo: '',
          notes: '',
          assignedUser: '',
          relationshipStatus: '',
          followUpStatus: '',
          followUpDate: ''
        },
        [field]: value
      }
    }));
  };

  const validateFields = () => {
    const fields = getCurrentDealFields();
    if (!fields) return { isValid: true, missing: [], completed: [] };
    
    const validationRules = [
      { key: 'offerStatus', label: 'Offer Status', isComplete: !!fields.offerStatus },
      { key: 'todo', label: 'ToDo', isComplete: !!fields.todo },
      { key: 'notes', label: 'Notes - If call connected', isComplete: !!fields.notes },
      { key: 'assignedUser', label: 'Assign Users', isComplete: !!fields.assignedUser },
      { key: 'relationshipStatus', label: 'Relationship Status', isComplete: !!fields.relationshipStatus },
      { key: 'followUpStatus', label: 'Follow Up Status', isComplete: !!fields.followUpStatus },
      { key: 'followUpDate', label: 'Follow Up Status Date', isComplete: !!fields.followUpDate }
    ];

    const missing = validationRules.filter(r => !r.isComplete);
    const completed = validationRules.filter(r => r.isComplete);
    
    return { 
      isValid: missing.length === 0, 
      missing, 
      completed 
    };
  };

  const handleNextDeal = () => {
    const validation = validateFields();
    if (!validation.isValid) {
      setShowValidationModal(true);
      return;
    }
    
    if (filteredDeals.length > 0 && currentIndex < filteredDeals.length - 1) {
      setCurrentIndex(prev => prev + 1);
      triggerIQAnimation();
    } else if (filteredDeals.length > 0) {
      setCurrentIndex(0);
      triggerIQAnimation();
    }
  };

  const handleSkipAnyway = () => {
    setShowValidationModal(false);
    if (filteredDeals.length > 0 && currentIndex < filteredDeals.length - 1) {
      setCurrentIndex(prev => prev + 1);
      triggerIQAnimation();
    } else if (filteredDeals.length > 0) {
      setCurrentIndex(0);
      triggerIQAnimation();
    }
  };
  
  const handlePrevDeal = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      triggerIQAnimation();
    } else if (filteredDeals.length > 0) {
      setCurrentIndex(filteredDeals.length - 1);
      triggerIQAnimation();
    }
  };
  
  const handleLogConnection = () => {
    setConnectionsMade(prev => prev + 1);
  };

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    }
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Deal> }) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });

  const handleStatusChange = (id: number, newStatus: string, newPercent: string) => {
    updateDealMutation.mutate({
      id,
      updates: { status: newStatus, statusPercent: newPercent }
    });
  };

  const sortedDeals = useMemo(() => {
    return [...deals].map(deal => ({
      ...deal,
      isHot: deal.type === 'hot'
    })).sort((a, b) => {
      const scoreA = getPropensityScore(a.propensity);
      const scoreB = getPropensityScore(b.propensity);
      return scoreB - scoreA;
    });
  }, [deals]);

  const filteredDeals = useMemo(() => {
    if (!activeFilter) return [];
    
    if (activeFilter === 'connections') {
      return sortedDeals.filter(deal => deal.source === 'MLS' && deal.mlsStatus === 'Active');
    }

    if (activeFilter === 'priority') {
      return sortedDeals.filter(deal => deal.type === 'hot');
    }

    if (activeFilter === 'topOfMind') {
      return sortedDeals.filter(deal => deal.type === 'warm' || deal.type === 'cold');
    }

    return [];
  }, [sortedDeals, activeFilter]);
  
  const currentDeal = filteredDeals[currentIndex] || filteredDeals[0];

  const propensityScore = useMemo(() => {
    if (!currentDeal?.propensity) return 0;
    return getPropensityScore(currentDeal.propensity);
  }, [currentDeal]);

  const maxPropensityScore = 8;

  const getPropensityScoreColor = (score: number) => {
    if (score >= 6) return 'text-red-600';
    if (score >= 3) return 'text-green-600';
    return 'text-blue-600';
  };

  const getActiveIndicators = (): { indicator: string; color: string; points: number }[] => {
    if (!currentDeal?.propensity || !Array.isArray(currentDeal.propensity)) return [];
    const result: { indicator: string; color: string; points: number }[] = [];
    currentDeal.propensity.forEach((indicator: string) => {
      const match = PROPENSITY_LEGEND.find(p => p.indicator === indicator);
      if (match) {
        result.push({ indicator, color: match.color, points: match.points });
      }
    });
    return result;
  };

  const streamingLines: StreamingLine[] = useMemo(() => {
    return [
      { type: 'header', value: 'The "Why"' },
      { type: 'bullet', value: 'Headline: This is a High-Motivation seller scenario (Death & Debt) paired with an Investor-Friendly Agent.', color: 'text-red-600' },
      { type: 'header', value: 'The Narrative' },
      { type: 'bullet', value: 'The owner is under extreme pressure to sell due to bankruptcy, high debt, and an affidavit of death (The "4 D\'s").' },
      { type: 'bullet', value: 'The property is an aging listing on a massive 36,600 sq ft lot, priced at ~82% of future value, leaving significant room for a discount.' },
      { type: 'bullet', value: 'The agent, Aaron Mills, is "Tier 2" and actively sells to investors, meaning he will understand a clean, fast close.' },
    ];
  }, [currentDeal, iqRevealKey]);

  const { displayedLines, currentLineIndex, isComplete: isTypingComplete, showCursor } = useTypingEffect(streamingLines, iqRevealKey);

  const [showCompletionState, setShowCompletionState] = useState(false);

  useEffect(() => {
    if (isTypingComplete) {
      const timer = setTimeout(() => {
        setShowCompletionState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowCompletionState(false);
    }
  }, [isTypingComplete]);

  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDealIds(filteredDeals.map(d => d.id));
      setIsBulkActionsOpen(true);
    } else {
      setSelectedDealIds([]);
      setIsBulkActionsOpen(false);
    }
  };

  const handleSelectDeal = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedDealIds(prev => [...prev, id]);
    } else {
      setSelectedDealIds(prev => prev.filter(dealId => dealId !== id));
    }
  };

  const handleViewModeChange = async (mode: 'stats' | 'description', dealId?: number) => {
    setIQViewMode(mode);
    if (mode === 'description' && dealId) {
      setIsLoadingStory(true);
      setPropertyStory('');
      try {
        const response = await fetch('/api/ai/property-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId })
        });
        if (!response.ok) throw new Error('Failed to generate story');
        const data = await response.json();
        setPropertyStory(data.story);
      } catch (error) {
        console.error('Error generating story:', error);
        setPropertyStory('Unable to generate property story at the moment. Please try again.');
      } finally {
        setIsLoadingStory(false);
      }
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-gray-50">
        
        <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Daily Outreach</h2>
            <p className="text-xs text-gray-500">Step-by-step execution mode.</p>
          </div>
          <div className="relative group">
            <button className="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-200">
              <span className="group-hover:text-[#FF6600] transition-colors">Add Property</span>
              <span className="text-[#FF6600] text-lg font-bold leading-none">+</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
              Enter an address and price. I'll automatically gather property details and run comparables for you.
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
            
          <OutreachActionPlan 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter}
            currentIndex={currentIndex}
            isStartMode={isStartMode}
            hasStarted={hasStarted}
            onStart={handleStart}
            connectionsMade={connectionsMade}
            dailyGoal={dailyGoal}
          />

          {hasStarted ? (
            <>
            {activeFilter === 'priority' ? (
              <>
                {currentAgent && (
                  <PriorityAgentPanel
                    agent={{
                      id: String(currentAgent.id),
                      name: currentAgent.agentName,
                      phone: currentAgent.phone,
                      email: currentAgent.email,
                      company: currentAgent.officeName,
                      assignedUser: currentAgent.assignedUser,
                      lastCommunicationDate: currentAgent.followUpDate || '11/27/2025',
                      lastAddressDiscussed: "2842 Rosarita St, San Bernardino",
                      lastCommunicatedAA: currentAgent.assignedUser,
                      activeInLast2Years: currentAgent.activeInLastTwoYears,
                      averageDealsPerYear: currentAgent.sold || 6,
                      doubleEnded: 0,
                      investorSource: currentAgent.investorSourceCount ?? 0,
                      relationshipStatus: currentAgent.relationshipStatus,
                      agentRating: 'Unknown',
                      basket: currentAgent.basket,
                      followUpStatus: currentAgent.followUpStatus,
                      followUpDate: currentAgent.followUpDate
                    }}
                    currentIndex={currentAgentIndex}
                    totalAgents={priorityAgents.length}
                    onPrevious={handlePrevAgent}
                    onNext={handleNextAgent}
                    onCallNow={handleCallNow}
                    onSendText={() => handleTextEmailClick('text')}
                    onSendEmail={() => handleTextEmailClick('email')}
                    onAgentIQReport={handleGenerateAgentIQReport}
                  />
                )}
              </>
            ) : activeFilter === 'newRelationships' ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">New Agent Relationships</h2>
                    <p className="text-sm text-gray-500">Agents whose relationship status changed to Warm or Hot today</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">1<span className="text-gray-300">/5</span></div>
                    <div className="text-xs text-gray-400">Relationships Built Today</div>
                  </div>
                </div>

                {/* Agent Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-1 flex items-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </div>
                    <div className="col-span-3">Agent Info</div>
                    <div className="col-span-3">Relationship</div>
                    <div className="col-span-2">Follow-Up</div>
                    <div className="col-span-3">Activity & Status</div>
                  </div>

                  {/* Table Rows */}
                  {[
                    {
                      id: 1,
                      name: '1213 Property Corp',
                      office: 'Flipiq',
                      phone: '7145817805',
                      email: 'tony@flipiq.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Priority',
                      basket: 'Clients',
                      requiredAction: 0,
                      followUpStatus: 'Priority',
                      followUpDate: '11/27/2025',
                      investorSourceCount: 2,
                      match: true,
                      activeInTwoYears: false,
                      pending: 0, backup: 0, sold: 0
                    },
                    {
                      id: 2,
                      name: 'Brian Tran',
                      office: 'HPT Realty',
                      phone: '714-501-1770',
                      email: 'briantran3154@gmail.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Unknown',
                      basket: 'High Value',
                      requiredAction: 0,
                      followUpStatus: 'Unknown',
                      followUpDate: '11/23/2025',
                      investorSourceCount: 2,
                      match: false,
                      activeInTwoYears: true,
                      pending: 1, backup: 0, sold: 0
                    },
                    {
                      id: 3,
                      name: 'Brian Meuse',
                      office: 'Desert Sky Real Estate Inc',
                      phone: '760-329-7892',
                      email: 'desertproperty4u@msn.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Hot',
                      basket: 'Low Value',
                      requiredAction: 0,
                      followUpStatus: 'Hot',
                      followUpDate: 'N/A',
                      investorSourceCount: 3,
                      match: false,
                      activeInTwoYears: true,
                      pending: 7, backup: 3, sold: 3
                    },
                    {
                      id: 4,
                      name: 'Jihe Xu',
                      office: 'Carefree Realty & Management',
                      phone: '858-699-1693',
                      email: 'xujihe@gmail.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Unknown',
                      basket: 'Low Value',
                      requiredAction: 0,
                      followUpStatus: 'Unknown',
                      followUpDate: 'N/A',
                      investorSourceCount: 'N/A',
                      match: false,
                      activeInTwoYears: false,
                      pending: 0, backup: 0, sold: 0
                    },
                    {
                      id: 5,
                      name: 'Salvador Armijo',
                      office: 'CARNAVAL REALTY',
                      phone: '626-290-0373',
                      email: 'salvadorarmijo007@gmail.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Warm',
                      basket: 'High Value',
                      requiredAction: 0,
                      followUpStatus: 'Warm',
                      followUpDate: 'N/A',
                      investorSourceCount: 'N/A',
                      match: false,
                      activeInTwoYears: true,
                      pending: 4, backup: 0, sold: 1
                    },
                    {
                      id: 6,
                      name: 'Sharon Jenkins',
                      office: 'Sharon Jenkins Real Estate',
                      phone: '760-519-9551',
                      email: 'sharonjenkins4realestate@gmail.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Unknown',
                      basket: 'Prospect',
                      requiredAction: 0,
                      followUpStatus: 'Unknown',
                      followUpDate: 'N/A',
                      investorSourceCount: 'N/A',
                      match: false,
                      activeInTwoYears: true,
                      pending: 9, backup: 1, sold: 8
                    },
                    {
                      id: 7,
                      name: 'Team Michael',
                      office: 'Keller Williams Realty',
                      phone: '(760) 770-1555',
                      email: 'teammichaeloffice@gmail.com',
                      assignedUser: 'Josh Santos',
                      relationshipStatus: 'Unknown',
                      basket: 'Prospect',
                      requiredAction: 0,
                      followUpStatus: 'Unknown',
                      followUpDate: 'N/A',
                      investorSourceCount: 3,
                      match: false,
                      activeInTwoYears: true,
                      pending: 15, backup: 6, sold: 8
                    }
                  ].map((agent, idx) => (
                    <div key={agent.id} className="grid grid-cols-12 border-b border-gray-100 px-4 py-4 hover:bg-gray-50 items-start">
                      {/* Checkbox + Menu */}
                      <div className="col-span-1 flex items-start gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 mt-1" />
                        <button className="text-gray-400 hover:text-gray-600">
                          <MessagesSquare className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Agent Info */}
                      <div className="col-span-3">
                        <div className="font-semibold text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500">Office Name: {agent.office}</div>
                        <div className="text-xs text-gray-500">Best Cell phone: <span className="text-blue-600">{agent.phone}</span></div>
                        <div className="text-xs text-gray-500">Best Email: <span className="text-blue-600">{agent.email}</span></div>
                      </div>

                      {/* Relationship */}
                      <div className="col-span-3">
                        <div className="text-xs text-gray-500">Assigned User: {agent.assignedUser}</div>
                        <div className="text-xs">
                          <span className="text-gray-500">Relationship Status: </span>
                          <span className={cn(
                            "font-semibold",
                            agent.relationshipStatus === 'Hot' ? "text-orange-600" :
                            agent.relationshipStatus === 'Warm' ? "text-amber-600" :
                            agent.relationshipStatus === 'Priority' ? "text-blue-600" :
                            "text-gray-600"
                          )}>{agent.relationshipStatus}</span>
                        </div>
                        <div className="text-xs text-gray-500">Basket: {agent.basket}</div>
                      </div>

                      {/* Follow-Up */}
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">Required Action: {agent.requiredAction}</div>
                        <div className="text-xs">
                          <span className="text-gray-500">Follow-Up Status: </span>
                          <span className={cn(
                            "font-semibold",
                            agent.followUpStatus === 'Hot' ? "text-orange-600" :
                            agent.followUpStatus === 'Warm' ? "text-amber-600" :
                            agent.followUpStatus === 'Priority' ? "text-blue-600" :
                            "text-gray-600"
                          )}>{agent.followUpStatus}</span>
                        </div>
                        <div className="text-xs text-gray-500">Follow-Up Date: {agent.followUpDate}</div>
                      </div>

                      {/* Activity & Status */}
                      <div className="col-span-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Investor Source Count: </span>
                          <span className="font-semibold text-gray-900">{agent.investorSourceCount}{agent.match ? ' Match' : ''}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Active in Last 2 Years: <span className={agent.activeInTwoYears ? "text-green-600" : "text-red-500"}>{agent.activeInTwoYears ? 'TRUE' : 'FALSE'}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Pending, Backup, Sold: ({agent.pending}) {agent.pending}P, {agent.backup}B, {agent.sold}S
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Showing 1 to 7 of 7 agents</div>
                  <div className="flex items-center gap-2">
                    <select className="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option>25 / page</option>
                      <option>50 / page</option>
                      <option>100 / page</option>
                    </select>
                    <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                    <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            ) : activeFilter === 'topOfMind' ? (
              <div className="space-y-8">
                {/* 1. HEADER / GOAL */}
                <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Campaign Configuration</h2>
                    <p className="text-xs text-gray-500 mt-1">You have a total of <span className="font-semibold text-gray-700">136</span> agent relationships</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaigns Sent</span>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-3xl font-black text-blue-600">0</span>
                      <span className="text-xl font-bold text-gray-300">/ 3</span>
                    </div>
                  </div>
                </div>

                {/* 2. AUDIENCE SELECTION */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">1. Select Audience</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {campaignSegments.map((seg) => (
                      <div 
                        key={seg.id}
                        onClick={() => toggleCampaignSegment(seg.id)}
                        className={cn(
                          "relative bg-white rounded-lg border-2 p-5 cursor-pointer transition-all hover:shadow-sm group",
                          seg.selected 
                            ? "border-gray-800 ring-1 ring-gray-200" 
                            : "border-gray-100 opacity-70 hover:opacity-100"
                        )}
                      >
                        {/* Top Border Color Strip */}
                        <div className={cn(
                          "absolute top-0 left-0 right-0 h-1 rounded-t-lg", 
                          seg.color === 'red' ? "bg-red-500" : seg.color === 'yellow' ? "bg-amber-400" : "bg-blue-500"
                        )}></div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={cn(
                              "text-sm font-black uppercase tracking-tight", 
                              seg.color === 'red' ? "text-red-600" : seg.color === 'yellow' ? "text-amber-600" : "text-blue-600"
                            )}>{seg.label} Agents</span>
                            <div className="text-xs text-gray-400 font-medium">Total Database: <span className="text-gray-900">{seg.total}</span></div>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center", 
                            seg.selected ? "bg-black border-black text-white" : "border-gray-200"
                          )}>
                            {seg.selected && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* Pending Count */}
                        <div className="mb-4">
                          <span className="text-3xl font-black text-gray-900">{seg.pending}</span>
                          <span className="text-xs text-gray-400 ml-1 font-medium uppercase">Pending Today</span>
                        </div>

                        {/* Historical Data */}
                        <div className="space-y-2 border-t border-gray-50 pt-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Last Comm:</span>
                            <span className="font-medium text-gray-700">{seg.lastDate} <span className="text-gray-400">({getDaysAgo(seg.lastDate)})</span></span>
                          </div>
                          
                          {/* Template with Hover Tooltip */}
                          <div className="flex justify-between items-center text-xs group/tooltip relative">
                            <span className="text-gray-400">Last Template:</span>
                            <div className="flex items-center gap-1 cursor-help">
                              <FileText className="w-3 h-3 text-gray-400" />
                              <span className="font-medium text-gray-900 underline decoration-dotted decoration-gray-300 underline-offset-2">{seg.lastTemplate}</span>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white p-3 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition pointer-events-none z-50 text-left">
                              <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Content Sent:</div>
                              <p className="italic text-gray-300 leading-snug">"{seg.templateContent}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. MESSAGE BUILDER */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">2. Configure Message (Sends to {campaignTotal} Agents)</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-3 gap-8">
                      
                      {/* SMS */}
                      <div className={cn("transition-opacity", !campaignChannels.sms && "opacity-50")}>
                        <div onClick={() => toggleCampaignChannel('sms')} className="flex items-center gap-2 cursor-pointer mb-3">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center", 
                            campaignChannels.sms ? "bg-[#FF6600] border-[#FF6600] text-white" : "border-gray-300"
                          )}>
                            {campaignChannels.sms && <Check className="w-3 h-3" />}
                          </div>
                          <MessageSquare className="w-4 h-4 text-gray-700"/>
                          <span className="font-bold text-sm text-gray-900">SMS Text</span>
                        </div>
                        <select 
                          disabled={!campaignChannels.sms} 
                          className="w-full text-xs p-2.5 border border-gray-200 rounded bg-gray-50 text-gray-700 focus:border-orange-500 outline-none transition"
                        >
                          <option>Market Update Q4</option>
                          <option>Just Sold in Area</option>
                        </select>
                      </div>

                      {/* EMAIL */}
                      <div className={cn("transition-opacity", !campaignChannels.email && "opacity-50")}>
                        <div onClick={() => toggleCampaignChannel('email')} className="flex items-center gap-2 cursor-pointer mb-3">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center", 
                            campaignChannels.email ? "bg-[#FF6600] border-[#FF6600] text-white" : "border-gray-300"
                          )}>
                            {campaignChannels.email && <Check className="w-3 h-3" />}
                          </div>
                          <Mail className="w-4 h-4 text-gray-700"/>
                          <span className="font-bold text-sm text-gray-900">Email</span>
                        </div>
                        <select 
                          disabled={!campaignChannels.email} 
                          className="w-full text-xs p-2.5 border border-gray-200 rounded bg-gray-50 text-gray-700"
                        >
                          <option>Newsletter Template</option>
                          <option>New Listings Alert</option>
                          <option>Market Update</option>
                        </select>
                      </div>

                      {/* VM */}
                      <div className={cn("transition-opacity", !campaignChannels.vm && "opacity-50")}>
                        <div onClick={() => toggleCampaignChannel('vm')} className="flex items-center gap-2 cursor-pointer mb-3">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center", 
                            campaignChannels.vm ? "bg-[#FF6600] border-[#FF6600] text-white" : "border-gray-300"
                          )}>
                            {campaignChannels.vm && <Check className="w-3 h-3" />}
                          </div>
                          <Mic className="w-4 h-4 text-gray-700"/>
                          <span className="font-bold text-sm text-gray-900">Voicemail</span>
                        </div>
                        <select 
                          disabled={!campaignChannels.vm} 
                          className="w-full text-xs p-2.5 border border-gray-200 rounded bg-gray-50 text-gray-700"
                        >
                          <option>General Check-in.mp3</option>
                          <option>Quick Hello.mp3</option>
                          <option>Market Update.mp3</option>
                          <option value="record">🎙️ Record New...</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 4. FOOTER ACTION */}
                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center -mx-6 mt-8">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>You are sending to <strong className="text-gray-900">{campaignTotal} Agents</strong>. Next step: Review Queue.</span>
                  </div>
                  
                  <button 
                    onClick={openIQWithCelebration}
                    className="flex items-center gap-2 bg-[#FF6600] hover:bg-orange-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-sm transition transform active:scale-95"
                    data-testid="button-send-campaign"
                  >
                    Send Campaign <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-start px-4 py-3 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500">{connectionsMade}/{dailyGoal} new agent calls</span>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handlePrevDeal}
                    disabled={currentIndex === 0}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition",
                      currentIndex === 0 && "opacity-50 cursor-not-allowed"
                    )} 
                    data-testid="button-prev-deal"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Deal
                  </button>
                  
                  <button 
                    onClick={handleNextDeal}
                    className="flex items-center gap-1 px-4 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white rounded-lg text-xs font-bold shadow-sm transition animate-pulse shadow-lg ring-2 ring-orange-200"
                    data-testid="button-next-deal"
                  >
                    Next Deal
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">

                <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none rounded-t-xl">
                    <div className="w-[48px] shrink-0"></div> 
                    <div className="flex-1 flex items-center">
                    
                        <div className="w-5/12 px-4 flex items-center gap-2 group relative">
                            <div className="flex items-center gap-1 cursor-help">
                                <span>Property</span>
                                <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                
                                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                                    Details include Address, Specs, Priority Tag (High/Medium/Low), Next Actions (To-Do), and Notifications.
                                </div>
                            </div>

                            {selectedDealIds.length > 0 && (
                              <DropdownMenu open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
                                <DropdownMenuTrigger asChild>
                                  <button className="bg-[#FF6600] hover:bg-[#e65c00] text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 transition-colors ml-2 normal-case" data-testid="button-bulk-actions">
                                    Bulk Actions
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 bg-white z-50 border-none shadow-xl">
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                                    <Phone className="w-4 h-4" />
                                    <span>Call</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Text</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                                    <Mic className="w-4 h-4" />
                                    <span>Text Voicemail</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                                    <Bot className="w-4 h-4" />
                                    <span>AI Connect</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                        </div>
                        
                        <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                            <span>Price / Propensity</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[800px] bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed border border-gray-700 max-h-[80vh] overflow-y-auto">
                                <div className="font-bold text-[#FF6600] mb-3 text-sm border-b border-gray-700 pb-2">Propensity To Sell Indicators</div>
                                <div className="grid grid-cols-[80px_1fr_100px_50px_1fr] gap-2 text-[10px] items-center">
                                  <div className="font-bold text-gray-400 border-b border-gray-700 pb-1">Color</div>
                                  <div className="font-bold text-gray-400 border-b border-gray-700 pb-1">Propensity Indicator</div>
                                  <div className="font-bold text-gray-400 border-b border-gray-700 pb-1">Category</div>
                                  <div className="font-bold text-gray-400 border-b border-gray-700 pb-1">Points</div>
                                  <div className="font-bold text-gray-400 border-b border-gray-700 pb-1">PropertyRadar Data Source</div>

                                  {PROPENSITY_LEGEND.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      <div className={cn("font-bold", item.color)}>{item.label}</div>
                                      <div className="text-gray-300">{item.indicator}</div>
                                      <div className="text-gray-400">{item.category}</div>
                                      <div className="text-gray-300">{item.points}</div>
                                      <div className="text-gray-500 italic">{item.source}</div>
                                      <div className="col-span-5 h-[1px] bg-gray-800 my-1"></div>
                                    </React.Fragment>
                                  ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                            <span>Last Open / Called</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                                Tracks the last time you manually opened this file or communicated (Call/Text/Email).<br/><br/><span className="italic text-gray-400">Excludes Auto-Trackers or AI Connect.</span>
                            </div>
                        </div>
                        
                        <div className="w-3/12 px-4 flex items-center gap-1 group relative cursor-help">
                            <span>Offer Status / Source</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute top-8 right-0 w-[400px] bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed max-h-[80vh] overflow-y-auto">
                                <div className="font-bold text-[#FF6600] mb-3 text-sm border-b border-gray-700 pb-2">Offer Status Definitions & Tasks</div>
                                <div className="mb-3 italic text-gray-400">Includes Lead Source.</div>
                                
                                <div className="mb-4 bg-gray-800/50 p-2 rounded border border-gray-700">
                                  <div className="font-bold text-[#FF6600] mb-1.5 text-xs">Source Definitions</div>
                                  <div className="space-y-1.5">
                                    <div><span className="font-bold text-gray-300">MLS:</span> <span className="text-gray-400">Deals listed on the Multiple Listing Service.</span></div>
                                    <div><span className="font-bold text-gray-300">Off Market:</span> <span className="text-gray-400">Deals manually added by an Acquisition Associate (AA).</span></div>
                                    <div><span className="font-bold text-gray-300">Wholesaler:</span> <span className="text-gray-400">Deals emailed directly to Deals@youremail.com.</span></div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                    {/* New Lead (0-10%) */}
                                    <div className="font-bold text-gray-300 text-xs">New Lead (0–10%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">0% - None</span><br/><span className="text-gray-400">File needs attention. Update the status and set priority (High, Medium, Low).</span></div>
                                        <div><span className="font-bold text-[#FF6600]">10% - Initial Contact Started</span><br/><span className="text-gray-400">Property is assigned to AA and under review. <span className="text-[#FF0000] font-bold">MUST CALL Agent.</span> Do not rely on text or emails. Turn on auto tracker if agent is not calling back.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* Working / Nurture (20-30%) */}
                                    <div className="font-bold text-gray-300 text-xs">Working / Nurture (20–30%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">20% - Continue to Follow</span><br/><span className="text-gray-400">Not ready to accept our price, but may sell later. Use reminders to keep property out of Daily Tasks until the set reminder date.</span></div>
                                        <div><span className="font-bold text-[#FF6600]">30% - Back Up</span><br/><span className="text-gray-400">Pending with other buyer; we are backup. Use reminders to keep property out of Daily Tasks until the set reminder date.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* Offer Sent (30-50%) */}
                                    <div className="font-bold text-gray-300 text-xs">Offer Sent (30–50%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">30% - Offer Terms Sent</span><br/><span className="text-gray-400">Terms sent but receipt not confirmed. Use Reminders and Auto Trackers if agent is not responding.</span></div>
                                        <div><span className="font-bold text-[#FF6600]">50% - Contract Submitted</span><br/><span className="text-gray-400">Self-represented RPA sent to listing agent. <span className="text-[#FF0000] font-bold">CALL to confirm receipt.</span> Ask when and how they are presenting offers.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* In Negotiation (60%) */}
                                    <div className="font-bold text-gray-300 text-xs">In Negotiation (60%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">60% - In Negotiations</span><br/><span className="text-gray-400">We are negotiating and agent is engaging/guiding us. Can be High/Medium/Low Priority. <span className="text-[#FF0000] font-bold">MUST CALL minimum once per day.</span> Do not rely on text and emails.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* Under Contract (80%) */}
                                    <div className="font-bold text-gray-300 text-xs">Under Contract (80%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">80% - Offer Accepted</span><br/><span className="text-gray-400">In Escrow. Make sure terms are correct in the contract.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* Acquired (100%) */}
                                    <div className="font-bold text-gray-300 text-xs">Acquired (100%)</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">100% - Acquired</span><br/><span className="text-gray-400">Closed Escrow. Make sure to update Agent 365 Report.</span></div>
                                    </div>
                                    <div className="flex justify-center py-1"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>

                                    {/* Lost / Do Not Pursue (0%) */}
                                    <div className="font-bold text-gray-300 text-xs">Lost / Do Not Pursue (0%) – terminal states</div>
                                    <div className="ml-3 space-y-2">
                                        <div><span className="font-bold text-[#FF6600]">0% - Pass</span><br/><span className="text-gray-400">Does not qualify or offer not considered. Make sure to set a Pass Reason.</span></div>
                                        <div><span className="font-bold text-[#FF6600]">0% - Sold Others/Closed</span><br/><span className="text-gray-400">Sold to other buyer. Set reminder for 3 weeks out to see who purchased it and for how much.</span></div>
                                        <div><span className="font-bold text-[#FF6600]">0% - Cancelled FEC</span><br/><span className="text-gray-400">Fully executed contract (FEC) was canceled. Update Agent 365 Report.</span></div>
                                        <div><span className="font-bold text-[#FF6600]">0% - DO NOT USE</span><br/><span className="text-gray-400">Reserve status. Do not use.</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Loading deals...
                  </div>
                ) : !currentDeal ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No deals found matching the selected filter.
                  </div>
                ) : (
                    <>
                    <div className={cn("flex border-b border-gray-100 hover:bg-gray-50 transition group py-4", selectedDealIds.includes(currentDeal.id) && "bg-blue-50/50 hover:bg-blue-50")} data-testid={`row-deal-${currentDeal.id}`}>
                        <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={selectedDealIds.includes(currentDeal.id)}
                              onChange={(e) => handleSelectDeal(currentDeal.id, e.target.checked)}
                              data-testid={`checkbox-deal-${currentDeal.id}`}
                            />
                            <div className="bg-gray-100 rounded-lg p-1 flex flex-col items-center gap-2 w-8">
                                <Target className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                                <div className="w-4 h-[1px] bg-gray-300"></div>
                                <MessagesSquare className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row">
                            
                            <div className="w-5/12 px-4 flex flex-col justify-start gap-2">
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="relative group/priority">
                                        <div className={cn(
                                          "rounded-full px-2 py-0.5 border flex items-center gap-1 shadow-sm cursor-help",
                                          currentDeal.type === 'hot' ? "bg-red-500 border-red-500" :
                                          currentDeal.type === 'warm' ? "bg-amber-500 border-amber-500" :
                                          currentDeal.type === 'cold' ? "bg-blue-500 border-blue-500" :
                                          "bg-gray-400 border-gray-400"
                                        )}>
                                            {currentDeal.type === 'hot' && <Flame className="w-3 h-3 text-white" />}
                                            <span className="text-[10px] font-bold text-white uppercase">
                                              {currentDeal.type === 'hot' ? 'High' : currentDeal.type === 'warm' ? 'Med' : currentDeal.type === 'cold' ? 'Low' : 'New'}
                                            </span>
                                            <ChevronDown className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover/priority:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                                          <div className="font-bold text-white mb-2">Property Priority</div>
                                          
                                          <div className={cn("p-2 rounded mb-2", currentDeal.type === 'hot' ? "bg-red-900/50 border border-red-500" : "")}>
                                            <div className="font-bold text-red-400 mb-1">🔥 High Priority (Work First)</div>
                                            <div className="text-gray-300 text-[10px]">High probability to close. Agent is responsive or in active negotiations. Focus here first.</div>
                                          </div>
                                          
                                          <div className={cn("p-2 rounded mb-2", currentDeal.type === 'warm' ? "bg-amber-900/50 border border-amber-500" : "")}>
                                            <div className="font-bold text-amber-400 mb-1">🌡️ Medium Priority (Work Second)</div>
                                            <div className="text-gray-300 text-[10px]">Viable potential. Agent is engaged but deal requires nurturing. Focus after High Priority.</div>
                                          </div>
                                          
                                          <div className={cn("p-2 rounded mb-2", currentDeal.type === 'cold' ? "bg-blue-900/50 border border-blue-500" : "")}>
                                            <div className="font-bold text-blue-400 mb-1">❄️ Low Priority (Work Last)</div>
                                            <div className="text-gray-300 text-[10px]">Low probability right now. Agent unresponsive or wide price gap. Focus here last.</div>
                                          </div>
                                          
                                          <div className={cn("p-2 rounded", currentDeal.type === 'new' ? "bg-gray-700/50 border border-gray-500" : "")}>
                                            <div className="font-bold text-gray-400 mb-1">🆕 New (Needs Review)</div>
                                            <div className="text-gray-300 text-[10px]">New deal that needs to be reviewed and assigned a priority level.</div>
                                          </div>
                                        </div>
                                      </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    <div className="relative">
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap">
                                            To do: Not set <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 whitespace-nowrap">• 0 Critical • 0 Reminders</div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-gray-500 text-[10px]">
                                        Photo
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-base mb-0.5 flex items-center gap-1">
                                            <Link href={`/piq/${currentDeal.id}`} className="hover:text-orange-600 hover:underline cursor-pointer transition-colors">
                                                {currentDeal.address}
                                            </Link>
                                            <Globe className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div className="text-xs text-gray-500 mb-2">{currentDeal.specs}</div>
                                        <div className="flex flex-wrap gap-1">
                                            <span className="px-2 py-0.5 bg-white text-red-600 text-[10px] rounded-full border border-red-300">repairs</span>
                                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] rounded-full border border-green-300">investors</span>
                                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] rounded-full border border-green-300">Investment</span>
                                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] rounded-full border border-green-300">as-is</span>
                                            <span className="px-2 py-0.5 bg-white text-blue-600 text-[10px] rounded-full border border-blue-300">investor</span>
                                            <span className="px-2 py-0.5 bg-white text-blue-600 text-[10px] rounded-full border border-blue-300">estate</span>
                                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] rounded-full border border-green-300">opportunity</span>
                                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] rounded-full border border-green-300">Renovation</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-2/12 px-4 flex flex-col items-center text-center">
                                <div className="font-bold text-gray-900 text-base mb-1">{currentDeal.price}</div>
                                {Array.isArray(currentDeal.propensity) ? (
                                  <>
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <span className="text-[10px] text-gray-400">Propensity Score:</span>
                                      <span className={cn(
                                        "text-[11px] font-medium",
                                        getPropensityScore(currentDeal.propensity) >= 6 ? "text-red-600" : 
                                        getPropensityScore(currentDeal.propensity) >= 3 ? "text-green-600" : "text-blue-600"
                                      )}>
                                        {getPropensityScore(currentDeal.propensity)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 mb-1">
                                      {currentDeal.propensity.map((item: string, idx: number) => (
                                        <div key={idx} className="group/item relative cursor-help leading-none hover:z-50">
                                          <span className={cn("text-[10px] font-normal inline-block", getPropensityColor(item))}>
                                            {item}
                                          </span>
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover/item:opacity-100 pointer-events-none z-50 text-center hidden group-hover/item:block">
                                            {item}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-gray-400 mb-1">Propensity Score: {currentDeal.propensity === 'N/A' ? '0' : currentDeal.propensity}</div>
                                )}
                            </div>

                            <div className="w-2/12 px-4 flex flex-col items-center">
                                <div className="text-[11px] text-gray-400 space-y-1 text-left w-full max-w-[140px]">
                                    <div className="flex flex-col group relative cursor-help">
                                        <span className="font-medium text-gray-500">Last Open Date:</span>
                                        <span className={cn(
                                          "text-gray-900 font-medium", 
                                          currentDeal.lastOpen === 'N/A' && "bg-yellow-100 px-1.5 py-0.5 rounded font-bold w-fit"
                                        )}>
                                          {currentDeal.lastOpen}
                                        </span>
                                        {currentDeal.lastOpen === 'N/A' && (
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Needs attention: This deal hasn't been opened recently.
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col group relative cursor-help">
                                        <span className="font-medium text-gray-500">Last Called Date:</span>
                                        <span className={cn(
                                          "text-gray-900 font-medium", 
                                          currentDeal.lastCalled === 'N/A' && "bg-yellow-100 px-1.5 py-0.5 rounded font-bold w-fit"
                                        )}>
                                          {currentDeal.lastCalled}
                                        </span>
                                        {currentDeal.lastCalled === 'N/A' && (
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Needs attention: No recent call recorded.
                                          </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-3/12 px-4 flex flex-col items-center justify-center gap-2">
                                <div className="text-xs text-gray-500 font-medium">Source: <span className="font-bold text-gray-900">{currentDeal.source}</span>{currentDeal.mlsStatus && <span className={cn("font-bold ml-1", currentDeal.mlsStatus === 'Active' && "text-green-600", currentDeal.mlsStatus === 'Pending' && "text-amber-500", currentDeal.mlsStatus === 'Back Up Offer' && "text-blue-600", (currentDeal.mlsStatus === 'Closed' || currentDeal.mlsStatus === 'Sold') && "text-red-600")}> - {currentDeal.mlsStatus}</span>}</div>
                                <StatusPipelineWidget
                                  currentPercent={parseInt(currentDeal.statusPercent) || 0}
                                  currentLabel={currentDeal.status}
                                  onStatusChange={(percent, label) => handleStatusChange(currentDeal.id, label, `${percent}%`)}
                                />
                            </div>

                        </div>
                    </div>

                    {/* IQ Property Intelligence Section */}
                    <div className="bg-gradient-to-br from-white to-orange-50/30 border border-gray-200 rounded-xl mt-4 shadow-sm">
                        {/* iQ Intelligence Content */}
                        <div className="p-6">
                          {/* Header with pulsing animation */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 bg-gradient-to-br from-[#FF6600] to-[#FF8533] rounded-xl flex items-center justify-center shadow-sm">
                                <Lightbulb className="w-5 h-5 text-white" />
                                {!showCompletionState && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6600] rounded-full animate-ping"></div>
                                )}
                              </div>
                              <div>
                                <h2 className="text-lg font-bold text-gray-900">iQ Property Intelligence</h2>
                                {!showCompletionState ? (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>analyzing</span>
                                    <span className="inline-flex gap-0.5">
                                      <span className="w-1 h-1 bg-[#FF6600] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                      <span className="w-1 h-1 bg-[#FF6600] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                      <span className="w-1 h-1 bg-[#FF6600] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-xs text-green-600 animate-in fade-in duration-300">
                                    <Check className="w-3 h-3" />
                                    <span>Analysis complete</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Streaming Content */}
                          <div key={iqRevealKey} className="space-y-2 text-sm">
                            {streamingLines.map((line, index) => {
                              const displayedText = displayedLines.get(index) || '';
                              const isCurrentLine = index === currentLineIndex;
                              const hasStarted = index <= currentLineIndex;

                              if (!hasStarted) return null;

                              if (line.type === 'stat') {
                                const fullText = `${line.label}: ${line.value}`;
                                const colonIndex = fullText.indexOf(':');
                                const displayedLabel = displayedText.slice(0, Math.min(displayedText.length, colonIndex + 1));
                                const displayedValue = displayedText.length > colonIndex + 1 ? displayedText.slice(colonIndex + 1) : '';
                                const valueColorClass = line.color || 'text-gray-900';
                                
                                return (
                                  <div key={index} className="flex items-center">
                                    <span className="text-gray-500">{displayedLabel}</span>
                                    {line.isLink && displayedValue.includes('[View Agent]') ? (
                                      <a 
                                        href={line.linkUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 underline hover:text-blue-800 font-semibold"
                                      >
                                        {displayedValue}
                                      </a>
                                    ) : (
                                      <span className={cn(valueColorClass, "font-semibold")}>{displayedValue}</span>
                                    )}
                                    {isCurrentLine && showCursor && (
                                      <span className="inline-block w-0.5 h-4 bg-[#FF6600] ml-0.5 animate-pulse"></span>
                                    )}
                                  </div>
                                );
                              }

                              if (line.type === 'header') {
                                return (
                                  <div key={index} className="pt-6 pb-2">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                      <Sparkles className="w-5 h-5 text-[#FF6600]" />
                                      {displayedText}
                                      {isCurrentLine && showCursor && (
                                        <span className="inline-block w-0.5 h-5 bg-[#FF6600] animate-pulse"></span>
                                      )}
                                    </h3>
                                  </div>
                                );
                              }

                              if (line.type === 'bullet') {
                                const bulletColor = line.color || 'text-gray-700';
                                const dotColor = line.color ? line.color.replace('text-', 'text-') : 'text-[#FF6600]';
                                return (
                                  <div key={index} className="flex items-start gap-2 pl-2">
                                    <span className={cn(dotColor, "mt-0.5")}>•</span>
                                    <span className={bulletColor}>
                                      {displayedText}
                                      {isCurrentLine && showCursor && (
                                        <span className="inline-block w-0.5 h-4 bg-[#FF6600] ml-0.5 animate-pulse"></span>
                                      )}
                                    </span>
                                  </div>
                                );
                              }

                              
                              return null;
                            })}
                          </div>

                          <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3 border border-gray-200">
                              <Plus className="w-5 h-5 text-gray-400" />
                              <input 
                                type="text" 
                                placeholder="Ask anything" 
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                                data-testid="input-ask-anything"
                              />
                              <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                                <MessageSquare className="w-4 h-4" style={{color: 'white'}} />
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>

                    </>
                )}


            </div>
            </>
            )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-12 rounded-xl border border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Phone className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
              <p className="text-gray-500 max-w-md mb-8">You have {totalDeals} new calls queued up for today. Click the red "Start Calling" button above to begin your outreach session.</p>
            </div>
          )}

        </main>
      </div>

      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF6600]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Complete Required Fields</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Please update the following fields before moving to the next property:
              </p>

              <div className="space-y-2 mb-6">
                {validateFields().missing.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700">{field.label}</span>
                  </div>
                ))}
                {validateFields().completed.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-500">{field.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-bold rounded-lg transition"
                  data-testid="button-go-back-complete"
                >
                  Go Back & Complete
                </button>
                <button
                  onClick={handleSkipAnyway}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                  data-testid="button-skip-anyway"
                >
                  Skip Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Validation Modal */}
      {showAgentValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF6600]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Complete Required Fields</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Please update the following fields before moving to the next agent:
              </p>

              <div className="space-y-2 mb-6">
                {validateAgentFields().missing.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700">{field.label}</span>
                  </div>
                ))}
                {validateAgentFields().completed.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-500">{field.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-amber-800">
                  <strong>Tip:</strong> If contact was made via dial pad, always update the Relationship Status from "Unknown" and add notes about the conversation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAgentValidationModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-bold rounded-lg transition"
                  data-testid="button-go-back-complete-agent"
                >
                  Go Back & Complete
                </button>
                <button
                  onClick={handleSkipAgentAnyway}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                  data-testid="button-skip-agent-anyway"
                >
                  Skip Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call First Warning Modal */}
      {showCallFirstWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCallFirstWarning(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Call Required First</h2>
              <p className="text-sm text-gray-600 mb-6">
                You must make an initial call before you can text and email this agent.
              </p>
              <button
                onClick={() => setShowCallFirstWarning(false)}
                className="w-full px-4 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-bold rounded-lg transition"
                data-testid="button-close-call-warning"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default function DailyOutreach() {
  return <DailyOutreachContent />;
}

import React, { useState, useMemo, useEffect, useCallback, useLayoutEffect } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import OutreachActionPlan, { OutreachType } from "@/components/OutreachActionPlan";
import Sidebar from "@/components/Sidebar";
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
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
  Send
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
    agentName: "1213 Property Corp -",
    officeName: "Flipiq",
    phone: "7145817805",
    email: "tony@flipiq.com",
    assignedUser: "Josh Santos",
    relationshipStatus: "Priority",
    basket: "Clients",
    requiredAction: 0,
    followUpStatus: "Attempt 5",
    followUpDate: "11/27/2025",
    investorSourceCount: 2,
    activeInLastTwoYears: false,
    pending: 0,
    backup: 0,
    sold: 0
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
      const pauseTime = currentLine.type === 'header' ? 400 : 150;
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    const randomDelay = Math.floor(Math.random() * 6) + 4;
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

export default function DailyOutreach() {
  const [, setLocation] = useLocation();
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
  const [selectedCampaignSegment, setSelectedCampaignSegment] = useState<'hot' | 'warm' | 'cold'>('hot');
  const [campaignChannels, setCampaignChannels] = useState({
    sms: true,
    email: false,
    voicemail: false
  });
  const [selectedSegmentsForCampaign, setSelectedSegmentsForCampaign] = useState({ hot: true, warm: false, cold: false });
  const [segmentChannels, setSegmentChannels] = useState({
    hot: { text: true, email: false, voicemail: false },
    warm: { text: false, email: false, voicemail: false },
    cold: { text: false, email: false, voicemail: false }
  });
  const [segmentTemplates, setSegmentTemplates] = useState({
    hot: { text: '', email: '', voicemail: '' },
    warm: { text: '', email: '', voicemail: '' },
    cold: { text: '', email: '', voicemail: '' }
  });
  const [recordingSegment, setRecordingSegment] = useState<string | null>(null);
  const [recordTime, setRecordTime] = useState(0);

  const toggleSegmentForCampaign = (id: 'hot' | 'warm' | 'cold') => {
    setSelectedSegmentsForCampaign(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSegmentChannel = (seg: 'hot' | 'warm' | 'cold', ch: 'text' | 'email' | 'voicemail') => {
    setSegmentChannels(prev => ({ ...prev, [seg]: { ...prev[seg], [ch]: !prev[seg][ch] } }));
  };

  const setSegmentTemplate = (seg: 'hot' | 'warm' | 'cold', ch: 'text' | 'email' | 'voicemail', val: string) => {
    setSegmentTemplates(prev => ({ ...prev, [seg]: { ...prev[seg], [ch]: val } }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingSegment) {
      interval = setInterval(() => setRecordTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recordingSegment]);

  const formatRecordTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const campaignSegmentData = [
    { id: 'hot' as const, label: 'Hot', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500', borderColor: 'border-orange-300' },
    { id: 'warm' as const, label: 'Warm', color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500', borderColor: 'border-yellow-300' },
    { id: 'cold' as const, label: 'Cold', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500', borderColor: 'border-blue-300' }
  ];

  const templateOptions = {
    text: ['Quick Check-In', 'Market Update', 'Just Sold', 'New Listing Alert'],
    email: ['Market Update Q4', 'New Listings Alert', 'Monthly Newsletter', 'Re-engagement'],
    voicemail: ['Friendly Hello', 'Quick Update', 'New Opportunity', 'Follow Up']
  };
  
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
    window.open(`tel:${currentAgent?.phone}`, '_self');
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
    const activeIndicators = getActiveIndicators();
    const indicatorBullets: StreamingLine[] = activeIndicators.map(ind => ({
      type: 'bullet' as const,
      value: `${ind.indicator} (+${ind.points} pts)`,
      color: ind.color
    }));

    return [
      { type: 'stat', label: 'Status', value: currentDeal?.mlsStatus || 'Active' },
      { type: 'stat', label: 'Days on Market', value: '45' },
      { type: 'stat', label: 'Price to Future Value', value: '82%' },
      { type: 'stat', label: 'Propensity Score', value: `${propensityScore} / ${maxPropensityScore}`, color: getPropensityScoreColor(propensityScore) },
      { type: 'stat', label: 'Agent', value: 'Sarah Johnson (Unassigned)' },
      { type: 'stat', label: 'Relationship Status', value: 'Warm' },
      { type: 'stat', label: 'Investor Source Count', value: '[View Agent]', isLink: true, linkUrl: 'https://nextjs-flipiq-agent.vercel.app/agents/AaronMills' },
      { type: 'stat', label: 'Last Communication Date', value: '11/15/2025' },
      { type: 'stat', label: 'Last Address Discussed', value: '1234 Oak Street, Phoenix AZ' },
      { type: 'header', value: 'Why this Property' },
      ...(indicatorBullets.length > 0 ? indicatorBullets : [
        { type: 'bullet' as const, value: 'No propensity indicators detected for this property.' }
      ]),
      { type: 'bullet', value: 'Aged listing (≥70 DOM) with strong discount potential.' },
      { type: 'bullet', value: 'Price-to-value ratio suggests room for negotiation.' },
      { type: 'action', value: 'Would you like me to run a detailed AI report?' },
      { type: 'action', value: "Let's dive into the property —", isDiveIn: true },
    ];
  }, [currentDeal, iqRevealKey, propensityScore]);

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
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Daily Outreach</h2>
            <p className="text-xs text-gray-500">Step-by-step execution mode.</p>
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
                <div className="flex items-center justify-center px-4 py-3 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-500">Priority Agent {currentAgentIndex + 1} of {priorityAgents.length}</span>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handlePrevAgent}
                        disabled={currentAgentIndex === 0}
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition",
                          currentAgentIndex === 0 && "opacity-50 cursor-not-allowed"
                        )} 
                        data-testid="button-prev-agent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Agent
                      </button>
                      
                      <button 
                        onClick={handleNextAgent}
                        disabled={currentAgentIndex >= priorityAgents.length - 1}
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white rounded-lg text-xs font-bold shadow-sm transition",
                          currentAgentIndex >= priorityAgents.length - 1 ? "opacity-50 cursor-not-allowed" : "animate-pulse shadow-lg ring-2 ring-orange-200"
                        )}
                        data-testid="button-next-agent"
                      >
                        Next Agent
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {currentAgent && (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900" data-testid={`text-agent-name-${currentAgent.id}`}>
                              {currentAgent.agentName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${currentAgent.phone}`} className="hover:text-blue-600" data-testid={`link-phone-${currentAgent.id}`}>{currentAgent.phone}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a href={`mailto:${currentAgent.email}`} className="hover:text-blue-600" data-testid={`link-email-${currentAgent.id}`}>{currentAgent.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span>{currentAgent.officeName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Assigned User</div>
                          <select className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer">
                            <option>{currentAgent.assignedUser}</option>
                          </select>
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                            </div>
                            <span className="text-sm text-gray-600">Do Not Call</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 mb-6">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Agent Status</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Relationship Status <span className="text-red-500">*</span></label>
                              <select 
                                value={getCurrentAgentFields()?.relationshipStatus || currentAgent.relationshipStatus}
                                onChange={(e) => updateAgentFormField('relationshipStatus', e.target.value)}
                                className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                                data-testid="select-relationship-status"
                              >
                                <option value="Unknown">Unknown</option>
                                <option value="Cold">Cold</option>
                                <option value="Warm">Warm</option>
                                <option value="Hot">Hot</option>
                                <option value="Priority">Priority</option>
                                <option value="Connected">Connected</option>
                                <option value="No Contact">No Contact</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Agent Rating</label>
                              <select className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
                                <option>Unknown</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Basket</label>
                              <select className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
                                <option>{currentAgent.basket}</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Agent Profile</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Active In Last 2 Years</label>
                              <select className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2">
                                <option>{currentAgent.activeInLastTwoYears ? 'True' : 'False'}</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Investor Source Count</label>
                              <div className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                                {currentAgent.investorSourceCount !== null ? `${currentAgent.investorSourceCount} Match` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Follow Up</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Follow Up Status <span className="text-red-500">*</span></label>
                              <select 
                                value={getCurrentAgentFields()?.followUpStatus || ''}
                                onChange={(e) => updateAgentFormField('followUpStatus', e.target.value)}
                                className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                                data-testid="select-follow-up-status"
                              >
                                <option value="">Select Status...</option>
                                <option value="Pending">Pending</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="No Answer">No Answer</option>
                                <option value="Left Voicemail">Left Voicemail</option>
                                <option value="Callback Requested">Callback Requested</option>
                                <option value="Not Interested">Not Interested</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Follow Up Status Date</label>
                              <div className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {currentAgent.followUpDate}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Last Communication Date</label>
                              <div className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {currentAgent.followUpDate}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Last Address Discussed</label>
                              <div className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                                7138 Lurline Ave, Winnetka, CA, 91306
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Last Communicated AA</label>
                              <div className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                                {currentAgent.assignedUser}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-900">Notes <span className="text-red-500">*</span></h5>
                          </div>
                          <textarea 
                            value={getCurrentAgentFields()?.notes || ''}
                            onChange={(e) => updateAgentFormField('notes', e.target.value)}
                            placeholder="Add notes about this call..."
                            className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                            data-testid="input-agent-notes"
                          />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-900">Note Dates</h5>
                          </div>
                          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={handleCallNow}
                    className="px-6 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-bold rounded-lg shadow-sm transition flex items-center gap-2"
                    data-testid="button-call-now"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button
                    onClick={() => window.open(`sms:${currentAgent?.phone}`, '_self')}
                    className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 shadow-sm transition flex items-center gap-2"
                    data-testid="button-send-text"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Text
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${currentAgent?.email}`, '_self')}
                    className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 shadow-sm transition flex items-center gap-2"
                    data-testid="button-send-email"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    onClick={handleGenerateAgentIQReport}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#FF8533] hover:from-[#e65c00] hover:to-[#FF6600] text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2"
                    data-testid="button-agent-iq-report"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Agent iQ Report
                  </button>
                </div>

                {/* Agent iQ Report - Inline Chat Section */}
                {showAgentIQModal && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    {/* Chat Content Area */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-[400px] overflow-y-auto">
                      {isLoadingAgentIQ ? (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <span className="text-sm text-gray-500">Generating AI analysis...</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6600] to-[#FF8533] flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100">
                            <div className="prose prose-sm max-w-none">
                              <div className="text-gray-700 leading-relaxed">
                                {agentIQReport.split('\n').map((line, idx) => {
                                  if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
                                    const level = line.match(/^#+/)?.[0].length || 1;
                                    const text = line.replace(/^#+\s*/, '');
                                    if (level === 1) return <h1 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2 first:mt-0">{text}</h1>;
                                    if (level === 2) return <h2 key={idx} className="text-base font-bold text-[#FF6600] mt-3 mb-1">{text}</h2>;
                                    return <h3 key={idx} className="text-sm font-semibold text-gray-800 mt-2 mb-1">{text}</h3>;
                                  }
                                  if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={idx} className="font-semibold text-gray-900 mt-2 text-sm">{line.replace(/\*\*/g, '')}</p>;
                                  }
                                  if (line.startsWith('- ')) {
                                    return <li key={idx} className="ml-4 text-gray-600 text-sm">{line.substring(2)}</li>;
                                  }
                                  if (line.trim() === '') {
                                    return <div key={idx} className="h-1"></div>;
                                  }
                                  return <p key={idx} className="text-gray-600 text-sm mb-1">{line}</p>;
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* ChatGPT-style Input Bar */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
                      <input 
                        type="text" 
                        placeholder="Ask anything about this agent..." 
                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                        data-testid="input-agent-iq-chat"
                      />
                      <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                      <div className="w-8 h-8 bg-[#FF6600] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e65c00] transition">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : activeFilter === 'topOfMind' ? (
              <>
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">Agent Relationship Campaign</h1>
                    <p className="text-gray-500 text-sm">Nov 27, 2025 — Today's Outreach</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {CAMPAIGN_SEGMENTS.hot.total + CAMPAIGN_SEGMENTS.warm.total + CAMPAIGN_SEGMENTS.cold.total}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">Total Agents</div>
                    </div>
                    <div className="border-l pl-6">
                      <div className="text-3xl font-black text-orange-500">
                        {campaignSegmentData.filter(s => selectedSegmentsForCampaign[s.id]).reduce((sum, s) => sum + CAMPAIGN_SEGMENTS[s.id].todaysCampaign, 0)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">Today's Campaign</div>
                    </div>
                  </div>
                </div>

                {/* SEGMENT REPORT TABLE */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Segment Report
                    </h2>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Segment</th>
                        <th className="px-4 py-3 text-center">Total Agents</th>
                        <th className="px-4 py-3 text-center">Last Communication</th>
                        <th className="px-4 py-3">Last Template</th>
                        <th className="px-4 py-3 text-center">Today's 10%</th>
                        <th className="px-4 py-3 text-center">Include</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {campaignSegmentData.map(seg => (
                        <tr key={seg.id} className={selectedSegmentsForCampaign[seg.id] ? seg.bg : 'bg-white'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${seg.dot}`}></div>
                              <span className={`font-bold ${seg.color}`}>{seg.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-semibold text-gray-900">{CAMPAIGN_SEGMENTS[seg.id].total}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{CAMPAIGN_SEGMENTS[seg.id].lastCommunication}</td>
                          <td className="px-4 py-4 text-gray-600">{CAMPAIGN_SEGMENTS[seg.id].lastTemplate}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${seg.bg} ${seg.color}`}>
                              {CAMPAIGN_SEGMENTS[seg.id].todaysCampaign}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedSegmentsForCampaign[seg.id]}
                              onChange={() => toggleSegmentForCampaign(seg.id)}
                              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t">
                      <tr className="font-bold">
                        <td className="px-6 py-3 text-gray-900">Total</td>
                        <td className="px-4 py-3 text-center text-gray-900">{CAMPAIGN_SEGMENTS.hot.total + CAMPAIGN_SEGMENTS.warm.total + CAMPAIGN_SEGMENTS.cold.total}</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-center text-orange-600">{CAMPAIGN_SEGMENTS.hot.todaysCampaign + CAMPAIGN_SEGMENTS.warm.todaysCampaign + CAMPAIGN_SEGMENTS.cold.todaysCampaign}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* CAMPAIGN CONFIGURATION PER SEGMENT */}
                {campaignSegmentData.filter(s => selectedSegmentsForCampaign[s.id]).map(seg => (
                  <div key={seg.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${seg.bg}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${seg.dot}`}></div>
                        <h3 className={`font-bold ${seg.color}`}>{seg.label} Campaign</h3>
                        <span className="text-gray-500 text-sm">— {CAMPAIGN_SEGMENTS[seg.id].todaysCampaign} agents</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last: {CAMPAIGN_SEGMENTS[seg.id].lastCommunication} • "{CAMPAIGN_SEGMENTS[seg.id].lastTemplate}"
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Select Channels & Templates for This Campaign
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        
                        {/* TEXT */}
                        <div className={cn(
                          "rounded-xl border-2 overflow-hidden",
                          segmentChannels[seg.id].text ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50"
                        )}>
                          <div onClick={() => toggleSegmentChannel(seg.id, 'text')} className="p-4 cursor-pointer flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center",
                              segmentChannels[seg.id].text ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"
                            )}>
                              {segmentChannels[seg.id].text && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <MessageSquare className={cn("w-4 h-4", segmentChannels[seg.id].text ? "text-green-600" : "text-gray-400")} />
                            <span className={cn("font-bold text-sm", segmentChannels[seg.id].text ? "text-green-900" : "text-gray-500")}>Text</span>
                          </div>
                          {segmentChannels[seg.id].text && (
                            <div className="px-4 pb-4">
                              <select
                                value={segmentTemplates[seg.id].text}
                                onChange={(e) => setSegmentTemplate(seg.id, 'text', e.target.value)}
                                className="w-full p-2 text-sm border border-green-200 rounded-lg bg-white"
                              >
                                <option value="">Select template...</option>
                                {templateOptions.text.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* EMAIL */}
                        <div className={cn(
                          "rounded-xl border-2 overflow-hidden",
                          segmentChannels[seg.id].email ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50"
                        )}>
                          <div onClick={() => toggleSegmentChannel(seg.id, 'email')} className="p-4 cursor-pointer flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center",
                              segmentChannels[seg.id].email ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"
                            )}>
                              {segmentChannels[seg.id].email && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <Mail className={cn("w-4 h-4", segmentChannels[seg.id].email ? "text-blue-600" : "text-gray-400")} />
                            <span className={cn("font-bold text-sm", segmentChannels[seg.id].email ? "text-blue-900" : "text-gray-500")}>Email</span>
                          </div>
                          {segmentChannels[seg.id].email && (
                            <div className="px-4 pb-4">
                              <select
                                value={segmentTemplates[seg.id].email}
                                onChange={(e) => setSegmentTemplate(seg.id, 'email', e.target.value)}
                                className="w-full p-2 text-sm border border-blue-200 rounded-lg bg-white"
                              >
                                <option value="">Select template...</option>
                                {templateOptions.email.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* VOICEMAIL */}
                        <div className={cn(
                          "rounded-xl border-2 overflow-hidden",
                          segmentChannels[seg.id].voicemail ? "border-purple-300 bg-purple-50" : "border-gray-100 bg-gray-50"
                        )}>
                          <div onClick={() => toggleSegmentChannel(seg.id, 'voicemail')} className="p-4 cursor-pointer flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center",
                              segmentChannels[seg.id].voicemail ? "bg-purple-500 border-purple-500" : "border-gray-300 bg-white"
                            )}>
                              {segmentChannels[seg.id].voicemail && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <Mic className={cn("w-4 h-4", segmentChannels[seg.id].voicemail ? "text-purple-600" : "text-gray-400")} />
                            <span className={cn("font-bold text-sm", segmentChannels[seg.id].voicemail ? "text-purple-900" : "text-gray-500")}>Voicemail</span>
                          </div>
                          {segmentChannels[seg.id].voicemail && (
                            <div className="px-4 pb-4 space-y-2">
                              <select
                                value={segmentTemplates[seg.id].voicemail}
                                onChange={(e) => setSegmentTemplate(seg.id, 'voicemail', e.target.value)}
                                className="w-full p-2 text-sm border border-purple-200 rounded-lg bg-white"
                              >
                                <option value="">Select or record...</option>
                                {templateOptions.voicemail.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              {recordingSegment === seg.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <span className="text-red-600 text-xs font-mono">{formatRecordTime(recordTime)}</span>
                                  <button
                                    onClick={() => { setRecordingSegment(null); setRecordTime(0); }}
                                    className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1"
                                  >
                                    <Square className="w-3 h-3" /> Stop
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setRecordingSegment(seg.id); setRecordTime(0); }}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200 transition"
                                >
                                  <Play className="w-3 h-3" /> Record Custom
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* SEND CAMPAIGN BUTTON */}
                {campaignSegmentData.some(s => selectedSegmentsForCampaign[s.id]) && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">Ready to Send</h3>
                        <p className="text-sm text-gray-500">
                          {campaignSegmentData.filter(s => selectedSegmentsForCampaign[s.id]).reduce((sum, s) => sum + CAMPAIGN_SEGMENTS[s.id].todaysCampaign, 0)} agents across {campaignSegmentData.filter(s => selectedSegmentsForCampaign[s.id]).length} segment(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                          Preview All
                        </button>
                        <button className="px-6 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Campaign
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
            <div className="flex items-center justify-start px-4 py-3 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500">Property {currentIndex + 1} of {filteredDeals.length || totalDeals}</span>
                
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
                                    Details include Address, Specs, Deal Tag (Hot/Warm/Cold), Next Actions (To-Do), and Notifications.
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

                                <div className="space-y-3">
                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">100% - Acquired</span> Closed Escrow. Make sure to update Agent 365 Report.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">80% - Offer Accepted</span> In Escrow. Make sure terms are correct in the contract.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">60% - In Negotiations</span> We are negotiating and agent is engaging/guiding us. Can be Hot/Warm/Cold. <span className="text-[#FF0000] font-bold">MUST CALL minimum once per day.</span> Do not rely on text and emails.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">50% - Contract Submitted</span> Self-represented RPA sent to listing agent. <span className="text-[#FF0000] font-bold">CALL to confirm receipt.</span> Ask when and how they are presenting offers.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">30% - Back Up</span> Pending with other buyer; we are backup. Use reminders to keep property out of Daily Tasks until the set reminder date.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">30% - Offer Terms Sent</span> Terms sent but receipt not confirmed. Use Reminders and Auto Trackers if agent is not responding.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">20% - Continue to Follow</span> Not ready to accept our price, but may sell later. Use reminders to keep property out of Daily Tasks until the set reminder date.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">10% - Initial Contact Started</span> Property is assigned to AA and under review. <span className="text-[#FF0000] font-bold">MUST CALL Agent.</span> Do not rely on text or emails. Turn on auto tracker if agent is not calling back.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">0% - Canceled FEC</span> Fully executed contract (FEC) was canceled. Update Agent 365 Report.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">0% - DO NOT USE</span> Reserve status. Do not use.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">0% - None</span> File needs attention. Update the status and set tag (Hot, Warm, Cold).</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">0% - Pass</span> Does not qualify or offer not considered. Make sure to set a Pass Reason.</div>

                                    <div><span className="font-bold text-[#FF6600] block mb-0.5">0% - Sold Others / Closed</span> Sold to other buyer. Set reminder for 3 weeks out to see who purchased it and for how much.</div>
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
                                <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row">
                            
                            <div className="w-5/12 px-4 flex flex-col justify-start gap-2">
                                <div className="flex items-center gap-2 mt-1">
                                    {currentDeal.isHot && (
                                      <div className="bg-red-500 rounded-full px-2 py-0.5 border border-red-500 flex items-center gap-1 shadow-sm">
                                          <Flame className="w-3 h-3 text-white" />
                                          <span className="text-[10px] font-bold text-white uppercase">Hot</span>
                                      </div>
                                    )}
                                    {currentDeal.isHot && <div className="w-1 h-1 rounded-full bg-gray-300"></div>}
                                    
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
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[180px] whitespace-nowrap border border-transparent hover:border-gray-200" data-testid={`button-status-${currentDeal.id}`}>
                                        <span className="font-bold text-[#4A90E2]">{currentDeal.statusPercent}</span> 
                                        <span className="truncate">{currentDeal.status}</span>
                                        <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[200px] bg-white z-50">
                                    {STATUS_OPTIONS.map((option) => (
                                      <DropdownMenuItem 
                                        key={option.label}
                                        onClick={() => handleStatusChange(currentDeal.id, option.label, option.percent)}
                                        className="flex items-center justify-between text-xs gap-2 cursor-pointer hover:bg-gray-50"
                                      >
                                        <span className="font-bold text-[#4A90E2] w-8 text-right flex-shrink-0">{option.percent}</span>
                                        <span className="truncate flex-1">{option.label}</span>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
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

                              if (line.type === 'action') {
                                return (
                                  <div key={index} className="pt-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                      <p className="text-sm text-gray-600">
                                        {displayedText}
                                        {isCurrentLine && showCursor && (
                                          <span className="inline-block w-0.5 h-4 bg-[#FF6600] ml-0.5 animate-pulse"></span>
                                        )}
                                      </p>
                                      {showCompletionState && !line.isDiveIn && (
                                        <button 
                                          onClick={() => setLocation(`/piq/${currentDeal.id}?from=new-agent&report=true`)}
                                          className="mt-3 bg-[#FF6600] hover:bg-[#e65c00] text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition animate-in fade-in duration-300"
                                          data-testid="button-generate-ai-report"
                                        >
                                          Generate AI Report
                                        </button>
                                      )}
                                      {showCompletionState && line.isDiveIn && (
                                        <div className="mt-3 flex items-center gap-3">
                                          <button 
                                            onClick={() => setLocation(`/piq/${currentDeal.id}`)}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm transition animate-in fade-in duration-300"
                                            data-testid="button-yes-dive-in"
                                          >
                                            Yes
                                          </button>
                                          <button 
                                            onClick={handleNextDeal}
                                            className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 shadow-sm transition animate-in fade-in duration-300"
                                            data-testid="button-no-skip"
                                          >
                                            No
                                          </button>
                                        </div>
                                      )}
                                    </div>
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

    </div>
  );
}

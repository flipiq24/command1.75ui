import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { cn } from "@/lib/utils";
import { useLayout } from '@/components/Layout';
import MilestoneCompletionModal from '@/components/MilestoneCompletionModal';
import StatusPipelineWidget from '@/components/StatusPipelineWidget';
import { 
  ArrowLeft,
  Snowflake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Globe,
  Edit,
  MessagesSquare,
  MessageSquare,
  Lightbulb,
  Plus,
  Mic,
  Map,
  LayoutGrid,
  List,
  Filter,
  MapPin,
  Pencil,
  Hand,
  Check,
  Sparkles,
  X,
  Mail,
  Phone,
  Building2,
  ExternalLink
} from 'lucide-react';

interface CompProperty {
  id: string;
  address: string;
  price: number;
  pricePerSqft: number;
  size: number;
  lotSize: number;
  bedBath: string;
  yearBuilt: number;
  garage: string;
  domCdom: string;
  pool: string;
  financeType: string;
  distance: string;
  closingDate: string;
  lastUpdate: string;
  listingId: string;
  listingStatus: string;
  type: string;
  conditions: string;
  agent: {
    name: string;
    email: string;
    id: string;
    phone: string;
    office: string;
  };
  agentRemarks: string;
  publicRemarks: string;
  imageUrl: string;
  color: 'green' | 'red' | 'blue';
  keep: boolean;
  whyKeep: string[];
  whyRemove: string[];
}

const initialComps: CompProperty[] = [
  {
    id: '38734340',
    address: '84303 Eremo Way',
    price: 499000,
    pricePerSqft: 242.70,
    size: 2122,
    lotSize: 7841,
    bedBath: '4/2',
    yearBuilt: 2005,
    garage: '3 cars',
    domCdom: '31 / -',
    pool: 'In Ground, Electric Heat, Community',
    financeType: 'Unknown',
    distance: '0.44 mi',
    closingDate: '12/5/2025',
    lastUpdate: '2025-10-23T00:00:00',
    listingId: '38734340',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: {
      name: 'The Briggs Group',
      email: 'info@thebriggsgroup.com',
      id: 'CDAR-D78166',
      phone: '(760) 422-4030',
      office: 'Coldwell Banker Realty'
    },
    agentRemarks: 'Go Direct. Gate Code: Guard gated.',
    publicRemarks: 'Step into this exceptional residence where indoor-outdoor living & vacation-style amenities meet everyday comfort.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: [
      'Best comp - Model match, same tract',
      'Golf course front like subject',
      'Flip condition - best ARV baseline',
      'All features match: 4/2, pool, 3-car garage',
      'Closest distance at 0.44 mi'
    ],
    whyRemove: []
  },
  {
    id: '38756123',
    address: '84521 Terra Lago Pkwy',
    price: 650000,
    pricePerSqft: 285.50,
    size: 2276,
    lotSize: 8500,
    bedBath: '4/3',
    yearBuilt: 2007,
    garage: '2 cars',
    domCdom: '45 / 12',
    pool: 'None',
    financeType: 'Conventional',
    distance: '0.62 mi',
    closingDate: '11/15/2025',
    lastUpdate: '2025-10-15T00:00:00',
    listingId: '38756123',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: {
      name: 'Desert Realty Group',
      email: 'contact@desertrealty.com',
      id: 'CDAR-D89234',
      phone: '(760) 555-1234',
      office: 'RE/MAX Desert Properties'
    },
    agentRemarks: 'Showing by appointment only. 24-hour notice required.',
    publicRemarks: 'Beautiful single-story home in the desirable Terra Lago community.',
    imageUrl: '',
    color: 'blue',
    keep: true,
    whyKeep: [
      'Same tract (Terra Lago)',
      'Recent flip with good condition',
      'Bed/bath close match (4/3 vs 4/2)',
      'Similar year built (2007 vs 2005)'
    ],
    whyRemove: [
      'NO POOL - Subject has pool',
      'Different garage config (2 vs 3 car)'
    ]
  },
  {
    id: '38789456',
    address: '84892 Lago Way',
    price: 800000,
    pricePerSqft: 320.00,
    size: 2500,
    lotSize: 10000,
    bedBath: '5/3',
    yearBuilt: 2010,
    garage: '3 cars',
    domCdom: '28 / 5',
    pool: 'In Ground, Heated',
    financeType: 'Cash',
    distance: '0.85 mi',
    closingDate: '10/28/2025',
    lastUpdate: '2025-10-01T00:00:00',
    listingId: '38789456',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: {
      name: 'Luxury Homes Indio',
      email: 'sales@luxuryhomesindio.com',
      id: 'CDAR-D92345',
      phone: '(760) 555-9876',
      office: 'Berkshire Hathaway'
    },
    agentRemarks: 'Premium listing. Serious buyers only.',
    publicRemarks: 'Stunning luxury home with panoramic mountain views.',
    imageUrl: '',
    color: 'red',
    keep: false,
    whyKeep: [
      'Same tract and school district',
      'Pool match with subject',
      'Garage match (3 cars)'
    ],
    whyRemove: [
      '5BR/3BA - Subject is 4BR/2BA, different buyer pool',
      '378 sqft larger than subject',
      'Lot 2,159 sqft larger - affects value comparison',
      'Price outlier at $800K vs subject ARV range'
    ]
  },
  {
    id: '38801234',
    address: '84312 Avenue 43',
    price: 565000,
    pricePerSqft: 275.00,
    size: 2054,
    lotSize: 6800,
    bedBath: '4/2',
    yearBuilt: 2004,
    garage: '2 cars',
    domCdom: '52 / 8',
    pool: 'None',
    financeType: 'FHA',
    distance: '1.2 mi',
    closingDate: '09/15/2025',
    lastUpdate: '2025-09-10T00:00:00',
    listingId: '38801234',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: {
      name: 'Valley Realtors',
      email: 'info@valleyrealtors.com',
      id: 'CDAR-D45678',
      phone: '(760) 555-4567',
      office: 'Keller Williams'
    },
    agentRemarks: 'Great starter home opportunity.',
    publicRemarks: 'Well-maintained home in established neighborhood.',
    imageUrl: '',
    color: 'green',
    keep: false,
    whyKeep: [
      'Bed/bath match (4/2)',
      'Similar size to subject'
    ],
    whyRemove: [
      'NO POOL - Subject has pool',
      'NOT golf course location',
      'Interior street location',
      '1.2 mi away - too far for tight comp set'
    ]
  }
];

function PIQContent() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const fromNewAgent = searchString.includes('from=new-agent');
  
  const [activeTab, setActiveTab] = useState('piq');
  const [activeRightTab, setActiveRightTab] = useState(fromNewAgent ? 'iq' : 'notes');
  const [showIQPanel, setShowIQPanel] = useState(fromNewAgent);
  const [iQViewMode, setIQViewMode] = useState<'stats' | 'description'>('stats');
  
  const [compsMapView, setCompsMapView] = useState<'map' | 'matrix' | 'list'>('map');
  const [compsMapType, setCompsMapType] = useState<'map' | 'street' | 'aerial' | 'draw' | 'freehand'>('map');
  const [showCompsIQReport, setShowCompsIQReport] = useState(false);
  const [isCompsIQLoading, setIsCompsIQLoading] = useState(false);
  const [selectedComp, setSelectedComp] = useState<CompProperty | null>(null);
  const [selectedCompIndex, setSelectedCompIndex] = useState(0);
  const [comps, setComps] = useState<CompProperty[]>(initialComps);
  const [selectedKeepIds, setSelectedKeepIds] = useState<Set<string>>(new Set());
  const [selectedRemoveIds, setSelectedRemoveIds] = useState<Set<string>>(new Set());

  const keepComps = comps.filter(c => c.keep);
  const removeComps = comps.filter(c => !c.keep);

  const handleCompClick = (comp: CompProperty, index: number) => {
    setSelectedComp(comp);
    setSelectedCompIndex(index);
  };

  const handlePrevComp = () => {
    if (selectedCompIndex > 0) {
      setSelectedCompIndex(selectedCompIndex - 1);
      setSelectedComp(comps[selectedCompIndex - 1]);
    }
  };

  const handleNextComp = () => {
    if (selectedCompIndex < comps.length - 1) {
      setSelectedCompIndex(selectedCompIndex + 1);
      setSelectedComp(comps[selectedCompIndex + 1]);
    }
  };

  const toggleCompKeep = (compId: string) => {
    setComps(prev => prev.map(c => 
      c.id === compId ? { ...c, keep: !c.keep } : c
    ));
    if (selectedComp && selectedComp.id === compId) {
      setSelectedComp(prev => prev ? { ...prev, keep: !prev.keep } : null);
    }
  };

  const moveSelectedToRemove = () => {
    setComps(prev => prev.map(c => 
      selectedKeepIds.has(c.id) ? { ...c, keep: false } : c
    ));
    setSelectedKeepIds(new Set());
  };

  const moveSelectedToKeep = () => {
    setComps(prev => prev.map(c => 
      selectedRemoveIds.has(c.id) ? { ...c, keep: true } : c
    ));
    setSelectedRemoveIds(new Set());
  };

  const toggleSelectKeep = (id: string) => {
    setSelectedKeepIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectRemove = (id: string) => {
    setSelectedRemoveIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllKeep = () => {
    if (selectedKeepIds.size === keepComps.length) {
      setSelectedKeepIds(new Set());
    } else {
      setSelectedKeepIds(new Set(keepComps.map(c => c.id)));
    }
  };

  const selectAllRemove = () => {
    if (selectedRemoveIds.size === removeComps.length) {
      setSelectedRemoveIds(new Set());
    } else {
      setSelectedRemoveIds(new Set(removeComps.map(c => c.id)));
    }
  };
  const [isIQAnalyzed, setIsIQAnalyzed] = useState(fromNewAgent);
  const [isIQAnalyzing, setIsIQAnalyzing] = useState(false);
  const [piqIQRevealKey, setPiqIQRevealKey] = useState(0);
  const [showPiqCompletionState, setShowPiqCompletionState] = useState(false);
  const [showMapValueIQ, setShowMapValueIQ] = useState(false);
  const [isMapValueIQLoading, setIsMapValueIQLoading] = useState(false);
  const [mapValueIQRevealKey, setMapValueIQRevealKey] = useState(0);
  const [showMapValueIQCompletion, setShowMapValueIQCompletion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loanProgram, setLoanProgram] = useState('Cash');
  const [otherCosts, setOtherCosts] = useState<{id: number, type: string, customName: string, amount: string}[]>([]);
  const [nextCostId, setNextCostId] = useState(1);
  
  const addOtherCost = () => {
    setOtherCosts([...otherCosts, { id: nextCostId, type: '', customName: '', amount: '' }]);
    setNextCostId(nextCostId + 1);
  };
  
  const removeOtherCost = (id: number) => {
    setOtherCosts(otherCosts.filter(c => c.id !== id));
  };
  
  const updateOtherCost = (id: number, field: 'type' | 'amount' | 'customName', value: string) => {
    setOtherCosts(otherCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const totalOtherCosts = otherCosts.reduce((sum, c) => sum + parseInt(c.amount || '0'), 0);
  
  const { openIQ } = useLayout();

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    openIQ();
  };

  const handleCelebrationTrigger = () => {
    setShowCelebration(true);
  };

  useEffect(() => {
    if (fromNewAgent) {
      setShowIQPanel(true);
      setIsIQAnalyzed(true);
    }
  }, [fromNewAgent]);

  const handleIQClick = () => {
    if (isIQAnalyzed || isIQAnalyzing) return;
    
    setIsIQAnalyzing(true);
    setShowIQPanel(true);
    
    setTimeout(() => {
      setIsIQAnalyzing(false);
      setIsIQAnalyzed(true);
    }, 1500);
  };

  const handleCompsIQClick = () => {
    setIsCompsIQLoading(true);
    setShowCompsIQReport(true);
    setTimeout(() => {
      setIsCompsIQLoading(false);
    }, 750);
  };

  const leftTabs = [
    { id: 'piq', label: 'PIQ' },
    { id: 'comps', label: 'Comps' },
    { id: 'investment', label: 'Investment Analysis' },
    { id: 'agent', label: 'Agent' },
    { id: 'offer', label: 'Offer Terms' },
  ];

  const rightTabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'activity', label: 'Activity' },
    { id: 'tax-data', label: 'Tax Data' },
  ];

  const highlightKeywords = (text: string) => {
    const keywords = [
      { word: 'potential', color: 'bg-blue-200' },
    ];
    
    let result = text;
    keywords.forEach(({ word, color }) => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, `<span class="${color} px-1 rounded">${word}</span>`);
    });
    return result;
  };

  interface StreamingLine {
    type: 'stat' | 'header' | 'bullet' | 'action';
    label?: string;
    value?: string;
    isLink?: boolean;
    linkUrl?: string;
    color?: string;
  }

  const useTypingEffect = (lines: StreamingLine[], triggerKey: number) => {
    const [displayedLines, setDisplayedLines] = useState<Record<number, string>>({});
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    useLayoutEffect(() => {
      setDisplayedLines({});
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
        setDisplayedLines(prev => ({
          ...prev,
          [currentLineIndex]: fullText.slice(0, currentCharIndex + 1)
        }));
        setCurrentCharIndex(prev => prev + 1);
      }, randomDelay);

      return () => clearTimeout(timeout);
    }, [currentLineIndex, currentCharIndex, lines, triggerKey]);

    const showCursor = cursorVisible && !isComplete;

    return { displayedLines, currentLineIndex, isComplete, showCursor };
  };

  const piqStreamingLines: StreamingLine[] = useMemo(() => [
    { type: 'stat', label: 'Status', value: 'Active' },
    { type: 'stat', label: 'Days on Market', value: '45' },
    { type: 'stat', label: 'Price to Future Value', value: '82%' },
    { type: 'stat', label: 'Propensity Score', value: '0 / 8' },
    { type: 'stat', label: 'Agent', value: 'Sarah Johnson (Unassigned)' },
    { type: 'stat', label: 'Relationship Status', value: 'Warm' },
    { type: 'stat', label: 'Investor Source Count', value: '[View Agent]', isLink: true, linkUrl: 'https://nextjs-flipiq-agent.vercel.app/agents/AaronMills' },
    { type: 'stat', label: 'Last Communication Date', value: '11/15/2025' },
    { type: 'stat', label: 'Last Address Discussed', value: '1234 Oak Street, Phoenix AZ' },
    { type: 'header', value: 'Why this Property' },
    { type: 'bullet', value: 'No propensity indicators detected for this property.' },
    { type: 'bullet', value: 'Aged listing (≥70 DOM) with strong discount potential.' },
    { type: 'bullet', value: 'Price-to-value ratio suggests room for negotiation.' },
    { type: 'action', value: 'Would you like me to run a detailed AI report?' },
  ], [piqIQRevealKey]);

  const { displayedLines: piqDisplayedLines, currentLineIndex: piqCurrentLineIndex, isComplete: piqIsTypingComplete, showCursor: piqShowCursor } = useTypingEffect(piqStreamingLines, piqIQRevealKey);

  useEffect(() => {
    if (piqIsTypingComplete) {
      const timer = setTimeout(() => {
        setShowPiqCompletionState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowPiqCompletionState(false);
    }
  }, [piqIsTypingComplete]);

  return (
      <>
      <MilestoneCompletionModal 
        isOpen={showCelebration} 
        userName="Tony"
        onComplete={handleCelebrationComplete}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        
        <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium">Thursday, November 27</div>
            <h1 className="text-lg font-bold text-gray-900">Welcome, Tony!</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Globe className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLocation('/daily-outreach')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">10573 Larch , Bloomington , CA 92316</h2>
                  <Globe className="w-4 h-4 text-gray-400" />
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusPipelineWidget 
                  currentPercent={10}
                  currentLabel="Initial Contact Started"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MessagesSquare className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="relative group/priority">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium cursor-help">
                  <Snowflake className="w-3 h-3" />
                  <span>Low</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover/priority:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                  <div className="font-bold text-white mb-2">Property Priority</div>
                  
                  <div className="p-2 rounded mb-2">
                    <div className="font-bold text-red-400 mb-1">🔥 High Priority (Work First)</div>
                    <div className="text-gray-300 text-[10px]">High probability to close. Agent is responsive or in active negotiations. Focus here first.</div>
                  </div>
                  
                  <div className="p-2 rounded mb-2">
                    <div className="font-bold text-amber-400 mb-1">🌡️ Medium Priority (Work Second)</div>
                    <div className="text-gray-300 text-[10px]">Viable potential. Agent is engaged but deal requires nurturing. Focus after High Priority.</div>
                  </div>
                  
                  <div className="p-2 rounded mb-2 bg-blue-900/50 border border-blue-500">
                    <div className="font-bold text-blue-400 mb-1">❄️ Low Priority (Work Last)</div>
                    <div className="text-gray-300 text-[10px]">Low probability right now. Agent unresponsive or wide price gap. Focus here last.</div>
                  </div>
                  
                  <div className="p-2 rounded">
                    <div className="font-bold text-gray-400 mb-1">🆕 New (Needs Review)</div>
                    <div className="text-gray-300 text-[10px]">New deal that needs to be reviewed and assigned a priority level.</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span>To do: Not set</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">0 Critical</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">0 Reminders</span>
            </div>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-200 text-sm">
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Property Details</div>
              <div className="font-medium text-gray-900 text-xs leading-relaxed">
                Single Family / 2 Br / 1 Ba / 4 Gar / 1940 / 1,951 ft² / 36,600 ft² / Pool: None
              </div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">List Price</div>
              <div className="font-bold text-gray-900">$975,000</div>
              <div className="text-xs text-gray-500">Owned over 15 years, Trust owned</div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Market Info</div>
              <div className="font-medium text-blue-600">0 Days / Active</div>
              <div className="text-xs text-gray-500">DOM: 0 / CDOM: 0</div>
              <div className="text-xs text-gray-500">Sale Type: Standard</div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Evaluation Metrics</div>
              <div className="text-xs">Asking VS ARV: <span className="text-red-500 font-medium">151.59%</span></div>
              <div className="text-xs">ARV: <span className="text-green-600 font-medium">$643,184</span></div>
              <div className="text-xs text-gray-500">Comp Data: A1, P0, B0, C2</div>
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-xs mb-1">Last Open / Last Communication</div>
              <div className="text-xs">LOD: <span className="font-medium">11/27/2025</span></div>
              <div className="text-xs">LCD: <span className="font-medium">11/24/2025</span></div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                  {leftTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'agent') {
                          setLocation('/agent/12');
                        } else {
                          setActiveTab(tab.id);
                        }
                      }}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition",
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      data-testid={`tab-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 items-center">
                  <button
                    onClick={handleCelebrationTrigger}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6600] hover:bg-[#e55c00] text-white text-xs font-bold rounded-lg transition shadow-sm mr-2"
                    data-testid="button-piq-iq-celebration"
                  >
                    <Lightbulb className="w-4 h-4" />
                    iQ
                  </button>
                  {rightTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightTab(tab.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition",
                        activeRightTab === tab.id
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                      data-testid={`tab-right-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'piq' && (
              <>
              <div className="flex gap-6">
                <div className="flex-1">
                  
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-500">Offer Negotiator</span>
                        <span className="text-gray-900 flex items-center gap-1">
                          Tony Fletcher
                          <Edit className="w-3 h-3 text-gray-400" />
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Record Created</span>
                        <span className="text-gray-900">11/25/2025</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Listing Date</span>
                        <span className="text-gray-900">11/24/2025</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">IDX</span>
                        <span className="text-gray-900">CCMA-CRMLS</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Type</span>
                        <span className="text-gray-900">Residential</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">MLS#</span>
                        <span className="text-gray-900">IG25265702</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Status</span>
                        <span className="text-gray-900 font-medium">Active</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Auto Tracker</span>
                        <span className="text-gray-900">Active 4Days</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Area</span>
                        <span className="text-gray-500">-</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Property Details</h3>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-500 flex-shrink-0">Public Comments</span>
                        <p 
                          className="text-gray-900 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightKeywords("Investor opportunity!! Although zoned for residential, there is great potential in this expansive property! Buyer to verify possible ADU (Accessory Dwelling Unit) potential with County of San Bernardino Planning Department. There is a 5-bedroom, 2-bath single story home, a detached workshop, 2 garages, 2-carports with power, separate garden potting shed and storage sheds located on this oversized even lot. Block walls surround the property with rolling electric gate at driveway. The concrete driveway was poured to accommodate up to 6 tons weight. Seller will not do any repairs or clean up existing debris.")
                          }}
                        />
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500 flex-shrink-0">Agent Comments</span>
                        <p 
                          className="text-gray-900 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightKeywords("Text me to show. Gates are locked so only entry is front door. Seller will not clean or remove remaining personal property. Sold AS IS Seller will not do repairs or remove debris.")
                          }}
                        />
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">APN</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Unit Number</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Total Floors or Levels</span>
                        <span className="text-gray-900 font-medium">One</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Sewer</span>
                        <span className="text-gray-900">Septic Type Unknown</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Property Condition</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Zoning</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Association Dues</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Common Walls</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Lock box type</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Occupied</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Showing</span>
                        <span className="text-gray-500">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-96 flex-shrink-0">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjMjI4QjIyIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] bg-cover"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium text-center">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          <span>10573 Larch Ave</span>
                        </div>
                        <div className="text-[10px] text-blue-500">Recently viewed</div>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-[4/3] bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center text-gray-600 text-xs">
                        Photo 1
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-[4/3] bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">
                        Photo 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              </>
              )}

            {activeTab === 'comps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200">
                        1551-2201 sqft
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200">
                        Built 941-1955
                      </button>
                      <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200">
                        <span>1 mile radius</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200">
                        <span>↕</span>
                        <span>List Price</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Filter className="w-3 h-3" />
                        <span>More Filters</span>
                        <span className="bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button 
                          onClick={() => setCompsMapView('map')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'map' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          Map
                        </button>
                        <button 
                          onClick={() => setCompsMapView('matrix')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'matrix' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          Matrix
                        </button>
                        <button 
                          onClick={() => setCompsMapView('list')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'list' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          List
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">3 of 3 comps</span>
                      <button className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition">
                        ✓ Finalize
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <button 
                      onClick={() => setCompsMapType('map')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'map' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Map className="w-3.5 h-3.5" />
                      Map
                    </button>
                    <button 
                      onClick={() => setCompsMapType('street')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'street' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Street View
                    </button>
                    <button 
                      onClick={() => setCompsMapType('aerial')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'aerial' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Aerial
                    </button>
                    <button 
                      onClick={() => setCompsMapType('draw')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'draw' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Draw Area
                    </button>
                    <button 
                      onClick={() => setCompsMapType('freehand')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'freehand' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Hand className="w-3.5 h-3.5" />
                      Freehand
                    </button>
                  </div>

                  <div className="relative w-full h-[450px] bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8f4f8' width='400' height='400'/%3E%3Cpath d='M0 200 Q100 150 200 200 T400 200' stroke='%23a0c4d0' fill='none' stroke-width='2'/%3E%3Cpath d='M0 300 Q150 250 300 300 T400 280' stroke='%23b0d4e0' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                        backgroundSize: 'cover'
                      }}></div>
                      
                      <div 
                        className="absolute top-1/4 left-1/4 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleCompClick(comps[0], 0)}
                        data-testid="comp-marker-1"
                      >
                        <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg hover:bg-green-700">$499K</div>
                      </div>
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleCompClick(comps[1], 1)}
                        data-testid="comp-marker-2"
                      >
                        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white hover:bg-blue-700">$650K</div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                      </div>
                      <div 
                        className="absolute bottom-1/3 right-1/4 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleCompClick(comps[2], 2)}
                        data-testid="comp-marker-3"
                      >
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg hover:bg-red-600">$800K</div>
                      </div>
                      <div className="absolute top-2/3 left-1/3">
                        <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">S</div>
                      </div>

                      <div className="absolute top-4 left-4 text-xs text-gray-600 font-medium">Bloomington</div>
                      <div className="absolute top-1/3 right-1/4 text-xs text-gray-500">Rialto</div>
                      <div className="absolute bottom-1/4 left-1/5 text-xs text-gray-500">Empire Center</div>
                      <div className="absolute bottom-1/4 right-1/3 text-xs text-gray-500">West Colton</div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-[10px] text-gray-500">
                      Google
                    </div>
                    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                      <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                      <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                    </div>
                  </div>

                  {showCompsIQReport && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                          <Lightbulb className="w-6 h-6 text-[#FF6600] animate-pulse" />
                          <div className="absolute inset-0 w-6 h-6 bg-[#FF6600] rounded-full opacity-30 animate-ping"></div>
                        </div>
                        <h2 className="text-xl font-bold text-[#FF6600]">iQ Comps Analysis</h2>
                      </div>

                      {isCompsIQLoading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-bounce"></div>
                            <span>Analyzing comparable properties...</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Avg Comp Price</div>
                              <div className="text-lg font-bold text-gray-900">$633,333</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Price per Sq Ft</div>
                              <div className="text-lg font-bold text-gray-900">$324</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Subject vs Comps</div>
                              <div className="text-lg font-bold text-red-600">+54%</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-gray-900">Key Insights:</h3>
                            <ul className="space-y-2 text-gray-700">
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Subject property is priced <span className="font-semibold text-red-600">54% above</span> comparable sales average.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Lot size (36,600 sqft) is significantly larger than comps avg (8,200 sqft) - potential ADU opportunity.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Recommend offer at <span className="font-semibold text-green-600">$650,000-$700,000</span> based on comp analysis.</span>
                              </li>
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3 border border-gray-200">
                              <Plus className="w-5 h-5 text-gray-400" />
                              <input 
                                type="text" 
                                placeholder="Ask about these comps..." 
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                                data-testid="input-comps-ask"
                              />
                              <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                                <MessageSquare className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subject Property Header */}
                  <div className="mt-6 border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-[10px] font-bold bg-gray-800 text-white px-1.5 py-0.5 rounded">SUBJECT</span>
                      <span className="font-semibold text-gray-900">84692 Pavone Way, Indio</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">4/2</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">2,472 sqft</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">7,405 lot</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">Pool</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">3 Car</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-yellow-600 font-medium">Fixer</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">Golf Front</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">Desert Sands USD</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-700">Terra Lago</span>
                    </div>
                  </div>

                  {/* Keep/Remove Two-Column Table */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* KEEP Column */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-green-50 border-b border-green-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedKeepIds.size === keepComps.length && keepComps.length > 0}
                            onChange={selectAllKeep}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            data-testid="checkbox-select-all-keep"
                          />
                          <span className="text-sm font-bold text-green-800">KEEP</span>
                          <span className="text-xs text-green-600">({keepComps.length} comps)</span>
                        </div>
                        <button
                          onClick={moveSelectedToRemove}
                          disabled={selectedKeepIds.size === 0}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition",
                            selectedKeepIds.size > 0
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          )}
                          data-testid="button-remove-selected"
                        >
                          Remove Selected
                        </button>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {keepComps.map((comp, idx) => (
                          <div 
                            key={comp.id}
                            className="px-4 py-3 hover:bg-green-50/50 cursor-pointer transition"
                            onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                            data-testid={`row-keep-comp-${comp.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedKeepIds.has(comp.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelectKeep(comp.id); }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                data-testid={`checkbox-keep-${comp.id}`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">{comp.address}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">${(comp.price / 1000).toFixed(0)}K</span>
                                    <span className={cn(
                                      "px-2 py-0.5 text-[10px] font-bold rounded",
                                      comp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                      {comp.listingStatus === 'Closed' ? 'SOLD' : comp.listingStatus.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <span>{comp.bedBath}</span>
                                  <span>•</span>
                                  <span>{comp.size.toLocaleString()} sqft</span>
                                  <span>•</span>
                                  <span>{comp.lotSize.toLocaleString()} lot</span>
                                  <span>•</span>
                                  <span>{comp.pool === 'None' ? 'No Pool' : 'Pool'}</span>
                                  <span>•</span>
                                  <span>{comp.distance}</span>
                                </div>
                                {comp.whyKeep.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {comp.whyKeep.slice(0, 2).map((reason, i) => (
                                      <div key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {keepComps.length === 0 && (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">
                            No comps in keep list
                          </div>
                        )}
                      </div>
                    </div>

                    {/* REMOVE Column */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRemoveIds.size === removeComps.length && removeComps.length > 0}
                            onChange={selectAllRemove}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            data-testid="checkbox-select-all-remove"
                          />
                          <span className="text-sm font-bold text-red-800">REMOVE</span>
                          <span className="text-xs text-red-600">({removeComps.length} comps)</span>
                        </div>
                        <button
                          onClick={moveSelectedToKeep}
                          disabled={selectedRemoveIds.size === 0}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition",
                            selectedRemoveIds.size > 0
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          )}
                          data-testid="button-keep-selected"
                        >
                          Keep Selected
                        </button>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {removeComps.map((comp, idx) => (
                          <div 
                            key={comp.id}
                            className="px-4 py-3 hover:bg-red-50/50 cursor-pointer transition"
                            onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                            data-testid={`row-remove-comp-${comp.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedRemoveIds.has(comp.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelectRemove(comp.id); }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                data-testid={`checkbox-remove-${comp.id}`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">{comp.address}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">${(comp.price / 1000).toFixed(0)}K</span>
                                    <span className={cn(
                                      "px-2 py-0.5 text-[10px] font-bold rounded",
                                      comp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                      {comp.listingStatus === 'Closed' ? 'SOLD' : comp.listingStatus.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <span>{comp.bedBath}</span>
                                  <span>•</span>
                                  <span>{comp.size.toLocaleString()} sqft</span>
                                  <span>•</span>
                                  <span>{comp.lotSize.toLocaleString()} lot</span>
                                  <span>•</span>
                                  <span>{comp.pool === 'None' ? 'No Pool' : 'Pool'}</span>
                                  <span>•</span>
                                  <span>{comp.distance}</span>
                                </div>
                                {comp.whyRemove.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {comp.whyRemove.slice(0, 2).map((reason, i) => (
                                      <div key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                                        <span className="text-red-600 font-bold">✗</span>
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {removeComps.length === 0 && (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">
                            No comps in remove list
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'investment' && (
                <div className="space-y-4">
                  {/* 3-COLUMN PROCESS FLOW LAYOUT */}
                  <div className="grid grid-cols-3 gap-4">
                    
                    {/* COLUMN 1: Property & Scope (The Asset) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Property & Scope</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">List Price</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$200,000" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-list-price"
                            />
                            <span className="text-xs text-gray-500 w-16 text-right">71.5% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Buy-Side Closing Costs</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$1,300" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-buy-closing-costs"
                            />
                            <span className="w-16"></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Renovation Budget</span>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition"
                              data-testid="button-renovation-calculator"
                            >
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <input 
                              type="text" 
                              defaultValue="$50,000" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-renovation-budget"
                            />
                            <span className="text-xs text-gray-500 w-16 text-right">17.9% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Total Acquisition Cost</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">$251,300</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">89.8% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">After Repair Value (ARV)</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$279,900" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-arv"
                            />
                            <span className="w-16"></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sell-Side Closing Costs</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 flex items-center justify-end gap-1">
                              <input 
                                type="text" 
                                defaultValue="5" 
                                className="w-12 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-sell-closing-percent"
                              />
                              <span className="text-xs text-gray-500">%</span>
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-right">$13,995</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: Targets & Results (The Decision Engine) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Targets & Results</h3>
                      
                      {/* Other Costs - moved to top */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Other Costs</span>
                          <button 
                            className="text-xs text-[#FF6600] hover:text-[#e65c00] font-medium"
                            onClick={addOtherCost}
                            data-testid="button-add-other-cost"
                          >
                            + Add
                          </button>
                        </div>
                        
                        {otherCosts.length > 0 && (
                          <div className="space-y-2">
                            {otherCosts.map((cost) => (
                              <div key={cost.id} className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                  <input 
                                    type="text"
                                    list={`cost-types-${cost.id}`}
                                    value={cost.type}
                                    onChange={(e) => updateOtherCost(cost.id, 'type', e.target.value)}
                                    placeholder="Select or type cost..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    data-testid={`input-other-cost-type-${cost.id}`}
                                  />
                                  <datalist id={`cost-types-${cost.id}`}>
                                    <option value="Wholesale Fee" />
                                    <option value="Acquisition Cost" />
                                    <option value="Short Sale Fee" />
                                    <option value="3rd Party Fee" />
                                    <option value="Agent Fee" />
                                    <option value="Sellers Closing Cost" />
                                    <option value="Due Diligence" />
                                  </datalist>
                                </div>
                                <input 
                                  type="text" 
                                  value={cost.amount}
                                  onChange={(e) => updateOtherCost(cost.id, 'amount', e.target.value)}
                                  placeholder="$0"
                                  className="w-24 px-3 py-2 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none"
                                  data-testid={`input-other-cost-${cost.id}`}
                                />
                                <button 
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => removeOtherCost(cost.id)}
                                  data-testid={`button-remove-cost-${cost.id}`}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {totalOtherCosts > 0 && (
                              <div className="text-xs text-gray-500 text-right">−${totalOtherCosts.toLocaleString()} reduces offer</div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Target Profit Input Section */}
                      <div className="space-y-3 mb-4 pt-3 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">Target Profit Goal</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                              <input 
                                type="text" 
                                defaultValue="12" 
                                className="w-full px-2 py-2 text-sm text-right bg-transparent text-gray-700 focus:outline-none"
                                data-testid="input-target-profit-percent"
                              />
                              <div className="border-l border-gray-200 px-2 py-2 bg-gray-50">
                                <span className="text-xs text-gray-500 font-medium">%</span>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                              <input 
                                type="text" 
                                defaultValue="$35,000" 
                                className="flex-1 px-3 py-2 text-sm text-right bg-transparent font-semibold text-gray-900 focus:outline-none"
                                data-testid="input-target-profit-amount"
                              />
                              <div className="border-l border-gray-200 px-2 py-2 bg-gray-50">
                                <span className="text-xs text-gray-500 font-medium">$</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Adjustment Table */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Adjustments</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">$ Off Asking</span>
                              <input 
                                type="text" 
                                defaultValue="$35,000" 
                                className="w-20 px-2 py-1 text-xs text-right border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-adjust-off-asking-amount"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">% Off Asking</span>
                              <div className="flex items-center gap-1">
                                <input 
                                  type="text" 
                                  defaultValue="17.5" 
                                  className="w-14 px-2 py-1 text-xs text-center border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  data-testid="input-adjust-off-asking-percent"
                                />
                                <span className="text-xs text-gray-400">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Calculate Button */}
                        <button 
                          className="w-full px-4 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-lg transition shadow-sm uppercase tracking-wide text-sm"
                          data-testid="button-calculate"
                        >
                          Calculate
                        </button>
                      </div>
                      
                      {/* The Results */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Offer Price</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${(165000 - totalOtherCosts).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {((165000 - totalOtherCosts) / 279900 * 100).toFixed(1)}% of ARV
                        </div>
                        <div className="text-sm text-gray-500">
                          {(((200000 - (165000 - totalOtherCosts)) / 200000) * 100).toFixed(1)}% off asking ($200,000)
                        </div>
                        {totalOtherCosts > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            (−${totalOtherCosts.toLocaleString()} other costs)
                          </div>
                        )}
                      </div>
                      
                      {/* Deal Metrics */}
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Acquisition Cost</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">${(166300 - totalOtherCosts).toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-2">{((166300 - totalOtherCosts) / 279900 * 100).toFixed(1)}% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Project Cost</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">${(216300 - totalOtherCosts).toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-2">{((216300 - totalOtherCosts) / 279900 * 100).toFixed(1)}% ARV</span>
                          </div>
                        </div>
                        {loanProgram !== 'Cash' && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="text-sm font-medium text-gray-700">Total Project Cost w/ Financing</span>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-700">${(216300 - totalOtherCosts + 8871).toLocaleString()}</span>
                              <span className="text-xs text-gray-500 ml-2">{((216300 - totalOtherCosts + 8871) / 279900 * 100).toFixed(1)}% ARV</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COLUMN 3: Financing & Hold (The Funding) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Financing & Hold</h3>
                        <select 
                          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                          data-testid="select-loan-program"
                          value={loanProgram}
                          onChange={(e) => setLoanProgram(e.target.value)}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Kiavi 75% ARV">Kiavi 75% ARV</option>
                          <option value="Hard Money 70% ARV">Hard Money 70% ARV</option>
                          <option value="Hard Money 75% ARV">Hard Money 75% ARV</option>
                          <option value="Private Money">Private Money</option>
                          <option value="Conventional">Conventional</option>
                          <option value="Seller Financing">Seller Financing</option>
                        </select>
                      </div>
                      
                      {loanProgram === 'Cash' ? (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No financing costs for cash purchase</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Hold Time</span>
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                defaultValue="4" 
                                className="w-14 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-hold-time"
                              />
                              <span className="text-xs text-gray-400">months</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Loan Principal</span>
                            <input 
                              type="text" 
                              defaultValue="$209,925" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                              readOnly
                              data-testid="input-loan-principal"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Origination Points</span>
                            <input 
                              type="text" 
                              defaultValue="$1,574" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-origination-points"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Lender Fees</span>
                            <input 
                              type="text" 
                              defaultValue="$999" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-lender-fees"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Projected Interest Expense</span>
                            <input 
                              type="text" 
                              defaultValue="$6,298" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                              readOnly
                              data-testid="input-interest-expense"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Total Financing Costs</span>
                            <input 
                              type="text" 
                              defaultValue="$8,871" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-300 rounded-md bg-gray-100 font-semibold text-gray-700 focus:outline-none"
                              readOnly
                              data-testid="input-total-financing-costs"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Levered Profit</span>
                            <input 
                              type="text" 
                              defaultValue="$40,734" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-300 rounded-md bg-gray-100 font-semibold text-gray-900 focus:outline-none"
                              readOnly
                              data-testid="input-levered-profit"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </main>

        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        {/* Comp Detail Modal */}
        {selectedComp && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSelectedComp(null)}
            />
            <div className="relative bg-white shadow-2xl w-full max-w-xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{selectedComp.address}</span>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-bold rounded",
                    selectedComp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}>
                    {selectedComp.listingStatus}
                  </span>
                  <span className="text-sm text-gray-500">{selectedComp.closingDate}</span>
                </div>
                <button 
                  onClick={() => setSelectedComp(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  data-testid="button-close-comp-detail"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
                <button 
                  onClick={handlePrevComp}
                  disabled={selectedCompIndex === 0}
                  className={cn(
                    "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition",
                    selectedCompIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                  data-testid="button-prev-comp"
                >
                  Previous
                </button>
                <button 
                  onClick={handleNextComp}
                  disabled={selectedCompIndex === comps.length - 1}
                  className={cn(
                    "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition",
                    selectedCompIndex === comps.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                  data-testid="button-next-comp"
                >
                  Next
                </button>
              </div>

              <div className="p-6">
                {/* Map Preview */}
                <div className="relative w-full h-48 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8f4f8' width='400' height='400'/%3E%3Cpath d='M0 200 Q100 150 200 200 T400 200' stroke='%23a0c4d0' fill='none' stroke-width='2'/%3E%3Cpath d='M0 300 Q150 250 300 300 T400 280' stroke='%23b0d4e0' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                      backgroundSize: 'cover'
                    }}></div>
                    <div className="absolute top-1/4 left-1/4">
                      <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">$499K</div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className={cn(
                        "text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white",
                        selectedComp.color === 'green' ? "bg-green-600" : selectedComp.color === 'red' ? "bg-red-500" : "bg-blue-600"
                      )}>
                        ${(selectedComp.price / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div className="absolute bottom-1/3 right-1/4">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">$800K</div>
                    </div>
                    <div className="absolute top-2/3 left-1/3">
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">S</div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-gray-500">Google</div>
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button className="w-6 h-6 bg-white rounded shadow flex items-center justify-center text-gray-600 text-xs">+</button>
                    <button className="w-6 h-6 bg-white rounded shadow flex items-center justify-center text-gray-600 text-xs">−</button>
                  </div>
                </div>

                {/* WHY KEEPING / WHY REMOVING Section */}
                {selectedComp.keep ? (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                      <span className="text-green-600">✓</span> WHY KEEPING THIS COMP
                    </h3>
                    <div className="border-t border-green-200 pt-3">
                      <ul className="space-y-2">
                        {selectedComp.whyKeep.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                      <span className="text-red-600">✗</span> WHY REMOVING THIS COMP
                    </h3>
                    <div className="border-t border-red-200 pt-3">
                      <ul className="space-y-2">
                        {selectedComp.whyRemove.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Keep/Remove Action Buttons */}
                <div className="mb-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!selectedComp.keep) {
                        setComps(prev => prev.map(c => c.id === selectedComp.id ? { ...c, keep: true } : c));
                        setSelectedComp(prev => prev ? { ...prev, keep: true } : null);
                      }
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2",
                      selectedComp.keep 
                        ? "bg-green-600 text-white" 
                        : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50"
                    )}
                    data-testid="button-keep-comp"
                  >
                    <span>✓</span> Keep
                  </button>
                  <button
                    onClick={() => {
                      if (selectedComp.keep) {
                        setComps(prev => prev.map(c => c.id === selectedComp.id ? { ...c, keep: false } : c));
                        setSelectedComp(prev => prev ? { ...prev, keep: false } : null);
                      }
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2",
                      !selectedComp.keep 
                        ? "bg-red-600 text-white" 
                        : "bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
                    )}
                    data-testid="button-remove-comp"
                  >
                    <span>✗</span> Remove
                  </button>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">R_ID:</span>
                    <span className="font-medium text-gray-900">{selectedComp.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-gray-900">${selectedComp.price.toLocaleString()} / $515,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price/Sqft:</span>
                    <span className="font-medium text-gray-900">${selectedComp.pricePerSqft.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bed/Bath:</span>
                    <span className="font-medium text-gray-900">{selectedComp.bedBath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium text-gray-900">{selectedComp.size.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lot Size:</span>
                    <span className="font-medium text-gray-900">{selectedComp.lotSize.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Year Built:</span>
                    <span className="font-medium text-gray-900">{selectedComp.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Garage:</span>
                    <span className="font-medium text-gray-900">{selectedComp.garage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DOM/CDOM:</span>
                    <span className="font-medium text-gray-900">{selectedComp.domCdom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pool:</span>
                    <span className="font-medium text-gray-900 text-right max-w-[150px] truncate" title={selectedComp.pool}>{selectedComp.pool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium text-gray-900">{selectedComp.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Finance Type:</span>
                    <span className="font-medium text-gray-900">{selectedComp.financeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Closing Date:</span>
                    <span className="font-medium text-gray-900">{selectedComp.closingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="font-medium text-gray-900">{new Date(selectedComp.lastUpdate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listing ID:</span>
                    <span className="font-medium text-gray-900">{selectedComp.listingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listing Status:</span>
                    <span className="font-medium text-gray-900">{selectedComp.listingStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-900">{selectedComp.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conditions:</span>
                    <span className="font-medium text-gray-900">{selectedComp.conditions}</span>
                  </div>
                </div>

                {/* Agent Section */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Agent</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedComp.agent.email}`} className="text-blue-600 hover:underline">{selectedComp.agent.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedComp.agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Office:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.office}</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    See more info
                  </button>
                </div>

                {/* Agent Remarks */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Agent Remarks:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedComp.agentRemarks}</p>
                </div>

                {/* Public Remarks */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Public Remarks:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedComp.publicRemarks}</p>
                </div>

                {/* Conditions Dropdown */}
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Conditions:</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="select-comp-conditions"
                  >
                    <option>Select condition...</option>
                    <option>Standard</option>
                    <option>REO/Bank Owned</option>
                    <option>Short Sale</option>
                    <option>Probate</option>
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Status:</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="select-comp-status"
                  >
                    <option>Select status...</option>
                    <option>Include</option>
                    <option>Exclude</option>
                    <option>Primary</option>
                  </select>
                </div>

                {/* Influences Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">INFLUENCES</h3>
                  <div className="text-sm text-gray-500">No influences recorded</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
  );
}

export default function PIQ() {
  return <PIQContent />;
}

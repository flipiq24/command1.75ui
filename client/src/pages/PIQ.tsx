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
  Sparkles
} from 'lucide-react';

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
  const [isIQAnalyzed, setIsIQAnalyzed] = useState(fromNewAgent);
  const [isIQAnalyzing, setIsIQAnalyzing] = useState(false);
  const [piqIQRevealKey, setPiqIQRevealKey] = useState(0);
  const [showPiqCompletionState, setShowPiqCompletionState] = useState(false);
  const [showMapValueIQ, setShowMapValueIQ] = useState(false);
  const [isMapValueIQLoading, setIsMapValueIQLoading] = useState(false);
  const [mapValueIQRevealKey, setMapValueIQRevealKey] = useState(0);
  const [showMapValueIQCompletion, setShowMapValueIQCompletion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
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
                      
                      <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2">
                        <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">$450K</div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white">$650K</div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4">
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">$800K</div>
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
                          <input 
                            type="text" 
                            defaultValue="$200,000" 
                            className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            data-testid="input-list-price"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">After Repair Value (ARV)</span>
                          <input 
                            type="text" 
                            defaultValue="$279,900" 
                            className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            data-testid="input-arv"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Renovation Budget</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" 
                              defaultValue="$50,000" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-renovation-budget"
                            />
                            <button 
                              className="p-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                              data-testid="button-renovation-calculator"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Buy-Side Closing Costs</span>
                          <input 
                            type="text" 
                            defaultValue="$1,300" 
                            className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            data-testid="input-buy-closing-costs"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sell-Side Closing Costs</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" 
                              defaultValue="5" 
                              className="w-10 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-sell-closing-percent"
                            />
                            <span className="text-xs text-gray-400">%</span>
                            <input 
                              type="text" 
                              defaultValue="$13,995" 
                              className="w-20 px-2 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                              readOnly
                              data-testid="input-sell-closing-amount"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: Targets & Results (The Decision Engine) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Targets & Results</h3>
                      
                      {/* Target Profit Input Section */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">Target Profit Goal</span>
                          <div className="flex items-center gap-2">
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
                            <span className="text-gray-400 text-sm">or</span>
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
                        <div className="text-2xl font-bold text-gray-900">$165,000</div>
                        <div className="text-sm text-gray-500 mt-0.5">58.95% of ARV</div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Projected Cash Net Profit</span>
                          <span className="text-lg font-bold text-gray-900">$49,605</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">ROI</span>
                          <span className="text-lg font-bold text-gray-900">22.93%</span>
                        </div>
                      </div>
                      
                      {/* Deal Metrics */}
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Acquisition Cost</span>
                          <span className="text-sm text-gray-700">$166,300</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Project Cost</span>
                          <span className="text-sm text-gray-700">$216,300</span>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 3: Financing & Hold (The Funding) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Financing & Hold</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Loan Program</span>
                          <select 
                            className="w-36 px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            data-testid="select-loan-program"
                          >
                            <option>Kiavi 75% ARV</option>
                            <option>Cash</option>
                            <option>Hard Money 70% ARV</option>
                            <option>Hard Money 75% ARV</option>
                            <option>Private Money</option>
                            <option>Conventional</option>
                            <option>Seller Financing</option>
                          </select>
                        </div>
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
      </div>
      </>
  );
}

export default function PIQ() {
  return <PIQContent />;
}

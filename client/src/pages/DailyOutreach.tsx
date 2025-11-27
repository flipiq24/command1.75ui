import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import OutreachActionPlan, { OutreachType } from "@/components/OutreachActionPlan";
import Sidebar from "@/components/Sidebar";
import { 
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Bot,
  MapPin,
  User,
  Building2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Deal {
  id: number;
  address: string;
  specs: string;
  price: string;
  propensity: string | string[];
  source: string;
  type: 'hot' | 'warm' | 'cold' | 'new';
  status: string;
  statusPercent: string;
  lastOpen: string;
  lastCalled: string;
}

const getPropensityScore = (propensity: string | string[]) => {
  if (!Array.isArray(propensity)) return 0;
  
  const PROPENSITY_POINTS: Record<string, number> = {
    "Notice of Trustee Sale (NTS)": 8,
    "Notice of Default (NOD)": 6,
    "Tax Delinquency": 5,
    "Affidavit of Death": 5,
    "Bankruptcy / Judgment": 4,
    "Involuntary Liens": 3,
    "Expired Listing": 3,
    "Vacant Property": 2,
    "High Mortgage / Debt": 2,
    "Non-Owner Occupied": 2,
    "High Equity (>50%)": 2,
    "Long Term Owner (20+ Yrs)": 2,
    "Corporate / Trust Owned": 1,
    "Owns Multiple Properties": 1,
    "Adjustable Rate Mortgage": 1,
    "Free & Clear": 1,
    "Transferred in Last 2 Years": 0,
  };
  
  let score = 0;
  propensity.forEach(p => {
    score += PROPENSITY_POINTS[p] || 0;
  });
  return score;
};

const getDistressIndicators = (propensity: string | string[]) => {
  if (!Array.isArray(propensity)) return [];
  return propensity.filter(p => 
    p.includes("Default") || p.includes("Delinquency") || p.includes("Trustee") || 
    p.includes("Bankruptcy") || p.includes("Liens") || p.includes("Vacant")
  );
};

export default function DailyOutreach() {
  const [activeFilter, setActiveFilter] = useState<OutreachType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    }
  });

  const filteredDeals = useMemo(() => {
    let filtered = [...deals];
    
    if (activeFilter === 'connections') {
      filtered = filtered.filter((deal: Deal) => 
        deal.type === 'new' || deal.status === "None"
      );
    } else if (activeFilter === 'priority') {
      filtered = filtered.filter((deal: Deal) => 
        deal.type === 'hot' || deal.type === 'warm'
      );
    } else if (activeFilter === 'topOfMind') {
      filtered = filtered.filter((deal: Deal) => 
        deal.type === 'cold' || deal.type === 'warm'
      );
    } else {
      filtered = filtered.filter((deal: Deal) => deal.status === "None");
      
      if (filtered.length === 0) {
        filtered = [...deals];
      }
    }

    return filtered.sort((a: Deal, b: Deal) => {
      const order = { hot: 0, warm: 1, cold: 2, new: 3 };
      return (order[a.type] || 3) - (order[b.type] || 3);
    });
  }, [deals, activeFilter]);
  
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const currentDeal = filteredDeals[currentIndex] as Deal | undefined;
  const totalDeals = filteredDeals.length;

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalDeals - 1, prev + 1));
  };

  const mockAgentData = {
    name: "Sarah Jenkins",
    phone: "(909) 555-0123",
    email: "sarah.j@kw.com",
    brokerage: "Keller Williams Realty",
    relationshipStatus: "Cold",
    lastCommunication: "N/A"
  };

  const dom = 94;
  const ptfv = "72%";

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Wednesday, November 26</div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Welcome, Tony!</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="bg-white hover:bg-gray-50 text-black text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm" data-testid="button-add-agent">
                <span className="group-hover:text-[#FF6600] transition-colors">Add Agent</span>
                <span className="text-[#FF6600] text-xl font-bold leading-none">+</span>
              </button>
            </div>
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-colors border border-gray-200 shadow-sm" data-testid="button-ai-bot">
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          <OutreachActionPlan 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
              Loading properties...
            </div>
          ) : !currentDeal ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
              No properties available for outreach.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#FF6600]" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900" data-testid="text-property-address">
                      {currentDeal.address}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                        Active
                      </span>
                      <span className="text-xs text-gray-500">{currentDeal.specs}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Property <span className="font-bold text-gray-900">{currentIndex + 1}</span> of <span className="font-bold text-gray-900">{totalDeals}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      data-testid="button-previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={currentIndex === totalDeals - 1}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF6600] rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Why Are We Chasing This Property?</h3>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#FF6600]" />
                        <span>Aged listing ({dom} DOM) with strong discount potential (PTFV: {ptfv})</span>
                      </li>
                      {getDistressIndicators(currentDeal.propensity).length > 0 && (
                        <li className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#FF6600]" />
                          <span>Keywords detected: {getDistressIndicators(currentDeal.propensity).join(", ")}</span>
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#FF6600]" />
                        <span>Currently unassigned — open opportunity for acquisition</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-8">
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Property Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">List Price</span>
                        <span className="font-bold text-gray-900">{currentDeal.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">PTFV %</span>
                        <span className="font-bold text-green-600">{ptfv}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Propensity Score</span>
                        <span className={cn(
                          "font-bold",
                          getPropensityScore(currentDeal.propensity) >= 6 ? "text-red-600" : 
                          getPropensityScore(currentDeal.propensity) >= 3 ? "text-green-600" : "text-blue-600"
                        )}>
                          {getPropensityScore(currentDeal.propensity)} / 8
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Days on Market</span>
                        <span className="font-bold text-amber-600">{dom} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Source</span>
                        <span className="font-bold text-gray-900">{currentDeal.source}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Agent Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Agent Name</span>
                        <span className="font-bold text-gray-900">{mockAgentData.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Brokerage</span>
                        <span className="font-medium text-gray-700">{mockAgentData.brokerage}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Relationship Status</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          mockAgentData.relationshipStatus === "Hot" ? "bg-red-100 text-red-700" :
                          mockAgentData.relationshipStatus === "Warm" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {mockAgentData.relationshipStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Last Communication</span>
                        <span className={cn(
                          "font-medium",
                          mockAgentData.lastCommunication === "N/A" ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded" : "text-gray-900"
                        )}>
                          {mockAgentData.lastCommunication}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Phone</span>
                        <span className="font-medium text-gray-900">{mockAgentData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Suggested Agent Script
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    "Hey <span className="font-bold text-[#FF6600]">{mockAgentData.name}</span>, this is Tony from FlipIQ. 
                    I noticed <span className="font-bold">{currentDeal.address}</span> has been on the market for 
                    <span className="font-bold text-amber-600"> {dom} days</span>. I work with investors who are actively 
                    looking in this area, and I wanted to see if your seller might be open to considering a cash offer. 
                    We can typically close in 14-21 days. Would that be something worth exploring?"
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Ready to reach out?</h4>
                    <p className="text-sm text-gray-500">Connect with {mockAgentData.name} using one of the options below.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors" data-testid="button-text">
                      <MessageSquare className="w-4 h-4" />
                      Text
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors" data-testid="button-email">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors" data-testid="button-voicemail">
                      <Mic className="w-4 h-4" />
                      Drop VM
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold text-white transition-colors shadow-md" data-testid="button-call-agent">
                      <Phone className="w-5 h-5" />
                      Call Agent
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

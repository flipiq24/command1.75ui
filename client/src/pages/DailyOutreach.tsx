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
  Building2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  TrendingDown
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

const mockPriceHistory = [
  { date: "11/15/25", price: "$75,000", change: "-6.3%" },
  { date: "10/01/25", price: "$80,000", change: "-5.9%" },
  { date: "08/20/25", price: "$85,000", change: "-5.6%" },
  { date: "07/10/25", price: "$90,000", change: "-10.0%" },
  { date: "06/01/25", price: "$100,000", change: "—" },
];

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
    investorDeals: 3
  };

  const dom = 94;
  const ptfv = "72%";

  const getAgentFirstName = () => mockAgentData.name.split(' ')[0];

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
                    Property <span className="font-bold text-gray-900">{currentIndex + 1}</span> of <span className="font-bold text-gray-900">30</span>
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

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF6600] rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Why Are We Chasing This Property?</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
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

              <div className="flex border-b border-gray-200">
                
                <div className="flex-1 p-6 border-r border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Property Details
                  </h4>
                  
                  <div className="space-y-3 mb-6">
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
                      <span className="font-bold text-gray-900">{currentDeal.source} / Active</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Price History (Last 12 Months)
                    </h5>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-100 text-gray-500 uppercase tracking-wider">
                            <th className="px-3 py-2 text-left font-bold">Date</th>
                            <th className="px-3 py-2 text-left font-bold">New Price</th>
                            <th className="px-3 py-2 text-right font-bold">% Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockPriceHistory.map((row, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-3 py-2 text-gray-700">{row.date}</td>
                              <td className="px-3 py-2 font-bold text-gray-900">{row.price}</td>
                              <td className={cn(
                                "px-3 py-2 text-right font-bold",
                                row.change.startsWith("-") ? "text-red-600" : "text-gray-400"
                              )}>{row.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="w-[400px] p-6 overflow-y-auto">
                  
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{mockAgentData.name}</h3>
                    <p className="text-sm text-gray-500">{mockAgentData.brokerage}</p>
                    <a 
                      href={`https://data.flipiq.com/agents/${mockAgentData.name.replace(/\s+/g, '').toUpperCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-[#FF6600] hover:text-[#e55b00] transition-colors"
                      data-testid="link-investor-source"
                    >
                      <span>Investor Source Count: {mockAgentData.investorDeals}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Relationship Status</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="select-relationship-status">
                          <option>Select...</option>
                          <option>Priority</option>
                          <option>Hot</option>
                          <option>Warm</option>
                          <option>Cold</option>
                          <option>Unknown</option>
                          <option>DO NOT CONTACT</option>
                          <option>Skip Trace</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Agent Rating</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="select-agent-rating">
                          <option>Select...</option>
                          <option>Unresponsive</option>
                          <option>Average</option>
                          <option>Cooperative</option>
                          <option>Investor</option>
                          <option>Wholesaler</option>
                          <option>Seller</option>
                          <option>Lender</option>
                          <option>DO NOT CONTACT</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Basket</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="select-basket">
                          <option>Select...</option>
                          <option>Cloud CMA</option>
                          <option>Clients</option>
                          <option>Prospects</option>
                          <option>High Value</option>
                          <option>Mid Value</option>
                          <option>Low Value</option>
                          <option>DO NOT CONTACT</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Active Last 2 Yrs</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="select-active-2yrs">
                          <option>Select...</option>
                          <option>True</option>
                          <option>False</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Follow Up Status</label>
                      <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="select-followup-status">
                        <option>Select...</option>
                        <option>Signed Up to Webinar</option>
                        <option>FlipIQ Marketplace Member</option>
                        <option>HWC Campaign</option>
                        <option>Contact Made, Continue to Follow</option>
                        <option>Did Not attend Webinar</option>
                        <option>Opened Link</option>
                        <option>Wrong Agent Data</option>
                        <option>Not Interested</option>
                        <option>Do Not Contact</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Status Date</label>
                        <input type="date" className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="input-status-date" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Last Comm Date</label>
                        <input type="date" defaultValue="2025-03-18" className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="input-last-comm-date" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Last Address Discussed</label>
                      <input type="text" placeholder="123 Main St..." className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="input-last-address" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Last Communicated AA</label>
                      <input type="text" placeholder="Name of AA..." className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:border-orange-500 outline-none" data-testid="input-last-aa" />
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
                    "Hey <span className="font-bold text-[#FF6600]">{getAgentFirstName()}</span>, this is Tony from (Company). 
                    I noticed you sourced deals to investors like FairTrade, LLC and others like Investosocal, I believe the deal on 123 Green street was a good one. 
                    So I know you understand investment grade properties. I'm calling you on <span className="font-bold">{currentDeal.address}</span> which 
                    has been on the market <span className="font-bold text-amber-600">{dom} days</span>. We are proven investors that move quickly. 
                    Wanted to see if your seller is open to a cash offer. We can close in 14-21 days. Would that be worth exploring?"
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Ready to reach out?</h4>
                    <p className="text-sm text-gray-500">Connect with {mockAgentData.name} using one of the options below.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#FF6600] hover:bg-[#e55b00] rounded-lg text-sm font-bold text-white transition-colors shadow-md" data-testid="button-call-agent">
                      <Phone className="w-5 h-5" />
                      Call Agent
                    </button>
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

import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import ActionPlan, { DealType } from "@/components/ActionPlan";
import { useLayout } from "@/components/Layout";
import { Plus } from 'lucide-react';
import { 
  ChevronDown,
  MessagesSquare,
  Target,
  Flame,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Bot
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StatusPipelineWidget from "@/components/StatusPipelineWidget";

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
  isHot?: boolean;
}

const getPropensityScore = (propensity: string | string[]) => {
  if (!Array.isArray(propensity)) return 0;
  
  let score = 0;
  propensity.forEach(p => {
    const item = PROPENSITY_LEGEND.find(l => l.indicator === p);
    if (item) score += item.points;
  });
  return score;
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
  { color: "text-red-600", bgColor: "bg-red-100", label: "🔴 RED", indicator: "Notice of Trustee Sale (NTS)", category: "Foreclosure", points: 8, source: "Foreclosure Status / Auction Date", explanation: "Property scheduled for foreclosure auction. Highest motivation to sell. Owner has limited time before losing property." },
  { color: "text-red-600", bgColor: "bg-red-100", label: "🔴 RED", indicator: "Notice of Default (NOD)", category: "Foreclosure", points: 6, source: "Foreclosure Status / Recording Date", explanation: "Foreclosure process has started. Owner missed payments and received formal notice. 90-120 days before auction typically." },
  { color: "text-red-600", bgColor: "bg-red-100", label: "🔴 RED", indicator: "Tax Delinquency", category: "Financial", points: 5, source: "Tax Status / Total Tax Due", explanation: "Property taxes are past due. Owner may be facing financial hardship or has abandoned property." },
  { color: "text-red-600", bgColor: "bg-red-100", label: "🔴 RED", indicator: "Affidavit of Death", category: "Life Event", points: 5, source: "Transfer Document Type / Grantor Name", explanation: "Recent death of property owner. Estate may need to liquidate quickly to settle debts or distribute assets." },
  { color: "text-red-600", bgColor: "bg-red-100", label: "🔴 RED", indicator: "Bankruptcy / Judgment", category: "Financial", points: 4, source: "Involuntary Liens (Bankruptcy Flag)", explanation: "Owner has bankruptcy filing or court judgment. May need to sell to settle debts." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "Involuntary Liens", category: "Financial", points: 3, source: "Lien Type (HOA, Mechanics, Judgment)", explanation: "HOA, mechanics, or judgment liens attached to property. Owner has outstanding debts that must be cleared at sale." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "Expired Listing", category: "Market Status", points: 3, source: "Listing Status (Expired, Withdrawn, Canceled)", explanation: "Property was listed but didn't sell. Owner may be frustrated, more realistic on price, and motivated to try again." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "Vacant Property", category: "Occupancy", points: 2, source: "Vacancy Status (USPS Data)", explanation: "Property is unoccupied per USPS data. Owner carrying costs (taxes, insurance, maintenance) with no income." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "High Mortgage / Debt", category: "Financial", points: 2, source: "Open Loans / Estimated Equity", explanation: "Low equity or high loan balance. Owner may be underwater or have thin margins—motivated by relief." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "Non-Owner Occupied", category: "Occupancy", points: 2, source: "Absentee Owner (Yes/No)", explanation: "Absentee owner / investor property. Often more willing to sell for right price—it's business, not emotional." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "High Equity (>50%)", category: "Financial", points: 2, source: "Estimated Equity %", explanation: "Owner has significant equity built up. More room to negotiate below market and still walk away with profit." },
  { color: "text-green-600", bgColor: "bg-green-100", label: "🟢 GREEN", indicator: "Long Term Owner (20+ Yrs)", category: "Ownership", points: 2, source: "Last Sale Date", explanation: "Owned 20+ years. Likely has massive equity, may be tired landlord, aging owner, or inherited situation." },
  { color: "text-blue-600", bgColor: "bg-blue-100", label: "🔵 BLUE", indicator: "Corporate / Trust Owned", category: "Ownership", points: 1, source: "Owner Type (Trust, LLC, Corp)", explanation: "Owned by LLC, trust, or corporation. Often indicates investor who may be liquidating portfolio or settling estate." },
  { color: "text-blue-600", bgColor: "bg-blue-100", label: "🔵 BLUE", indicator: "Owns Multiple Properties", category: "Ownership", points: 1, source: "Properties Owned Count", explanation: "Owner has multiple properties. May be willing to sell underperformers to focus on better assets." },
  { color: "text-blue-600", bgColor: "bg-blue-100", label: "🔵 BLUE", indicator: "Adjustable Rate Mortgage", category: "Financial", points: 1, source: "Loan Rate Type (ARM vs Fixed)", explanation: "ARM loan that may adjust upward. Rising payments could create future motivation to sell." },
  { color: "text-blue-600", bgColor: "bg-blue-100", label: "🔵 BLUE", indicator: "Free & Clear", category: "Financial", points: 1, source: "Open Loans = 0", explanation: "No mortgage on property. Owner has 100% equity and full flexibility—no lender approval needed." },
  { color: "text-blue-600", bgColor: "bg-blue-100", label: "🔵 BLUE", indicator: "Transferred in Last 2 Years", category: "Ownership", points: 0, source: "Last Sale Date", explanation: "Recent ownership transfer. New owner unlikely to sell quickly—low motivation indicator." },
];

const getPropensityColor = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("trustee") || t.includes("default") || t.includes("tax") || t.includes("death") || t.includes("bankruptcy")) return "text-red-600";
  if (t.includes("lien") || t.includes("expired") || t.includes("vacant") || t.includes("debt") || t.includes("equity") || t.includes("owner") || t.includes("years")) return "text-green-600";
  if (t.includes("trust") || t.includes("corporate") || t.includes("multiple") || t.includes("adjustable") || t.includes("free") || t.includes("transferred")) return "text-blue-600";
  return "text-gray-500";
};

function HomeContent() {
  const searchString = useSearch();
  const [activeFilter, setActiveFilter] = useState<DealType | 'goal' | 'completed' | null>(null);
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  const [completionPercent, setCompletionPercent] = useState(100);
  const queryClient = useQueryClient();
  const { openIQWithDealComplete, openAddProperty } = useLayout();

  const handleMilestoneComplete = () => {
    openIQWithDealComplete();
  };

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const filterParam = params.get('filter');
    if (filterParam === 'hot' || filterParam === 'warm' || filterParam === 'cold' || filterParam === 'new') {
      setActiveFilter(filterParam as DealType);
    }
  }, [searchString]);

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
    return sortedDeals.filter(deal => {
      if (!activeFilter) return true;
      
      if (activeFilter === 'goal') {
        return (deal.status === "Offer Terms Sent" || deal.status === "Contract Submitted");
      }

      if (activeFilter === 'completed') {
        return (deal.type === 'hot' || deal.type === 'warm' || deal.type === 'cold') && deal.status !== 'None';
      }

      return deal.type === activeFilter;
    });
  }, [sortedDeals, activeFilter]);

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

  return (
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-gray-50">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Saturday, November 29</div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, Tony!</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={openAddProperty}
              className="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 shadow-sm"
            >
              Add Property
              <span className="text-[#FF6600] text-lg font-bold leading-none">+</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          {/* Action Plan Component */}
          <ActionPlan 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter}
            completionPercent={completionPercent}
            userName="Tony"
            onMilestoneComplete={handleMilestoneComplete}
          />

            {/* Current Task List - Reorganized Layout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
                
                {/* Table Header */}
                <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none">
                    <div className="w-[48px] shrink-0 flex flex-col justify-center items-center gap-0.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={filteredDeals.length > 0 && filteredDeals.every(d => selectedDealIds.includes(d.id))}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          title="Select All Filtered Deals"
                        />
                        <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">All</span>
                    </div> 
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
                                  <button className="bg-[#FF6600] hover:bg-[#e65c00] text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 transition-colors ml-2 normal-case">
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
                                        <div><span className="font-bold text-[#FF6600]">0% - None</span><br/><span className="text-gray-400">File needs attention. Update the status and set tag (Hot, Warm, Cold).</span></div>
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
                                        <div><span className="font-bold text-[#FF6600]">60% - In Negotiations</span><br/><span className="text-gray-400">We are negotiating and agent is engaging/guiding us. Can be Hot/Warm/Cold. <span className="text-[#FF0000] font-bold">MUST CALL minimum once per day.</span> Do not rely on text and emails.</span></div>
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

                {/* Deal Rows */}
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Loading deals...
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No deals found matching the selected filter.
                  </div>
                ) : (
                  filteredDeals.map((deal) => (
                    <div key={deal.id} className={cn("flex border-b border-gray-100 hover:bg-gray-50 transition group py-4", selectedDealIds.includes(deal.id) && "bg-blue-50/50 hover:bg-blue-50")}>
                        <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={selectedDealIds.includes(deal.id)}
                              onChange={(e) => handleSelectDeal(deal.id, e.target.checked)}
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
                                    {deal.isHot && (
                                      <div className="bg-red-500 rounded-full px-2 py-0.5 border border-red-500 flex items-center gap-1 shadow-sm">
                                          <Flame className="w-3 h-3 text-white" />
                                          <span className="text-[10px] font-bold text-white uppercase">Hot</span>
                                      </div>
                                    )}
                                    {deal.isHot && <div className="w-1 h-1 rounded-full bg-gray-300"></div>}
                                    
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    <div className="relative">
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap">
                                            To do: Not set <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 whitespace-nowrap">• 0 Critical • 0 Reminders</div>
                                </div>
                                
                                <div>
                                    <div className="font-bold text-gray-900 text-base mb-1">{deal.address}</div>
                                    <div className="text-xs text-gray-500">{deal.specs}</div>
                                </div>
                            </div>

                            <div className="w-2/12 px-4 flex flex-col items-center text-center">
                                <div className="font-bold text-gray-900 text-base mb-1">{deal.price}</div>
                                {Array.isArray(deal.propensity) ? (
                                  <>
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <span className="text-[10px] text-gray-400">Propensity Score:</span>
                                      <span className={cn(
                                        "text-[11px] font-medium",
                                        getPropensityScore(deal.propensity) >= 6 ? "text-red-600" : 
                                        getPropensityScore(deal.propensity) >= 3 ? "text-green-600" : "text-blue-600"
                                      )}>
                                        {getPropensityScore(deal.propensity)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 mb-1">
                                      {deal.propensity.map((item: string, idx: number) => {
                                        const indicatorData = PROPENSITY_LEGEND.find(l => l.indicator === item);
                                        return (
                                          <div key={idx} className="group/item relative cursor-help leading-none hover:z-50">
                                            <span className={cn("text-[10px] font-bold inline-block opacity-80", 
                                              indicatorData?.color || getPropensityColor(item)
                                            )}>
                                              {item}
                                            </span>
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover/item:opacity-100 pointer-events-none z-50 hidden group-hover/item:block border border-gray-700">
                                              <div className="font-bold text-[#FF6600] mb-2">{item}</div>
                                              {indicatorData && (
                                                <>
                                                  <div className="text-gray-300 mb-2 text-[11px] leading-relaxed">{indicatorData.explanation}</div>
                                                  <div className="border-t border-gray-700 pt-2 space-y-1">
                                                    <div className="text-gray-300"><span className="text-gray-400">Category:</span> {indicatorData.category}</div>
                                                    <div className="text-gray-300"><span className="text-gray-400">Points:</span> {indicatorData.points}</div>
                                                    <div className="text-gray-400 italic text-[10px]">Source: {indicatorData.source}</div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-gray-400 mb-1">Propensity Score: {deal.propensity === 'N/A' ? '0' : deal.propensity}</div>
                                )}
                            </div>

                            <div className="w-2/12 px-4 flex flex-col items-center">
                                <div className="text-[11px] text-gray-400 space-y-1 text-left w-full max-w-[140px]">
                                    <div className="flex flex-col group relative cursor-help">
                                        <span className="font-medium text-gray-500">Last Open Date:</span>
                                        <span className={cn(
                                          "text-gray-900 font-medium", 
                                          deal.lastOpen === 'N/A' && "bg-yellow-100 px-1.5 py-0.5 rounded font-bold w-fit"
                                        )}>
                                          {deal.lastOpen}
                                        </span>
                                        {deal.lastOpen === 'N/A' && (
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Needs attention: This deal hasn't been opened recently.
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col group relative cursor-help">
                                        <span className="font-medium text-gray-500">Last Called Date:</span>
                                        <span className={cn(
                                          "text-gray-900 font-medium", 
                                          deal.lastCalled === 'N/A' && "bg-yellow-100 px-1.5 py-0.5 rounded font-bold w-fit"
                                        )}>
                                          {deal.lastCalled}
                                        </span>
                                        {deal.lastCalled === 'N/A' && (
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Needs attention: No recent call recorded.
                                          </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-3/12 px-4 flex flex-col items-end justify-center gap-2">
                                <div className="text-xs text-gray-500 font-medium">Source: <span className="font-bold text-gray-900">{deal.source}</span>{deal.mlsStatus && <span className={cn("font-bold ml-1", deal.mlsStatus === 'Active' && "text-green-600", deal.mlsStatus === 'Pending' && "text-amber-500", deal.mlsStatus === 'Back Up Offer' && "text-blue-600", (deal.mlsStatus === 'Closed' || deal.mlsStatus === 'Sold') && "text-red-600")}> - {deal.mlsStatus}</span>}</div>
                                <StatusPipelineWidget
                                  currentPercent={parseInt(deal.statusPercent) || 0}
                                  currentLabel={deal.status}
                                  onStatusChange={(percent, label) => handleStatusChange(deal.id, label, `${percent}%`)}
                                />
                            </div>

                        </div>
                    </div>
                  ))
                )}

                 {/* Footer Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Showing {filteredDeals.length} of {deals.length} entries</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                            25 / page <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>

            </div>

        </main>
      </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { 
  ChevronDown,
  MoreVertical,
  Target,
  Flame,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Bot,
  Search,
  Filter,
  ArrowUpDown,
  Calendar
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

function MLSHotDealsContent() {
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

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

  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDealIds(sortedDeals.map(d => d.id));
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">MLS Hot Deals</h1>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-search"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" data-testid="button-filter">
              <Filter className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" data-testid="button-sort">
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-700">11/24/2025</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">to</span>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-700">11/29/2025</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">

            {/* Current Task List - Reorganized Layout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">

                {/* Table Header */}
                <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none">
                    <div className="w-[48px] shrink-0 flex flex-col justify-center items-center gap-0.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={sortedDeals.length > 0 && sortedDeals.every(d => selectedDealIds.includes(d.id))}
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

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                      <div className="py-8 text-center text-gray-500">Loading deals...</div>
                    ) : sortedDeals.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">No deals found</div>
                    ) : (
                      sortedDeals.map((deal) => {
                        const propensityArray = Array.isArray(deal.propensity) ? deal.propensity : [deal.propensity];
                        const totalScore = getPropensityScore(deal.propensity);
                        
                        return (
                          <div 
                            key={deal.id} 
                            className={cn(
                              "flex items-center py-4 hover:bg-gray-50/50 transition cursor-pointer group",
                              deal.isHot && "bg-orange-50/30"
                            )}
                          >
                            <div className="w-[48px] shrink-0 flex justify-center items-center">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                checked={selectedDealIds.includes(deal.id)}
                                onChange={(e) => handleSelectDeal(deal.id, e.target.checked)}
                              />
                            </div>
                            <div className="flex-1 flex items-center">
                              <div className="w-5/12 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-800 text-sm">{deal.address}</span>
                                  {deal.isHot && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold rounded shadow-sm">
                                      <Flame className="w-3 h-3" />
                                      HOT
                                    </span>
                                  )}
                                  {deal.type === 'warm' && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[9px] font-bold rounded shadow-sm">
                                      <Target className="w-3 h-3" />
                                      WARM
                                    </span>
                                  )}
                                  {deal.type === 'cold' && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-[9px] font-bold rounded shadow-sm">
                                      COLD
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{deal.specs}</div>
                              </div>
                              
                              <div className="w-2/12 px-4">
                                <div className="font-bold text-gray-800 text-sm">{deal.price}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {propensityArray.map((p: string, idx: number) => (
                                    <span key={idx} className={cn("text-[10px] font-medium", getPropensityColor(p))}>
                                      {p}{idx < propensityArray.length - 1 ? ',' : ''}
                                    </span>
                                  ))}
                                </div>
                                {totalScore > 0 && (
                                  <div className="text-[10px] text-gray-400 mt-0.5">Score: {totalScore}</div>
                                )}
                              </div>
                              
                              <div className="w-2/12 px-4">
                                <div className="text-sm text-gray-700">{deal.lastOpen}</div>
                                <div className="text-xs text-gray-500">{deal.lastCalled}</div>
                              </div>
                              
                              <div className="w-3/12 px-4 flex items-center justify-between">
                                <div className="flex-1">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition">
                                        <span className={cn(
                                          "text-sm font-medium",
                                          deal.statusPercent === "100%" ? "text-green-600" :
                                          deal.statusPercent === "0%" ? "text-gray-400" :
                                          "text-blue-600"
                                        )}>
                                          {deal.statusPercent}
                                        </span>
                                        <span className="text-sm text-gray-700">{deal.status}</span>
                                        <ChevronDown className="w-3 h-3 text-gray-400" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56 bg-white z-50 shadow-xl border-none">
                                      {STATUS_OPTIONS.map((option, idx) => (
                                        <DropdownMenuItem
                                          key={idx}
                                          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
                                          onClick={() => handleStatusChange(deal.id, option.label, option.percent)}
                                        >
                                          <span className={cn(
                                            "text-sm font-medium w-12",
                                            option.percent === "100%" ? "text-green-600" :
                                            option.percent === "0%" ? "text-gray-400" :
                                            "text-blue-600"
                                          )}>
                                            {option.percent}
                                          </span>
                                          <span className="text-sm text-gray-700">{option.label}</span>
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <div className="text-xs text-gray-500 mt-0.5 pl-2">{deal.source}{deal.mlsStatus ? ` - ${deal.mlsStatus}` : ''}</div>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition">
                                  <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                </div>
            </div>
        </main>
      </div>
  );
}

export default function MLSHotDeals() {
  return <MLSHotDealsContent />;
}

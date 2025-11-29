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
  ArrowUp,
  ArrowDown,
  Calendar,
  Plus,
  Globe,
  AlertCircle,
  Bell,
  X,
  Heart
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

function MLSSearchContent() {
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [filtersApplied, setFiltersApplied] = useState(false);
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

  const handleApplyFilters = () => {
    setFiltersApplied(true);
    setShowFilterModal(false);
  };

  const handleOpenFilters = () => {
    setShowFilterModal(true);
  };

  return (
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-gray-50">
        
        {/* Filter Sidebar Overlay */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex">
            <div className="flex-1" onClick={() => setShowFilterModal(false)}></div>
            <div className="bg-white shadow-2xl w-[800px] h-full flex flex-col animate-in slide-in-from-right duration-300">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">MLS Filters</h2>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-sm text-gray-600">My Saved Filters</span>
                </div>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Sidebar Body - Scrollable */}
              <div className="px-6 py-4 flex-1 overflow-y-auto space-y-6">
                
                {/* BASIC FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Basic Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Land</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MLS Number</label>
                      <input type="text" placeholder="Enter MLS number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Number</label>
                      <input type="text" placeholder="Enter street number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                      <input type="text" placeholder="Enter street name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" placeholder="Enter city" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                      <input type="text" placeholder="Enter county" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input type="text" placeholder="Enter ZIP code" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">APN</label>
                      <input type="text" placeholder="Enter APN" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                {/* RANGE FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Range Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="$Min price" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="$Max price" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="From year (YYYY)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="To year (YYYY)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Min sqft" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Max sqft" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PTFV %</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Min PTFV %" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Max PTFV %" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days on Market</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Min DOM" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Max DOM" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cumulative Days on Market</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Min CDOM" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Max CDOM" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Status</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select statuses</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Sold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">View Status</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select view statuses</option>
                        <option>New</option>
                        <option>Viewed</option>
                        <option>Reviewed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Offer Status</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select offer statuses</option>
                        <option>None</option>
                        <option>Offer Sent</option>
                        <option>In Negotiations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select sources</option>
                        <option>MLS</option>
                        <option>Off Market</option>
                        <option>Wholesaler</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PROPERTY TYPE FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Property Type Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Type</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select sales types</option>
                        <option>Standard</option>
                        <option>Short Sale</option>
                        <option>REO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select property types</option>
                        <option>Single Family</option>
                        <option>Condo</option>
                        <option>Multi-Family</option>
                        <option>Land</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FLAG FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Flag Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yellow Star</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select yellow star options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Red Star</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select red star options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Watched Property</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select watched property options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Flagged</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select flagged options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orange Flagged</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select orange flagged options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Infraction</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select infraction options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Flip</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select flip options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PIR Report</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select PIR report options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* USER ASSIGNMENT FILTERS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">User Assignment Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keyword Level</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select keyword levels</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status Change Days</label>
                      <input type="text" placeholder="Enter days" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">In System</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select in system options</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition">
                  Reset
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="px-6 py-2 text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00] rounded-lg transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">MLS Search</h1>
            <button 
              onClick={handleOpenFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00] rounded-lg transition flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="pl-9 pr-4 py-2.5 w-80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-search"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              placeholder="Low PTFV" 
              className="px-3 py-1.5 w-28 border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="text" 
              placeholder="High PTFV" 
              className="px-3 py-1.5 w-28 border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-800 transition">
              Keyword
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-800 transition">
              Assigned AA
              <ChevronDown className="w-4 h-4" />
            </button>
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

                {/* Property Cards */}
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
                            className="flex p-4 hover:bg-gray-50/50 transition cursor-pointer group gap-4"
                          >
                            {/* Property Image with Controls */}
                            <div className="flex shrink-0 gap-1">
                              {/* Left Controls */}
                              <div className="flex flex-col gap-1">
                                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 transition">
                                  <div className="w-4 h-4 border-2 border-gray-400 rounded-sm"></div>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 transition">
                                  <Target className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 transition">
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                              {/* Property Image */}
                              <div className="w-[160px] h-[100px] rounded-lg overflow-hidden bg-gray-200">
                                <img 
                                  src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format`}
                                  alt="Property"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Property Details - Left Section */}
                            <div className="flex-1 flex flex-col min-w-0">
                              {/* Top Row: New, Checkbox, To do, Critical, Reminders */}
                              <div className="flex items-center gap-3 text-sm mb-2">
                                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition">
                                  <Plus className="w-4 h-4" />
                                  <span className="font-medium">New</span>
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                                <span className="text-gray-300">•</span>
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  checked={selectedDealIds.includes(deal.id)}
                                  onChange={(e) => handleSelectDeal(deal.id, e.target.checked)}
                                />
                                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition">
                                  <span>To do:</span>
                                  <span className="text-gray-700">Not set</span>
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">0 Critical</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">0 Reminders</span>
                              </div>
                              
                              {/* Address Row */}
                              {(() => {
                                const saleTypes = ['Standard', 'Short Sale', 'REO'];
                                const saleType = saleTypes[deal.id % 3];
                                return (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800">{deal.address}</span>
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">- {saleType}</span>
                                  </div>
                                );
                              })()}
                              
                              {/* Specs Row */}
                              <div className="text-sm text-gray-500 mb-3">{deal.specs}</div>
                              
                              {/* Keywords/Tags Row */}
                              <div className="flex flex-wrap gap-2">
                                {propensityArray.map((tag: string, idx: number) => {
                                  const tagLower = tag.toLowerCase();
                                  const isOrange = tagLower.includes("trustee") || tagLower.includes("default") || tagLower.includes("tax") || tagLower.includes("death") || tagLower.includes("bankruptcy") || tagLower.includes("motivated");
                                  return (
                                    <span 
                                      key={idx} 
                                      className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium border",
                                        isOrange 
                                          ? "bg-orange-50 text-orange-600 border-orange-200" 
                                          : "bg-gray-50 text-gray-600 border-gray-200"
                                      )}
                                    >
                                      {tag}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Price / Propensity Column */}
                            <div className="w-[160px] shrink-0 flex flex-col">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-lg font-bold text-gray-800">{deal.price}</span>
                                <span className="text-sm text-gray-500">• BM</span>
                              </div>
                              <div className="text-sm text-gray-500 mb-2">Propensity Score: <span className="text-blue-600 font-medium">{totalScore || 'N/A'}</span></div>
                              <div className="flex flex-col gap-0.5">
                                {propensityArray.map((indicator: string, idx: number) => (
                                  <span key={idx} className="text-xs font-medium text-red-600">
                                    {indicator}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {/* Days / DOM Column */}
                            {(() => {
                              const priceChangeAmounts = [40000, 25000, -15000, 50000, -35000, 0, 20000];
                              const priceChangePercents = [6.5, 4.2, -2.8, 8.1, -5.5, 0, 3.2];
                              const priceHistory = [
                                { date: '10/15/25', price: '$1,128,000', event: 'Price Change' },
                                { date: '09/01/25', price: '$1,088,000', event: 'Listed' },
                              ];
                              const idx = deal.id % 7;
                              const amount = priceChangeAmounts[idx];
                              const percent = priceChangePercents[idx];
                              const isDecrease = amount > 0;
                              const addressSlug = deal.address.replace(/[,\s]+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
                              const zillowUrl = `https://www.zillow.com/homes/${addressSlug}`;
                              return (
                                <div className="w-[140px] shrink-0 flex flex-col text-sm">
                                  {amount !== 0 && (
                                    <div className="relative group">
                                      <div className="flex items-center gap-1 mb-1 cursor-pointer">
                                        {isDecrease ? (
                                          <ArrowDown className="w-4 h-4 text-red-600" />
                                        ) : (
                                          <ArrowUp className="w-4 h-4 text-green-600" />
                                        )}
                                        <span className="text-gray-800 font-medium">${Math.abs(amount).toLocaleString()}</span>
                                        <span className="text-gray-500"> - </span>
                                        <span className="text-gray-800 font-medium">{Math.abs(percent)}%</span>
                                      </div>
                                      {/* Hover Tooltip */}
                                      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 w-56 hidden group-hover:block">
                                        <div className="text-xs font-semibold text-gray-700 mb-2">Price History</div>
                                        {priceHistory.map((item, i) => (
                                          <div key={i} className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>{item.date}</span>
                                            <span className="font-medium">{item.price}</span>
                                            <span className="text-gray-400">{item.event}</span>
                                          </div>
                                        ))}
                                        <a 
                                          href={zillowUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:underline mt-2 block"
                                        >
                                          View full history on Zillow →
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-gray-800">109 Days /</div>
                                  <div className="text-gray-500">DOM: 109</div>
                                </div>
                              );
                            })()}
                            
                            {/* ARV Column */}
                            {(() => {
                              const investorSourceCnt = (deal.id * 3) % 9;
                              return (
                                <div className="w-[160px] shrink-0 flex flex-col text-sm">
                                  <div className="text-gray-800">Asking vs ARV: <span className="font-medium">92.16%</span></div>
                                  <div className="text-gray-800">ARV: <span className="font-medium">$1,180,544</span></div>
                                  <div className="text-gray-500">Comp Data: 5S, 0P, 0B, 3A</div>
                                  {investorSourceCnt > 0 && (
                                    <div className="text-gray-500">Investor Source Cnt: <span className="text-blue-600 font-medium">{investorSourceCnt}</span></div>
                                  )}
                                </div>
                              );
                            })()}
                            
                            {/* Source / Status Column */}
                            {(() => {
                              const hasAssignedAA = deal.id % 3 !== 0;
                              return (
                                <div className="w-[160px] shrink-0 flex flex-col">
                                  <div className="mb-1">
                                    <span className="text-sm text-gray-500">Source: </span>
                                    <span className="text-sm font-bold text-gray-800">MLS</span>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition w-fit">
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
                                    <DropdownMenuContent align="end" className="w-56 bg-white z-50 shadow-xl border-none">
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
                                  {hasAssignedAA && (
                                    <div className="text-xs text-gray-500 mt-1">Assigned AA: Michael May</div>
                                  )}
                                </div>
                              );
                            })()}
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

export default function MLSSearch() {
  return <MLSSearchContent />;
}

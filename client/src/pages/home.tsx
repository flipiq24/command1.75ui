import React, { useState } from 'react';
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import ActionPlan, { DealType } from "@/components/ActionPlan";
import Sidebar from "@/components/Sidebar";
import { 
  ChevronDown,
  MoreVertical,
  Target,
  Flame
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const SAMPLE_DEALS: Deal[] = [
  {
    id: 1,
    address: "2011 Windsor Cir, Duarte, CA 91010",
    specs: "Single Family Residential / 3 Br / 0 Ba / 0 Gar / 1981 / 1,654 ft² / 2,396 ft² / Pool:N/A",
    price: "$500,000",
    propensity: ["Notice of Default (NOD)", "Tax Delinquency"], // 6 + 5 = 11
    source: "Off Market",
    type: "hot",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "11/26/25",
    isHot: true
  },
  {
    id: 4,
    address: "2842 Rosarita St, San Bernardino, CA 92407",
    specs: "Single Family Residential / 3 Br / 2 Ba / 1 Gar / 1990 / 1,169 ft² / 7,362 ft² / Pool:N/A",
    price: "$390,000",
    propensity: ["Long Term Owner (20+ Yrs)", "Corporate / Trust Owned"], // 2 + 1 = 3
    source: "Off Market",
    type: "hot",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/21/25",
    isHot: true
  },
  {
    id: 101,
    address: "8832 Elm Street, Rancho Cucamonga, CA 91730",
    specs: "Single Family / 4 Br / 2 Ba / 2 Gar / 1975 / 2,100 ft² / 8,500 ft²",
    price: "$620,000",
    propensity: ["Notice of Trustee Sale (NTS)", "Vacant Property"], // 8 + 2 = 10
    source: "MLS",
    type: "hot",
    statusPercent: "10%",
    status: "Initial Contact Started",
    lastOpen: "11/27/25",
    lastCalled: "11/26/25",
    isHot: true
  },
  {
    id: 102,
    address: "1245 Oak Avenue, Ontario, CA 91764",
    specs: "Single Family / 3 Br / 1 Ba / 1 Gar / 1955 / 1,200 ft² / 6,000 ft²",
    price: "$450,000",
    propensity: ["Affidavit of Death", "High Equity (>50%)"], // 5 + 2 = 7
    source: "Wholesaler",
    type: "warm",
    statusPercent: "20%",
    status: "Continue to Follow",
    lastOpen: "11/25/25",
    lastCalled: "11/20/25"
  },
  {
    id: 5,
    address: "40591 Chantemar Way, Temecula, CA 92591",
    specs: "Single Family Residential / 5 Br / 3 Ba / 1 Gar / 2000 / 2,558 ft² / 6,098 ft² / Pool:N/A",
    price: "$580,000",
    propensity: ["Expired Listing", "High Mortgage / Debt"], // 3 + 2 = 5
    source: "Off Market",
    type: "warm",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/18/25"
  },
  {
    id: 3,
    address: "10573 Larch, Bloomington, CA 92316",
    specs: "Single Family / 2 Br / 1 Ba / 4 Gar / 1940 / 1,951 ft² / 36,600 ft² / Pool:None",
    price: "$975,000",
    propensity: ["Involuntary Liens", "Non-Owner Occupied"], // 3 + 2 = 5
    source: "MLS",
    type: "cold",
    statusPercent: "10%",
    status: "Initial Contact Started",
    lastOpen: "11/25/25",
    lastCalled: "11/24/25"
  },
  {
    id: 103,
    address: "7721 Magnolia Ave, Riverside, CA 92504",
    specs: "Multi-Family / 6 Units / 1980 / 4,500 ft² / 12,000 ft²",
    price: "$1,200,000",
    propensity: ["Owns Multiple Properties", "Free & Clear"], // 1 + 1 = 2
    source: "Off Market",
    type: "cold",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/22/25",
    lastCalled: "11/15/25"
  },
  {
    id: 2,
    address: "420 Robinson, Bakersfield, CA 93305",
    specs: "Single Family / 3 Br / 1 Ba / 0 Gar / 1959 / 1,013 ft² / 4,621 ft² / Pool:None",
    price: "$75,000",
    propensity: "N/A", // 0
    source: "MLS",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "N/A"
  },
  {
    id: 6,
    address: "230 W Knepp Avenue, Fullerton, CA 92832",
    specs: "Other (L) / 8 Br / 4 Ba / 4 Gar / 1958 / 3,752 ft² / 6,534 ft² / Pool:None",
    price: "$1,599,000",
    propensity: ["Transferred in Last 2 Years"], // 0
    source: "MLS",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/27/25",
    lastCalled: "N/A"
  },
  {
    id: 7,
    address: "15620 Ramona Rd, Apple Valley, CA 92307",
    specs: "Single Family Residential / 4 Br / 3 Ba / 2 Gar / 1980 / 2,134 ft² / 43,473 ft² / Pool:N/A",
    price: "$375,000",
    propensity: ["Bankruptcy / Judgment"], // 4
    source: "Off Market",
    type: "hot",
    statusPercent: "100%",
    status: "Acquired",
    lastOpen: "11/24/25",
    lastCalled: "10/27/25 - Tony Fletcher",
    isHot: true
  }
];

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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<DealType | 'goal' | 'completed' | null>(null);
  // Sort deals by propensity score (descending)
  const [deals, setDeals] = useState<Deal[]>(() => {
    return [...SAMPLE_DEALS].sort((a, b) => {
      const scoreA = getPropensityScore(a.propensity);
      const scoreB = getPropensityScore(b.propensity);
      return scoreB - scoreA;
    });
  });

  const handleStatusChange = (id: number, newStatus: string, newPercent: string) => {
    setDeals(deals.map(deal => 
      deal.id === id ? { ...deal, status: newStatus, statusPercent: newPercent } : deal
    ));
  };

  // Filter Logic
  const filteredDeals = deals.filter(deal => {
    if (!activeFilter) return true;
    
    if (activeFilter === 'goal') {
      // Filter for "Offer Terms Sent" or "Contract Submitted" status and LOD being today (11/27/25)
      // Or specifically "1/3" goal logic - which implies we look for deals that contribute to the goal
      return (deal.status === "Offer Terms Sent" || deal.status === "Contract Submitted");
    }

    if (activeFilter === 'completed') {
      // Filter for deals that are considered "completed" follow-ups
      // Based on the tooltip, this tracks progress on Hot, Warm, and Cold deals.
      // Let's assume "completed" means they are Hot/Warm/Cold AND have a status other than "None" or "Initial Contact Started" if we want to be strict,
      // or just that they are Hot/Warm/Cold and have been touched.
      // For this mockup, let's show Hot, Warm, and Cold deals that have a status.
      return (deal.type === 'hot' || deal.type === 'warm' || deal.type === 'cold') && deal.status !== 'None';
    }

    return deal.type === activeFilter;
  });

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Wednesday, November 26</div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, Tony!</h1>
          </div>
          <div className="flex items-center gap-4">
            
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          {/* Action Plan Component */}
          <ActionPlan 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

            {/* Current Task List - Reorganized Layout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
                
                {/* Table Header */}
                <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none">
                    <div className="w-[48px] shrink-0"></div> 
                    <div className="flex-1 flex items-center">
                    
                        <div className="w-5/12 px-4 flex items-center gap-1 group relative cursor-help">
                            <span>Property</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                                Details include Address, Specs, Deal Tag (Hot/Warm/Cold), Next Actions (To-Do), and Notifications.
                            </div>
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
                            
                            <div className="absolute top-8 right-0 w-[400px] bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed max-h-[80vh] overflow-y-auto border border-gray-700">
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

                {/* Deal Rows */}
                {filteredDeals.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No deals found matching the selected filter.
                  </div>
                ) : (
                  filteredDeals.map((deal) => (
                    <div key={deal.id} className="flex border-b border-gray-100 hover:bg-gray-50 transition group py-4">
                        <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                            <div className="bg-gray-100 rounded-lg p-1 flex flex-col items-center gap-2 w-8">
                                <Target className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                                <div className="w-4 h-[1px] bg-gray-300"></div>
                                <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
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
                                      {deal.propensity.map((item, idx) => (
                                        <div key={idx} className="group relative cursor-help leading-none">
                                          <span className={cn("text-[10px] font-normal inline-block", getPropensityColor(item))}>
                                            {item}
                                          </span>
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-[100] text-center">
                                            {item}
                                          </div>
                                        </div>
                                      ))}
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

                            <div className="w-3/12 px-4 flex flex-col items-center justify-center gap-2">
                                <div className="text-xs text-gray-500 font-medium">Source: <span className="font-bold text-gray-900">{deal.source}</span></div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[180px] whitespace-nowrap border border-transparent hover:border-gray-200">
                                        <span className="font-bold text-[#4A90E2]">{deal.statusPercent}</span> 
                                        <span className="truncate">{deal.status}</span>
                                        <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[200px] bg-white z-50">
                                    {STATUS_OPTIONS.map((option) => (
                                      <DropdownMenuItem 
                                        key={option.label}
                                        onClick={() => handleStatusChange(deal.id, option.label, option.percent)}
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
    </div>
  );
}
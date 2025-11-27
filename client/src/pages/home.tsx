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

interface Deal {
  id: number;
  address: string;
  specs: string;
  price: string;
  propensity: string;
  source: string;
  type: 'hot' | 'warm' | 'cold' | 'new';
  status: string;
  statusPercent: string;
  lastOpen: string;
  lastCalled: string;
  isHot?: boolean;
}

const SAMPLE_DEALS: Deal[] = [
  {
    id: 1,
    address: "2011 Windsor Cir, Duarte, CA 91010",
    specs: "Single Family Residential / 3 Br / 0 Ba / 0 Gar / 1981 / 1,654 ft² / 2,396 ft² / Pool:N/A",
    price: "$500,000",
    propensity: "N/A",
    source: "Off Market",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "11/26/25"
  },
  {
    id: 2,
    address: "420 Robinson, Bakersfield, CA 93305",
    specs: "Single Family / 3 Br / 1 Ba / 0 Gar / 1959 / 1,013 ft² / 4,621 ft² / Pool:None",
    price: "$75,000",
    propensity: "N/A",
    source: "MLS",
    type: "new",
    statusPercent: "0%",
    status: "None",
    lastOpen: "11/26/25",
    lastCalled: "N/A"
  },
  {
    id: 3,
    address: "10573 Larch, Bloomington, CA 92316",
    specs: "Single Family / 2 Br / 1 Ba / 4 Gar / 1940 / 1,951 ft² / 36,600 ft² / Pool:None",
    price: "$975,000",
    propensity: "N/A",
    source: "MLS",
    type: "cold",
    statusPercent: "10%",
    status: "Initial Contact Started",
    lastOpen: "11/25/25",
    lastCalled: "11/24/25"
  },
  {
    id: 4,
    address: "2842 Rosarita St, San Bernardino, CA 92407",
    specs: "Single Family Residential / 3 Br / 2 Ba / 1 Gar / 1990 / 1,169 ft² / 7,362 ft² / Pool:N/A",
    price: "$390,000",
    propensity: "N/A",
    source: "Off Market",
    type: "hot",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/21/25",
    isHot: true
  },
  {
    id: 5,
    address: "40591 Chantemar Way, Temecula, CA 92591",
    specs: "Single Family Residential / 5 Br / 3 Ba / 1 Gar / 2000 / 2,558 ft² / 6,098 ft² / Pool:N/A",
    price: "$580,000",
    propensity: "N/A",
    source: "Off Market",
    type: "warm",
    statusPercent: "30%",
    status: "Offer Terms Sent",
    lastOpen: "11/26/25",
    lastCalled: "11/18/25"
  },
  {
    id: 6,
    address: "230 W Knepp Avenue, Fullerton, CA 92832",
    specs: "Other (L) / 8 Br / 4 Ba / 4 Gar / 1958 / 3,752 ft² / 6,534 ft² / Pool:None",
    price: "$1,599,000",
    propensity: "N/A",
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
    propensity: "N/A",
    source: "Off Market",
    type: "hot",
    statusPercent: "100%",
    status: "Acquired",
    lastOpen: "11/24/25",
    lastCalled: "10/27/25 - Tony Fletcher",
    isHot: true
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<DealType | 'goal' | 'completed' | null>(null);

  // Filter Logic
  const filteredDeals = SAMPLE_DEALS.filter(deal => {
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
                            <span>List Price</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                                <span className="font-bold text-[#FF6600]">Propensity Score:</span> Higher score = Higher likelihood to sell.<br/><br/>Also shows current Asking Price and Lead Source.
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
                            <span>Offer Status</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            
                            <div className="absolute top-8 right-0 w-[400px] bg-gray-900 text-white text-xs p-4 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed max-h-[80vh] overflow-y-auto border border-gray-700">
                                <div className="font-bold text-[#FF6600] mb-3 text-sm border-b border-gray-700 pb-2">Offer Status Definitions & Tasks</div>
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
                                <div>
                                    <div className="font-bold text-gray-900 text-base mb-1">{deal.address}</div>
                                    <div className="text-xs text-gray-500">{deal.specs}</div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                    {deal.isHot && (
                                      <div className="bg-red-50 rounded-full px-2 py-0.5 border border-red-100 flex items-center gap-1">
                                          <Flame className="w-3 h-3 text-red-500" />
                                          <span className="text-[10px] font-bold text-red-500 uppercase">Hot</span>
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
                            </div>

                            <div className="w-2/12 px-4 flex flex-col items-center text-center">
                                <div className="font-bold text-gray-900 text-base mb-1">{deal.price}</div>
                                <div className="text-xs text-gray-400 mb-1">Propensity Score: {deal.propensity}</div>
                                <div className="text-xs text-gray-500 font-medium">Source: <span className="font-bold text-gray-900">{deal.source}</span></div>
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

                            <div className="w-3/12 px-4 flex flex-col items-center justify-center">
                                <button className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[180px] whitespace-nowrap">
                                    <span className="font-bold text-slate-600">{deal.statusPercent}</span> 
                                    <span className="truncate">{deal.status}</span>
                                    <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                </button>
                            </div>

                        </div>
                    </div>
                  ))
                )}

                 {/* Footer Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Showing {filteredDeals.length} of {SAMPLE_DEALS.length} entries</div>
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
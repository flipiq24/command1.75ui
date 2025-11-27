import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Phone, MessageSquare, Mail, Mic, 
  Bot, Image, TrendingDown
} from 'lucide-react';
import Sidebar from "@/components/Sidebar";
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

const mockPriceHistory = [
  { date: "11/15/25", price: "$500,000", change: "-6.3%" },
  { date: "10/01/25", price: "$535,000", change: "-5.0%" },
];

export default function DailyOutreach() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    }
  });

  const currentDeal = deals[currentIndex] as Deal | undefined;
  const totalDeals = deals.length || 30;

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalDeals - 1, prev + 1));
  };

  const dom = 94;
  const ptfv = "72%";
  const propensityScore = "7/8";

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Daily Outreach</h2>
            <p className="text-xs text-gray-500">Step-by-step execution mode.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500">Property {currentIndex + 1} of 30</span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                data-testid="button-previous"
              >
                <ChevronLeft className="w-4 h-4"/>
              </button>
              <button 
                onClick={handleNext}
                disabled={currentIndex === totalDeals - 1}
                className="px-4 py-2 bg-[#FF6600] text-white rounded font-bold text-sm flex items-center gap-2 hover:bg-orange-700 disabled:opacity-50"
                data-testid="button-next"
              >
                Next Deal <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            
            <div className="w-[60%] p-8 overflow-y-auto border-r border-gray-200 bg-white">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Active</span>
                    <span className="text-xs text-gray-400">{currentDeal?.source || 'MLS'}</span>
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 leading-tight" data-testid="text-property-address">
                    {currentDeal?.address || '2011 Windsor Cir, Duarte, CA'}
                  </h1>
                  <p className="text-sm text-gray-500">{currentDeal?.specs || 'SFR • 3 Br / 2 Ba / 1,654 ft² / 1981'}</p>
                </div>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition" data-testid="button-view-photos">
                  <Image className="w-4 h-4" />
                  View Photos & Desc
                </button>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-orange-200 pb-2">
                  <Bot className="w-5 h-5 text-[#FF6600]" />
                  <h3 className="text-sm font-bold text-[#FF6600] uppercase tracking-wide">Step 1: FlipIQ Intelligence</h3>
                </div>
                
                <p className="text-sm text-gray-800 leading-7 mb-4">
                  We are chasing this property because it is an <span className="font-bold text-[#FF6600] bg-white px-1 rounded border border-orange-100">Aged Listing ({dom} Days)</span> with a massive <span className="font-bold text-[#FF6600] bg-white px-1 rounded border border-orange-100">{ptfv} Price-to-Value</span> discount. 
                  The owner shows signs of high distress due to a <span className="font-bold text-[#FF6600]">Notice of Default</span> and <span className="font-bold text-[#FF6600]">Tax Delinquency</span>. 
                  This is a prime acquisition target.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-3 rounded border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">List Price</span>
                    <span className="text-xl font-black text-gray-900">{currentDeal?.price || '$500,000'}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Propensity Score</span>
                    <span className="text-xl font-black text-red-600">{propensityScore}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Price History (Last 12 Mo)
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 text-gray-500 font-bold">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-right">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockPriceHistory.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{row.date}</td>
                          <td className="px-4 py-2 font-bold">{row.price}</td>
                          <td className="px-4 py-2 text-right text-red-600 font-bold">{row.change}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="w-[40%] bg-gray-50 flex flex-col border-l border-gray-200 overflow-hidden">
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Verify Agent Data</span>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                  <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sarah Jenkins</h3>
                      <p className="text-xs text-gray-500">Keller Williams Realty</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Investor Deals</span>
                      <div className="text-xl font-black text-[#FF6600]">12</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Relationship</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50" data-testid="select-relationship">
                          <option>Cold</option>
                          <option>Warm</option>
                          <option>Hot</option>
                          <option>Priority</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Rating</label>
                        <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50" data-testid="select-rating">
                          <option>Investor Friendly</option>
                          <option>Cooperative</option>
                          <option>Unresponsive</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Follow Up Status</label>
                      <select className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50" data-testid="select-followup">
                        <option>Contact Made</option>
                        <option>HWC Campaign</option>
                        <option>Not Interested</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Last Address Discussed</label>
                      <input type="text" className="w-full text-xs p-2 border border-gray-200 rounded bg-gray-50" placeholder="123 Main..." data-testid="input-last-address" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-[#FF6600] text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#FF6600]">Execute</span>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-900 leading-5">
                    "Hey <span className="font-bold">Sarah</span>, Tony from FlipIQ. I saw you sourced deals for <span className="font-bold">FairTrade LLC</span>. I'm calling about <span className="font-bold">{currentDeal?.address || '2011 Windsor Cir'}</span> ({dom} days on market). We move fast—is your seller open to a cash offer?"
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition transform active:scale-95" data-testid="button-call">
                    <Phone className="w-5 h-5" /> CALL
                  </button>
                  <button className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200" data-testid="button-text">
                    <MessageSquare className="w-5 h-5"/>
                  </button>
                  <button className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200" data-testid="button-email">
                    <Mail className="w-5 h-5"/>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

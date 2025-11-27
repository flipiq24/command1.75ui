import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import Sidebar from '@/components/Sidebar';
import { 
  ArrowLeft,
  Snowflake,
  ChevronDown,
  RefreshCw,
  Globe,
  Edit,
  MoreVertical,
  MessageSquare
} from 'lucide-react';

export default function PIQ() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('piq');
  const [activeRightTab, setActiveRightTab] = useState('ai-connect');

  const leftTabs = [
    { id: 'piq', label: 'PIQ' },
    { id: 'comps', label: 'Comps' },
    { id: 'investment', label: 'Investment Analysis' },
    { id: 'agent', label: 'Agent' },
    { id: 'offer', label: 'Offer Terms' },
  ];

  const rightTabs = [
    { id: 'ai-connect', label: 'AI Connect' },
    { id: 'notes', label: 'Notes' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'activity', label: 'Activity' },
    { id: 'tax-data', label: 'Tax Data' },
  ];

  const highlightKeywords = (text: string) => {
    const keywords = [
      { word: 'Investor', color: 'bg-yellow-200' },
      { word: 'opportunity', color: 'bg-yellow-200' },
      { word: 'potential', color: 'bg-blue-200' },
      { word: 'repairs', color: 'bg-red-200' },
      { word: 'AS IS', color: 'bg-green-200' },
    ];
    
    let result = text;
    keywords.forEach(({ word, color }) => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, `<span class="${color} px-1 rounded">${word}</span>`);
    });
    return result;
  };

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        
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
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                  <span>10%</span>
                  <span>Initial Contact Started</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                <Snowflake className="w-3 h-3" />
                <span>Cold</span>
                <ChevronDown className="w-3 h-3" />
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
                      onClick={() => setActiveTab(tab.id)}
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

                <div className="flex gap-1">
                  {rightTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightTab(tab.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition",
                        activeRightTab === tab.id
                          ? "bg-gray-100 border-gray-300 text-gray-900"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                      data-testid={`tab-right-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

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

                <div className="w-80 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 relative rounded-lg overflow-hidden">
                      <img 
                        src="https://maps.googleapis.com/maps/api/staticmap?center=10573+Larch+Ave+Bloomington+CA&zoom=17&size=400x200&maptype=satellite&key=demo" 
                        alt="Map view"
                        className="w-full h-40 object-cover bg-gray-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium">
                        10573 Larch Ave
                        <div className="text-[10px] text-gray-500">Recently viewed</div>
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-gray-500 text-xs">
                        Photo 1
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">
                        Photo 2
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center text-gray-500 text-xs">
                        Photo 3
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">
                        Photo 4
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

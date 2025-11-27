import React, { useState } from 'react';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Target,
  HelpCircle,
  Phone,
  MessageSquare,
  Mail,
  Mic,
  Bot,
  Flame
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";

interface Property {
  id: number;
  address: string;
  specs: string;
  price: string;
  ptfv: string;
  dom: number;
  propensityScore: number;
  propensityIndicators: string[];
  status: 'Active' | 'Pending' | 'Backup';
  keywords: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    brokerage: string;
    location: string;
    relationshipStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold' | 'Unassigned';
    investorSourceCount: number;
    lastCommunication: string | null;
    lastAddressDiscussed: string | null;
  };
  whyChasing: string[];
}

type OutreachType = 'priority' | 'followUps' | 'coldCalls' | 'processLeads';

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 1,
    address: "2011 Windsor Cir, Duarte, CA 91010",
    specs: "SFR / 3 Br / 2 Ba / 1,654 ft² / 1981",
    price: "$500,000",
    ptfv: "72%",
    dom: 94,
    propensityScore: 7,
    propensityIndicators: ["Notice of Default (NOD)", "Tax Delinquency"],
    status: "Active",
    keywords: ["as is", "motivated seller", "price reduced"],
    agent: {
      name: "Sarah Jenkins",
      phone: "(909) 555-0123",
      email: "sarah.j@kw.com",
      brokerage: "Keller Williams Realty",
      location: "San Bernardino, CA",
      relationshipStatus: "Hot",
      investorSourceCount: 12,
      lastCommunication: "11/20/25",
      lastAddressDiscussed: "1845 Oak St, Fontana"
    },
    whyChasing: [
      "Aged listing at 94 DOM — seller likely more motivated",
      "PTFV at 72% indicates strong discount potential",
      "NOD + Tax Delinquency = high propensity to sell (Score: 7)",
      "Agent has 12 investor transactions — understands our process",
      "Keywords detected: 'as is', 'motivated seller', 'price reduced'"
    ]
  },
  {
    id: 2,
    address: "8832 Elm Street, Rancho Cucamonga, CA 91730",
    specs: "SFR / 4 Br / 2 Ba / 2,100 ft² / 1975",
    price: "$620,000",
    ptfv: "68%",
    dom: 112,
    propensityScore: 8,
    propensityIndicators: ["Notice of Trustee Sale (NTS)", "Vacant Property"],
    status: "Active",
    keywords: ["vacant", "court ordered", "estate sale"],
    agent: {
      name: "Michael Ross",
      phone: "(909) 555-0888",
      email: "mike.ross@c21.com",
      brokerage: "Century 21 Lois Lauer",
      location: "Redlands, CA",
      relationshipStatus: "Warm",
      investorSourceCount: 8,
      lastCommunication: "11/15/25",
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Highest propensity score (8) — NTS means imminent foreclosure",
      "112 DOM + Vacant = zero holding costs motivation",
      "PTFV at 68% — significant equity capture opportunity",
      "Agent has 8 investor transactions — familiar with cash offers",
      "Keywords: 'vacant', 'court ordered', 'estate sale'"
    ]
  },
  {
    id: 3,
    address: "1245 Oak Avenue, Ontario, CA 91764",
    specs: "SFR / 3 Br / 1 Ba / 1,200 ft² / 1955",
    price: "$450,000",
    ptfv: "75%",
    dom: 78,
    propensityScore: 5,
    propensityIndicators: ["Affidavit of Death", "High Equity (>50%)"],
    status: "Backup",
    keywords: ["probate", "heir", "as is"],
    agent: {
      name: "Jennifer Chen",
      phone: "(626) 555-0456",
      email: "jchen@remax.com",
      brokerage: "RE/MAX Premier",
      location: "Ontario, CA",
      relationshipStatus: "Cold",
      investorSourceCount: 15,
      lastCommunication: null,
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Backup position — primary buyer may fall through",
      "Probate property = motivated heirs wanting quick close",
      "Agent has 15 investor transactions — HIGH VALUE target",
      "Currently Cold relationship — opportunity to build connection",
      "High equity means flexible on price"
    ]
  },
  {
    id: 4,
    address: "40591 Chantemar Way, Temecula, CA 92591",
    specs: "SFR / 5 Br / 3 Ba / 2,558 ft² / 2000",
    price: "$580,000",
    ptfv: "71%",
    dom: 86,
    propensityScore: 4,
    propensityIndicators: ["Expired Listing", "High Mortgage / Debt"],
    status: "Active",
    keywords: ["price reduced", "bring all offers"],
    agent: {
      name: "David Martinez",
      phone: "(951) 555-0777",
      email: "dmartinez@exp.com",
      brokerage: "eXp Realty",
      location: "Temecula, CA",
      relationshipStatus: "Unassigned",
      investorSourceCount: 22,
      lastCommunication: null,
      lastAddressDiscussed: null
    },
    whyChasing: [
      "Unassigned agent with 22 investor transactions — WHALE ALERT",
      "86 DOM + 'bring all offers' = seller exhausted",
      "High mortgage debt means motivated to avoid foreclosure",
      "PTFV at 71% — solid spread potential",
      "First contact = opportunity to build new relationship"
    ]
  }
];

const getPropensityColor = (indicator: string) => {
  const t = indicator.toLowerCase();
  if (t.includes("trustee") || t.includes("default") || t.includes("tax") || t.includes("death") || t.includes("bankruptcy")) return "text-red-600 bg-red-50";
  if (t.includes("lien") || t.includes("expired") || t.includes("vacant") || t.includes("debt") || t.includes("equity") || t.includes("owner") || t.includes("years")) return "text-green-600 bg-green-50";
  if (t.includes("trust") || t.includes("corporate") || t.includes("multiple") || t.includes("adjustable") || t.includes("free") || t.includes("transferred")) return "text-blue-600 bg-blue-50";
  return "text-gray-600 bg-gray-50";
};

const getRelationshipColor = (status: string) => {
  switch (status) {
    case 'Priority': return 'bg-orange-500 text-white';
    case 'Hot': return 'bg-red-500 text-white';
    case 'Warm': return 'bg-yellow-500 text-white';
    case 'Cold': return 'bg-blue-500 text-white';
    case 'Unassigned': return 'bg-gray-400 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

export default function DailyOutreach() {
  const [activeSection, setActiveSection] = useState<OutreachType | null>(null);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);

  const currentProperty = SAMPLE_PROPERTIES[currentPropertyIndex];
  
  const handleNextProperty = () => {
    if (currentPropertyIndex < SAMPLE_PROPERTIES.length - 1) {
      setCurrentPropertyIndex(prev => prev + 1);
    }
  };
  
  const handlePrevProperty = () => {
    if (currentPropertyIndex > 0) {
      setCurrentPropertyIndex(prev => prev - 1);
    }
  };

  const handleSelectProperty = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPropertyIds(prev => [...prev, id]);
    } else {
      setSelectedPropertyIds(prev => prev.filter(propId => propId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPropertyIds(SAMPLE_PROPERTIES.map(p => p.id));
    } else {
      setSelectedPropertyIds([]);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Wednesday, November 26</div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Daily Outreach</h1>
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
          
          {/* Action Buttons Row */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => setActiveSection('priority')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-sm font-semibold transition-all border-2",
                  activeSection === 'priority' 
                    ? "bg-red-50 border-red-500 text-red-600" 
                    : "bg-white border-red-400 text-red-500 hover:bg-red-50"
                )}
                data-testid="button-call-priority"
              >
                Call Priority
              </button>
              
              <button 
                onClick={() => setActiveSection('followUps')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-sm font-semibold transition-all border-2",
                  activeSection === 'followUps' 
                    ? "bg-yellow-50 border-yellow-500 text-yellow-600" 
                    : "bg-white border-yellow-400 text-yellow-500 hover:bg-yellow-50"
                )}
                data-testid="button-start-follow-ups"
              >
                Start Follow Ups
              </button>
              
              <button 
                onClick={() => setActiveSection('coldCalls')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-sm font-semibold transition-all border-2",
                  activeSection === 'coldCalls' 
                    ? "bg-teal-50 border-teal-500 text-teal-600" 
                    : "bg-white border-teal-400 text-teal-500 hover:bg-teal-50"
                )}
                data-testid="button-start-cold-calls"
              >
                Start Cold Calls
              </button>
              
              <button 
                onClick={() => setActiveSection('processLeads')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-sm font-semibold transition-all border-2",
                  activeSection === 'processLeads' 
                    ? "bg-green-50 border-green-500 text-green-600" 
                    : "bg-white border-green-400 text-green-500 hover:bg-green-50"
                )}
                data-testid="button-process-leads"
              >
                Process Leads
              </button>
            </div>
          </div>

          {/* Property List Table - Similar to Deal Review */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
            
            {/* Table Header */}
            <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none">
              <div className="w-[48px] shrink-0 flex flex-col justify-center items-center gap-0.5">
                <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">All</span>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={SAMPLE_PROPERTIES.length > 0 && SAMPLE_PROPERTIES.every(p => selectedPropertyIds.includes(p.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  data-testid="checkbox-select-all"
                />
              </div> 
              <div className="flex-1 flex items-center">
                <div className="w-4/12 px-4 flex items-center gap-2">
                  <span>Property / Agent</span>
                </div>
                <div className="w-2/12 px-4 flex items-center gap-1">
                  <span>Price / PTFV</span>
                </div>
                <div className="w-2/12 px-4 flex items-center gap-1">
                  <span>DOM / Status</span>
                </div>
                <div className="w-2/12 px-4 flex items-center gap-1">
                  <span>Propensity</span>
                </div>
                <div className="w-2/12 px-4 flex items-center gap-1">
                  <span>Actions</span>
                </div>
              </div>
            </div>

            {/* Property Rows */}
            {SAMPLE_PROPERTIES.map((property) => (
              <div 
                key={property.id} 
                className={cn(
                  "flex border-b border-gray-100 hover:bg-gray-50 transition group py-4",
                  selectedPropertyIds.includes(property.id) && "bg-blue-50/50 hover:bg-blue-50"
                )}
                data-testid={`row-property-${property.id}`}
              >
                <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedPropertyIds.includes(property.id)}
                    onChange={(e) => handleSelectProperty(property.id, e.target.checked)}
                    data-testid={`checkbox-property-${property.id}`}
                  />
                  <div className="bg-gray-100 rounded-lg p-1 flex flex-col items-center gap-2 w-8">
                    <Target className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                    <div className="w-4 h-[1px] bg-gray-300"></div>
                    <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row">
                  
                  {/* Property & Agent Info */}
                  <div className="w-4/12 px-4 flex flex-col justify-start gap-2">
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        getRelationshipColor(property.agent.relationshipStatus)
                      )}>
                        {property.agent.relationshipStatus}
                      </span>
                    </div>
                    
                    <div>
                      <div className="font-bold text-gray-900 text-base mb-1" data-testid={`text-address-${property.id}`}>{property.address}</div>
                      <div className="text-xs text-gray-500 mb-2">{property.specs}</div>
                      <div className="bg-gray-50 rounded-lg p-2 mt-2">
                        <div className="text-xs font-semibold text-gray-700">{property.agent.name}</div>
                        <div className="text-[10px] text-gray-500">{property.agent.brokerage}</div>
                        <div className="text-[10px] text-gray-400">{property.agent.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Price / PTFV */}
                  <div className="w-2/12 px-4 flex flex-col items-center text-center">
                    <div className="font-bold text-gray-900 text-base mb-1">{property.price}</div>
                    <div className="text-xs text-gray-500">PTFV: <span className="font-semibold text-green-600">{property.ptfv}</span></div>
                  </div>

                  {/* DOM / Status */}
                  <div className="w-2/12 px-4 flex flex-col items-center">
                    <div className="text-sm font-bold text-gray-900">{property.dom} DOM</div>
                    <div className={cn(
                      "text-xs px-2 py-0.5 rounded mt-1",
                      property.status === 'Active' ? 'bg-green-100 text-green-700' :
                      property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {property.status}
                    </div>
                  </div>

                  {/* Propensity */}
                  <div className="w-2/12 px-4 flex flex-col items-center">
                    <div className="text-sm font-bold text-gray-900 mb-1">Score: {property.propensityScore}</div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {property.propensityIndicators.map((indicator, idx) => (
                        <span 
                          key={idx} 
                          className={cn("text-[9px] px-1.5 py-0.5 rounded", getPropensityColor(indicator))}
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-2/12 px-4 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <button className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition" data-testid={`button-call-${property.id}`}>
                        <Phone className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition" data-testid={`button-text-${property.id}`}>
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition" data-testid={`button-email-${property.id}`}>
                        <Mail className="w-4 h-4 text-purple-600" />
                      </button>
                      <button className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition" data-testid={`button-voicemail-${property.id}`}>
                        <Mic className="w-4 h-4 text-orange-600" />
                      </button>
                    </div>
                    <button className="text-[10px] text-gray-500 hover:text-gray-700 underline" data-testid={`button-why-chasing-${property.id}`}>
                      Why Chasing?
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}

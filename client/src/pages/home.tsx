import React from 'react';
import logoUrl from '@assets/flipiQlogo_1764227557148.JPG';
import { 
  LayoutDashboard, 
  ListTodo, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  Users, 
  ChevronDown,
  Search,
  Plus,
  Bell,
  Home as HomeIcon,
  Briefcase,
  Database,
  Folder,
  FileText,
  Bug,
  Zap,
  ChevronLeft,
  LogOut,
  CalendarCheck,
  BarChart2,
  MoreVertical
} from 'lucide-react';
import { cn } from "@/lib/utils";

const NavItem = ({ icon: Icon, label, active, className }: { icon: any, label: string, active?: boolean, className?: string }) => (
  <a 
    href="#" 
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
      active 
        ? "bg-gray-100 text-gray-900" 
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      className
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-gray-900" : "text-gray-500")} />
    <span className="truncate">{label}</span>
  </a>
);

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shrink-0 z-20">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex justify-center">
             <img src={logoUrl} alt="FlipIQ" className="w-40 object-contain" />
          </div>

          {/* Scrollable Nav Area */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
            
            {/* Today's Plan Section */}
            <div>
              <div className="px-2 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Today's Plan
              </div>
              <div className="space-y-1">
                  <a href="#" className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200 transition">
                      <span className="flex items-center gap-3">Deal Review</span>
                      <span className="bg-white text-gray-700 py-0.5 px-2 rounded border border-gray-300 text-xs font-bold shadow-sm">5 / 56</span>
                  </a>

                  <a href="#" className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
                      <span className="flex items-center gap-3">Daily Outreach</span>
                      <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded border border-gray-200 text-xs font-bold">3 / 30</span>
                  </a>
              </div>
            </div>

            {/* Find Leads Section */}
            <div>
              <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Find Leads
              </div>
              <div className="space-y-1">
                  <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                      <div className="text-gray-500"><Zap className="w-5 h-5" /></div>
                      MLS Hot Deals
                  </a>

                  <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                       <div className="text-gray-500"><Search className="w-5 h-5" /></div>
                      MLS Search
                  </a>

                  <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                       <div className="text-gray-500"><Users className="w-5 h-5" /></div>
                      Agent Search
                  </a>

                  <a href="#" className="group relative flex items-center gap-2 pl-8 pr-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition">
                      <span className="text-gray-400">└──</span> Campaigns
                  </a>
              </div>
            </div>

            {/* Tools Section */}
            <div>
                <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tools
                </div>
                <div className="space-y-1">
                    <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <BarChart2 className="w-4 h-4 text-gray-500" />
                        My Stats
                    </a>
                    
                    <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-500" />
                        DisoPro
                    </a>

                    <a href="#" className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        Pro Dashboard
                    </a>
                </div>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-3 mt-auto border-t border-gray-100">
             <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors mb-4">
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse sidebar</span>
             </button>

             <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">Tony Fletcher</div>
                  <div className="text-xs text-gray-500 truncate">tonyf@fairclose.net</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Wednesday, November 26</div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, Tony!</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">TF</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Calls Today</span>
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">4</span>
                <span className="text-xs text-red-500 font-medium">↓ Low Activity</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Texts</span>
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">11</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm ring-1 ring-green-100 bg-green-50/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-700 uppercase">Offers Made</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">7</span>
                <span className="text-xs text-green-600 font-medium">↑ On Track</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Relationships</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
            </div>
          </div> */}

          {/* Action Plan (Gamified) */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nov 26, 2025 Today's Action Plan!</h2>
            
            <div className="grid grid-cols-4 gap-6 text-center">
                
                {/* Hot Deals */}
                <div className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 flex items-center justify-center mb-2 bg-white group-hover:bg-orange-50 transition">
                        <span className="text-xl font-bold text-gray-900">0<span className="text-sm text-gray-400">/1</span></span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">Hot Deals</div>
                    <div className="text-xs text-gray-500">1 Pending Action</div>
                </div>

                {/* Warm Deals */}
                <div className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center mb-2 bg-white">
                        <span className="text-xl font-bold text-gray-900">0<span className="text-sm text-gray-400">/6</span></span>
                    </div>
                    <div className="text-sm font-bold text-gray-500">Warm Deals</div>
                </div>

                {/* Cold Deals */}
                 <div className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center mb-2 bg-white">
                        <span className="text-xl font-bold text-gray-900">0<span className="text-sm text-gray-400">/4</span></span>
                    </div>
                    <div className="text-sm font-bold text-gray-500">Cold Deals</div>
                </div>

                {/* New Deals */}
                <div className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-r-gray-600 flex items-center justify-center mb-2 bg-white">
                        <span className="text-xl font-bold text-gray-900">56<span className="text-sm text-gray-400">/60</span></span>
                    </div>
                    <div className="text-sm font-bold text-gray-500">New Deals</div>
                </div>
            </div>

            {/* Current Task List - Reorganized Layout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                
                {/* Table Header */}
                <div className="flex py-3 px-2 bg-white border-b border-gray-200">
                    <div className="w-12 shrink-0"></div> 
                    <div className="w-1/3 px-4">
                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Property</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">Type / Br / Ba / SqFt / Yr</div>
                    </div>
                    <div className="w-1/6 px-4">
                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">List Price</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">Propensity Score</div>
                    </div>
                    <div className="w-1/6 px-4">
                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Market Info</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">DOM / Created</div>
                    </div>
                    <div className="w-1/6 px-4">
                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Evaluation</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">Asking vs ARV / ARV</div>
                    </div>
                    <div className="w-1/6 px-4 text-right">
                        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Offer Status</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">Next Action / Dates</div>
                    </div>
                </div>

                {/* Deal Row 1 */}
                <div className="flex border-b border-gray-100 hover:bg-gray-50 transition group">
                    <div className="w-12 shrink-0 flex flex-col items-center pt-4 gap-3 border-r border-gray-50 bg-gray-50/30">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" title="Mark as Done" />
                        <Zap className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                        <div className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-pointer">•••</div>
                    </div>

                    <div className="flex-1 flex py-4">
                        
                        <div className="w-1/3 px-4 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase mr-2">In Negotiations</span>
                            </div>
                            <div className="font-bold text-gray-900 text-base">2011 Windsor Cir</div>
                            <div className="text-sm text-gray-500">Duarte, CA 91010</div>
                            <div className="text-xs text-gray-400 mt-1">SFR • 3bd / 0ba • 1,654 sqft • 1981</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-gray-900 text-lg">$500,000</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-gray-700 text-sm">7 Days</div>
                            <div className="text-[10px] text-gray-400 mt-1">Created: 11/26/25</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-gray-900 text-sm">0.00% Spread</div>
                            <div className="text-xs text-gray-500 mt-1">ARV: $0</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center items-end text-right">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm mb-2 transition cursor-pointer">
                                Call Agent
                            </button>
                            <div className="text-[10px] text-gray-400">
                                LOD: 11/26/25<br/>
                                LCD: 11/26/25
                            </div>
                        </div>

                    </div>
                </div>

                {/* Deal Row 2 */}
                <div className="flex border-b border-gray-100 hover:bg-gray-50 transition group">
                    <div className="w-12 shrink-0 flex flex-col items-center pt-4 gap-3 border-r border-gray-50 bg-gray-50/30">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <Zap className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
                        <div className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-pointer">•••</div>
                    </div>

                    <div className="flex-1 flex py-4">
                        
                        <div className="w-1/3 px-4 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase mr-2">New</span>
                            </div>
                            <div className="font-bold text-gray-900 text-base">420 Robinson</div>
                            <div className="text-sm text-gray-500">Bakersfield, CA 93305</div>
                            <div className="text-xs text-gray-400 mt-1">SFR • 3bd / 1ba • 1,013 sqft • 1959</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-gray-900 text-lg">$75,000</div>
                            <div className="text-[10px] text-green-600 font-bold mt-1">Active</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-gray-700 text-sm">3 Days</div>
                            <div className="text-[10px] text-gray-400 mt-1">Created: 11/24/25</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center">
                            <div className="font-bold text-green-700 text-sm">33.05% Spread</div>
                            <div className="text-xs text-gray-500 mt-1">ARV: $226,931</div>
                        </div>

                        <div className="w-1/6 px-4 flex flex-col justify-center items-end text-right">
                            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold py-1.5 px-3 rounded shadow-sm mb-2 transition cursor-pointer">
                                Analyze
                            </button>
                            <div className="text-[10px] text-gray-400">
                                LOD: 11/26/25<br/>
                                LCD: N/A
                            </div>
                        </div>

                    </div>
                </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
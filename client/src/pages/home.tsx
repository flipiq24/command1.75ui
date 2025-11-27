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
  MoreVertical,
  Target,
  HelpCircle,
  Flame
} from 'lucide-react';
import { cn } from "@/lib/utils";
import ActionPlan from "@/components/ActionPlan";

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
                  <a href="#" title="Deals in your pipeline that require action today." className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200 transition">
                      <span className="flex items-center gap-3">Deal Review</span>
                      <span className="bg-white text-gray-700 py-0.5 px-2 rounded border border-gray-300 text-xs font-bold shadow-sm">5 / 56</span>
                  </a>

                  <a href="#" title="Target agent calls to be made today designed to build relationships." className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
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
                  <a href="#" title="Latest MLS deals based on propensity to sell, Key words and percentage off ARV." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                      <div className="text-gray-500"><Zap className="w-5 h-5" /></div>
                      MLS Hot Deals
                  </a>

                  <a href="#" title="Use standard MLS filters to find any deal on the MLS." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                       <div className="text-gray-500"><Search className="w-5 h-5" /></div>
                      MLS Search
                  </a>

                  <a href="#" title="Find investor friendly agents based on how they transact." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                       <div className="text-gray-500"><Users className="w-5 h-5" /></div>
                      Agent Search
                  </a>

                  <a href="#" title="My campaigns sent to my agent target list." className="group relative flex items-center gap-2 pl-8 pr-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition">
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
                    <a href="#" title="Text, call, email and offer tracking." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <BarChart2 className="w-4 h-4 text-gray-500" />
                        My Stats
                    </a>
                    
                    <a href="#" title="Easily market and wholesale your deals to active buyers." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-500" />
                        DispoPro
                    </a>

                    <a href="#" title="Full detailed dashboard for Pro users." className="group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
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

          {/* Action Plan Component */}
          <ActionPlan />

            {/* Current Task List - Reorganized Layout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                
                {/* Table Header */}
                <div className="flex py-4 px-2 bg-white border-b border-gray-200 items-center">
                    <div className="w-12 shrink-0 flex justify-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </div> 
                    <div className="flex-1 flex items-center">
                        <div className="w-[40%] px-4">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Property</div>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 font-normal truncate">Type / Br / Ba / Garage / Built / Ft² / Lot / Pool</div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">List Price</div>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 font-normal whitespace-nowrap">Propensity to sale score</div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Last Open / Last Called</div>
                            </div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Offer Status</div>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deal Row 1 */}
                <div className="flex border-b border-gray-100 hover:bg-gray-50 transition group py-4">
                    <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <div className="bg-gray-100 rounded-lg p-1 flex flex-col items-center gap-2 w-8">
                            <Target className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                            <div className="w-4 h-[1px] bg-gray-300"></div>
                            <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row">
                        
                        <div className="w-[40%] px-4 flex flex-col justify-start gap-2">
                            <div>
                                <div className="font-bold text-gray-900 text-base mb-1">2842 Rosarita St, San Bernardino, CA 92407</div>
                                <div className="text-xs text-gray-500">3 Br / 2 Ba / 1 Gar / 1990 / 1,169 ft² / 7,362 ft² / Pool:N/A</div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <div className="bg-red-50 rounded-full px-2 py-0.5 border border-red-100 flex items-center gap-1">
                                    <Flame className="w-3 h-3 text-red-500" />
                                    <span className="text-[10px] font-bold text-red-500 uppercase">Hot</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                <div className="relative">
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap">
                                        To do: Not set <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap">• 0 Critical • 0 Reminders</div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center text-center">
                            <div className="font-bold text-gray-900 text-base mb-1">$390,000</div>
                            <div className="text-xs text-gray-400 mb-1">Propensity Score: N/A</div>
                            <div className="text-xs text-gray-500 font-medium">Source: <span className="font-bold text-gray-900">Off Market</span></div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="text-[11px] text-gray-400 space-y-1 text-left w-full max-w-[140px]">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-500">Last Open Date:</span>
                                    <span className="text-gray-800">11/26/25</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-500">Last Called Date:</span>
                                    <span className="text-gray-800">11/21/25</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center justify-start">
                            <button className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[160px]">
                                <span className="font-bold">30%</span> 
                                <span>Offer Terms Sent</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>

                    </div>
                </div>

                 {/* Footer Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Showing 1 to 1 of 1 entries</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                            5 / page <ChevronDown className="w-3 h-3" />
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
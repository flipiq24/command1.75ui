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
  BarChart2
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
            <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-lg font-bold text-gray-900">Today's Missions</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Complete these 4 categories to win the day</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                
                {/* Hot Deals */}
                <button className="bg-white p-4 rounded-xl border-2 border-orange-500 shadow-sm hover:shadow-md transition text-left relative overflow-hidden group cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-orange-600 uppercase">Hot Deals</span>
                        <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">0 <span className="text-sm text-gray-400 font-medium">/ 1 Done</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium">1 Action Required</div>
                </button>

                {/* Warm Deals */}
                <button className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition text-left cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Warm Deals</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">0 <span className="text-sm text-gray-400 font-medium">/ 6 Done</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium">6 Actions Required</div>
                </button>

                {/* Cold Deals */}
                <button className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-gray-400 transition text-left cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Cold Deals</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">0 <span className="text-sm text-gray-400 font-medium">/ 4 Done</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium">4 Actions Required</div>
                </button>

                {/* New Deals */}
                <button className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-green-400 transition text-left cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">New Deals</span>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">56 <span class="text-sm text-gray-400 font-medium">/ 60 Done</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '93%'}}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-green-600 font-bold">Only 4 Left!</div>
                </button>
            </div>

            {/* Current Task List - Replacing the old table header area */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Current Task List</h3>
                    <span className="text-xs font-medium text-gray-500">Sorted by Priority</span>
                </div>

                {/* Task Item 1 */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:bg-gray-50 transition cursor-pointer">
                    
                    <div className="shrink-0">
                        <button className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition group">
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-gray-900">2011 Windsor Cir</h4>
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-yellow-200">In Negotiations</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">Duarte, CA 91010 <span className="text-gray-300 mx-2">|</span> <span className="font-bold text-gray-900">$500,000</span></div>
                        
                        <div className="flex gap-4 text-xs text-gray-400">
                            <span><strong className="text-gray-500">LOD:</strong> 11/26/25</span>
                            <span><strong className="text-gray-500">LCD:</strong> 11/26/25</span>
                        </div>
                    </div>

                    <div className="shrink-0 text-right flex flex-col items-end gap-2">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Action Required</div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm flex items-center gap-2 transition transform hover:scale-105 cursor-pointer">
                            <Phone className="w-4 h-4" />
                            Call Agent
                        </button>
                    </div>
                </div>

                {/* Task Item 2 (Disabled/Future) */}
                <div className="p-6 flex flex-col md:flex-row gap-6 items-center opacity-50">
                     <div className="shrink-0">
                        <button className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center cursor-not-allowed">
                            <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    </div>
                    <div className="shrink-0">
                        <span className="text-xs text-gray-400 italic">Complete top task first</span>
                    </div>
                </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
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
  Flame,
  Mail,
  Clock
} from 'lucide-react';
import { cn } from "@/lib/utils";
import OutreachActionPlan from "@/components/OutreachActionPlan";
import { Link, useLocation } from "wouter";

export default function DailyOutreach() {
  const [location] = useLocation();

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
                  <Link href="/" className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition animate-orange-glow border border-[#FF6600]/30">
                      <span className="flex items-center gap-3">Deal Review</span>
                      <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded border border-gray-200 text-xs font-bold shadow-sm">5 / 56</span>
                  </Link>

                  <Link href="/daily-outreach" className="group relative flex items-center justify-between px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200 transition">
                      <span className="flex items-center gap-3">Daily Outreach</span>
                      <span className="bg-white text-gray-700 py-0.5 px-2 rounded border border-gray-300 text-xs font-bold">3 / 30</span>
                  </Link>
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
            <h1 className="text-xl font-bold text-gray-900">Daily Outreach</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">TF</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          {/* Action Plan Component */}
          <OutreachActionPlan />

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
                                <div className="text-xs text-gray-600 font-bold">Agent / Contact</div>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 font-normal truncate">Brokerage / Location / Type</div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Contact Info</div>
                            </div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Last Interaction</div>
                            </div>
                        </div>
                        <div className="w-[20%] px-4 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-xs text-gray-600 font-bold">Outreach Status</div>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deal Row 1 - Sarah Jenkins */}
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
                                <div className="font-bold text-gray-900 text-base mb-1">Sarah Jenkins</div>
                                <div className="text-xs text-gray-500">Keller Williams Realty • San Bernardino, CA</div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <div className="bg-orange-50 rounded-full px-2 py-0.5 border border-orange-100 flex items-center gap-1">
                                    <Target className="w-3 h-3 text-orange-500" />
                                    <span className="text-[10px] font-bold text-orange-500 uppercase">Priority</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <div className="relative">
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap">
                                        Task: Call today <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center text-center justify-center">
                            <div className="font-bold text-gray-900 text-sm mb-1">(909) 555-0123</div>
                            <div className="text-xs text-blue-600 hover:underline cursor-pointer">sarah.j@kw.com</div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center justify-center">
                            <div className="text-[11px] text-gray-400 space-y-1 text-center w-full">
                                <div className="flex flex-col items-center">
                                    <span className="font-medium text-gray-500">Last Spoke:</span>
                                    <span className="text-gray-800">11/20/25</span>
                                </div>
                                <div className="text-xs text-gray-400">5 days ago</div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center justify-center">
                            <button className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[180px] whitespace-nowrap">
                                <Phone className="w-3 h-3" />
                                <span>Call Agent</span>
                                <ChevronDown className="w-3 h-3 flex-shrink-0" />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Deal Row 2 - Michael Ross */}
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
                                <div className="font-bold text-gray-900 text-base mb-1">Michael Ross</div>
                                <div className="text-xs text-gray-500">Century 21 Lois Lauer • Redlands, CA</div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <div className="bg-blue-50 rounded-full px-2 py-0.5 border border-blue-100 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-500 uppercase">Follow Up</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <div className="relative">
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 px-2 rounded flex items-center gap-1 whitespace-nowrap">
                                        Task: Check email <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center text-center justify-center">
                            <div className="font-bold text-gray-900 text-sm mb-1">(909) 555-0888</div>
                            <div className="text-xs text-blue-600 hover:underline cursor-pointer">mike.ross@c21.com</div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center justify-center">
                            <div className="text-[11px] text-gray-400 space-y-1 text-center w-full">
                                <div className="flex flex-col items-center">
                                    <span className="font-medium text-gray-500">Left Voicemail:</span>
                                    <span className="text-gray-800">11/24/25</span>
                                </div>
                                <div className="text-xs text-gray-400">2 days ago</div>
                            </div>
                        </div>

                        <div className="w-[20%] px-4 flex flex-col items-center justify-center">
                            <button className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-md transition-colors w-full justify-between max-w-[180px] whitespace-nowrap">
                                <Mail className="w-3 h-3" />
                                <span>Send Email</span>
                                <ChevronDown className="w-3 h-3 flex-shrink-0" />
                            </button>
                        </div>

                    </div>
                </div>

                 {/* Footer Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Showing 1 to 2 of 2 entries</div>
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
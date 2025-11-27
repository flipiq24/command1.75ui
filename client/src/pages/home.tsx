import React from 'react';
import logoUrl from '@assets/flipiQlogo_1764224673557.JPG';
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
          <div className="p-6 flex items-center gap-2">
             <Zap className="w-8 h-8 text-gray-900 fill-current" />
             <span className="text-2xl font-bold text-gray-900 tracking-tight">FlipIQ</span>
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
                <h2 className="text-lg font-bold text-gray-900">Today's Action Plan</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Daily Goals</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Deal Review Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-400 transition cursor-pointer">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Deal Review</h3>
                            <p className="text-xs text-gray-500">New leads vs. Reviewed</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">5</span>
                            <span className="text-sm text-gray-400">/ 56</span>
                        </div>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '9%'}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 uppercase font-semibold">
                        <span>5 Completed</span>
                        <span>56 Total Deals</span>
                    </div>
                </div>

                {/* Daily Outreach Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-green-400 transition cursor-pointer">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Daily Outreach</h3>
                            <p className="text-xs text-gray-500">Calls & Agent Follow-ups</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">3</span>
                            <span className="text-sm text-gray-400">/ 30</span>
                        </div>
                    </div>

                     <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{width: '10%'}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 uppercase font-semibold">
                        <span>3 Calls Made</span>
                        <span>30 To Make</span>
                    </div>
                </div>

            </div>
          </div>

          {/* Detailed Deals Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50 text-gray-500 text-[11px] uppercase font-bold tracking-wider border-b-2 border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-1/4">Property<br/><span className="font-normal text-[10px] normal-case">Type / Br / Ba / Garage / Built / Ft² / Lot</span></th>
                            <th className="px-4 py-3 w-[15%]">List Price<br/><span className="font-normal text-[10px] normal-case">Propensity Score</span></th>
                            <th className="px-4 py-3 w-[15%]">Market Info<br/><span className="font-normal text-[10px] normal-case">Change / DOM / Created</span></th>
                            <th className="px-4 py-3 w-1/5">Evaluation Metrics<br/><span className="font-normal text-[10px] normal-case">List to ARV / Comp Data</span></th>
                            <th className="px-4 py-3 w-[15%]">Offer Status<br/><span className="font-normal text-[10px] normal-case">Source / LOD / LCD</span></th>
                            <th className="px-4 py-3 w-[10%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">

                        {/* Row 1 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase">New</span>
                                    <span className="text-[10px] text-gray-400">To do: Not Set</span>
                                </div>
                                <div className="font-bold text-gray-900 text-sm">2011 Windsor Cir</div>
                                <div className="text-xs text-gray-500 mb-2">Duarte, CA 91010</div>
                                <div className="text-[11px] text-gray-500 leading-relaxed">
                                    SFR / 3 Br / 0 Ba / 0 Gar<br/>
                                    1981 / 1,654 ft² / 2,396 ft²
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-gray-900 text-base">$500,000</div>
                                <div className="text-[11px] text-gray-400 mt-1">Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-700">2 Days</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">DOM:</span>0 / <span className="text-gray-400 mr-1">CDOM:</span>0<br/>
                                    <span className="text-gray-400 mr-1">Created:</span>11/26/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-100">0.00% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $0</div>
                                <div className="text-[11px] text-gray-400 mt-1">Comp Data: 0</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-900">Off Market</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">Status:</span>0% None<br/>
                                    <span className="text-gray-400 mr-1">LOD:</span>11/26/25<br/>
                                    <span className="text-gray-400 mr-1">LCD:</span>11/26/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top text-right">
                                 <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase">New</span>
                                </div>
                                <div className="font-bold text-gray-900 text-sm">420 Robinson</div>
                                <div className="text-xs text-gray-500 mb-2">Bakersfield, CA 93305</div>
                                <div className="text-[11px] text-gray-500 leading-relaxed">
                                    SFR / 3 Br / 1 Ba / 0 Gar<br/>
                                    1959 / 1,013 ft² / 4,621 ft²
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-gray-900 text-base">$75,000</div>
                                <div className="text-[11px] text-gray-400 mt-1">Score: N/A</div>
                                <div className="text-[10px] text-green-600 mt-0.5 font-medium">Active</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-700">3 Days</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">DOM:</span>3 / <span className="text-gray-400 mr-1">CDOM:</span>3<br/>
                                    <span className="text-gray-400 mr-1">Created:</span>11/24/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-100">33.05% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $226,931</div>
                                <div className="text-[11px] text-gray-400 mt-1">Comp Data: 5S, 0P, 0B, 0A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-900">MLS</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">Status:</span>0% None<br/>
                                    <span className="text-gray-400 mr-1">LOD:</span>11/26/25<br/>
                                    <span className="text-gray-400 mr-1">LCD:</span>N/A
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top text-right">
                                 <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                                    Analyze
                                </button>
                            </td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase">New</span>
                                </div>
                                <div className="font-bold text-gray-900 text-sm">10573 Larch</div>
                                <div className="text-xs text-gray-500 mb-2">Bloomington, CA 92316</div>
                                <div className="text-[11px] text-gray-500 leading-relaxed">
                                    SFR / 2 Br / 1 Ba / 4 Gar<br/>
                                    1940 / 1,951 ft² / 20,800 ft²
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-gray-900 text-base">$975,000</div>
                                <div className="text-[11px] text-gray-400 mt-1">Score: N/A</div>
                                <div className="text-[10px] text-green-600 mt-0.5 font-medium">Active</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-700">4 Days</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">DOM:</span>4 / <span className="text-gray-400 mr-1">CDOM:</span>4<br/>
                                    <span className="text-gray-400 mr-1">Created:</span>11/23/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs font-bold border border-green-100">151.59% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $643,184</div>
                                <div className="text-[11px] text-gray-400 mt-1">Comp Data: 1S, 0P, 0B, 0A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-900">MLS</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">Status:</span>10% Initial Contact<br/>
                                    <span className="text-gray-400 mr-1">LOD:</span>11/25/25<br/>
                                    <span className="text-gray-400 mr-1">LCD:</span>11/24/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top text-right">
                                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded transition-colors">
                                    Follow Up
                                </button>
                            </td>
                        </tr>

                         {/* Row 4 */}
                         <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold uppercase">Hot</span>
                                </div>
                                <div className="font-bold text-gray-900 text-sm">2842 Rosarita St</div>
                                <div className="text-xs text-gray-500 mb-2">San Bernardino, CA 92407</div>
                                <div className="text-[11px] text-gray-500 leading-relaxed">
                                    SFR / 3 Br / 2 Ba / 2 Gar<br/>
                                    1990 / 1,169 ft² / 7,200 ft²
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-gray-900 text-base">$390,000</div>
                                <div className="text-[11px] text-gray-400 mt-1">Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-700">7 Days</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">DOM:</span>0 / <span className="text-gray-400 mr-1">CDOM:</span>0<br/>
                                    <span className="text-gray-400 mr-1">Created:</span>11/21/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-100">0.00% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $0</div>
                                <div className="text-[11px] text-gray-400 mt-1">Comp Data: 0</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-xs text-gray-900">Off Market</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                    <span className="text-gray-400 mr-1">Status:</span>30% Offer Terms Sent<br/>
                                    <span className="text-gray-400 mr-1">LOD:</span>11/26/25<br/>
                                    <span className="text-gray-400 mr-1">LCD:</span>11/21/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top text-right">
                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
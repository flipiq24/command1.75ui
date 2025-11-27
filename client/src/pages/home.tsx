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
          <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
            <div className="mb-4 relative w-full flex justify-center">
              <img 
                src={logoUrl} 
                alt="FlipIQ Logo" 
                className="w-32 object-contain"
              />
            </div>
            <p className="text-[10px] text-orange-500 font-medium tracking-wide">Together, We Flip Smarter</p>
          </div>

          {/* Scrollable Nav Area */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
            
            {/* Main Section */}
            <div>
              <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors group">
                MAIN
                <ChevronDown className="w-3 h-3 group-hover:text-gray-600" />
              </div>
              <nav className="space-y-0.5 mt-1">
                <NavItem icon={CalendarCheck} label="Today's Plan" />
                <NavItem icon={HomeIcon} label="Dashboard" active />
                <NavItem icon={BarChart2} label="My Stats" />
                <NavItem icon={Briefcase} label="Deals" />
                <NavItem icon={Database} label="MLS" />
                <NavItem icon={Users} label="Agents" />
                <NavItem icon={Folder} label="Campaigns" />
              </nav>
            </div>

            {/* Secondary Section - implied grouping based on image spacing */}
            <div className="space-y-0.5">
               <NavItem icon={FileText} label="DisoPro" className="leading-tight" />
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Action Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Hot / Warm Deals */}
                <div className="bg-white p-4 border border-orange-200 border-l-4 border-l-orange-500 rounded shadow-sm">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Hot / Warm Deals</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">0/1</span>
                        <span className="text-sm text-gray-500">Hot</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-2xl font-bold text-gray-900">0/6</span>
                        <span className="text-sm text-gray-500">Warm</span>
                    </div>
                </div>

                {/* New Agent Calls */}
                <div className="bg-white p-4 border border-gray-200 border-l-4 border-l-blue-500 rounded shadow-sm">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">New Agent Calls</div>
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-2xl font-bold text-gray-900">3/30</span>
                        <button className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-bold hover:bg-blue-100 cursor-pointer transition-colors">
                            Start Dialer
                        </button>
                    </div>
                </div>

                {/* New Agent Relationships */}
                <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
                     <div className="text-xs text-gray-500 font-bold uppercase mb-1">New Agent Relationships</div>
                     <div className="text-2xl font-bold text-gray-900">0/5</div>
                </div>

                {/* Offers Made Today */}
                <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Offers Made Today</div>
                    <div className="text-2xl font-bold text-gray-900">1/3</div>
                </div>

            </div>
          </div>

          {/* Detailed Deals Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50 text-gray-500 text-[11px] uppercase font-bold tracking-wider border-b-2 border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-1/4">Property</th>
                            <th className="px-4 py-3 w-[15%]">List Price / Score</th>
                            <th className="px-4 py-3 w-[15%]">Market Info (Dates)</th>
                            <th className="px-4 py-3 w-1/5">Evaluation (Asking vs ARV)</th>
                            <th className="px-4 py-3 w-[15%]">Offer Status / Source</th>
                            <th className="px-4 py-3 w-[10%]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">

                        {/* Row 1 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase">New</span>
                                    <span className="text-xs text-red-500 font-bold flex items-center">0 Critical</span>
                                </div>
                                <div className="font-bold text-base text-gray-900">2011 Windsor Cir</div>
                                <div className="text-sm text-gray-600">Duarte, CA 91010</div>
                                <div className="text-xs text-gray-400 mt-1">3 Br / 0 Ba / 1,654 ft² / 1981</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-lg text-gray-900">$500,000</div>
                                <div className="text-xs text-gray-500 mt-1">Propensity Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-700">2 Days</div>
                                <div className="text-xs text-gray-500 mt-1 leading-tight">
                                    DOM: 0 / CDOM: 0<br/>
                                    Created: 11/26/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top bg-red-50/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-red-700">0.00% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $0</div>
                                <div className="text-xs text-gray-500 mt-1">Comp Data: 0</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-900">0% None</div>
                                <div className="text-xs text-gray-500 mt-1">Source: Off Market</div>
                                <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                                    LOD: 11/26/25<br/>
                                    LCD: 11/26/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                 <button className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded text-xs shadow-sm cursor-pointer transition-colors">
                                    View Deal
                                </button>
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase">New</span>
                                </div>
                                <div className="font-bold text-base text-gray-900">420 Robinson</div>
                                <div className="text-sm text-gray-600">Bakersfield, CA 93305</div>
                                <div className="text-xs text-gray-400 mt-1">3 Br / 1 Ba / 1,013 ft² / 1959</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-lg text-gray-900">$75,000</div>
                                <div className="text-xs text-gray-500 mt-1">Propensity Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-700">3 Days / Active</div>
                                <div className="text-xs text-gray-500 mt-1 leading-tight">
                                    DOM: 3 / CDOM: 3<br/>
                                    Created: 11/24/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top bg-green-50/50">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-green-700">33.05% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $226,931</div>
                                <div className="text-xs text-gray-500 mt-1">Comp Data: 5S, 0P, 0B, 0A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-900">0% None</div>
                                <div className="text-xs text-gray-500 mt-1">Source: MLS</div>
                                <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                                    LOD: 11/26/25<br/>
                                    LCD: N/A
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs shadow-sm cursor-pointer transition-colors">
                                    Analyze
                                </button>
                            </td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase">New</span>
                                </div>
                                <div className="font-bold text-base text-gray-900">10573 Larch</div>
                                <div className="text-sm text-gray-600">Bloomington, CA 92316</div>
                                <div className="text-xs text-gray-400 mt-1">2 Br / 1 Ba / 1,951 ft² / 1940</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-lg text-gray-900">$975,000</div>
                                <div className="text-xs text-gray-500 mt-1">Propensity Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-700">4 Days / Active</div>
                                <div className="text-xs text-gray-500 mt-1 leading-tight">
                                    DOM: 4 / CDOM: 4<br/>
                                    Created: 11/23/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top bg-green-100/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-green-800">151.59% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $643,184</div>
                                <div className="text-xs text-gray-500 mt-1">Comp Data: 1S, 0P, 0B, 0A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-900">10% Initial Contact</div>
                                <div className="text-xs text-gray-500 mt-1">Source: MLS</div>
                                <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                                    LOD: 11/25/25<br/>
                                    LCD: 11/24/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <button className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded text-xs shadow-sm cursor-pointer transition-colors">
                                    Follow Up
                                </button>
                            </td>
                        </tr>

                         {/* Row 4 */}
                         <tr className="hover:bg-gray-50 transition group">
                            <td className="px-4 py-4 align-top">
                                <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[11px] font-bold uppercase">Hot</span>
                                </div>
                                <div className="font-bold text-base text-gray-900">2842 Rosarita St</div>
                                <div className="text-sm text-gray-600">San Bernardino, CA 92407</div>
                                <div className="text-xs text-gray-400 mt-1">3 Br / 2 Ba / 1,169 ft² / 1990</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-lg text-gray-900">$390,000</div>
                                <div className="text-xs text-gray-500 mt-1">Propensity Score: N/A</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-700">7 Days</div>
                                <div className="text-xs text-gray-500 mt-1 leading-tight">
                                    DOM: 0 / CDOM: 0<br/>
                                    Created: 11/21/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top bg-red-50/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-red-700">0.00% Spread</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">ARV: $0</div>
                                <div className="text-xs text-gray-500 mt-1">Comp Data: 0</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="font-bold text-sm text-gray-900">30% Offer Terms Sent</div>
                                <div className="text-xs text-gray-500 mt-1">Source: Off Market</div>
                                <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                                    LOD: 11/26/25<br/>
                                    LCD: 11/21/25
                                </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                                <button className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded text-xs shadow-sm cursor-pointer transition-colors">
                                    View Deal
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
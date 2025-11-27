import React from 'react';
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
  LogOut
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
            <div className="mb-2 relative">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                {/* House Roof */}
                <path d="M4 20L24 4L44 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                {/* House Walls - partial/implied or integrated with bulb */}
                <path d="M9 20V38C9 40.2 10.8 42 13 42H35C37.2 42 39 40.2 39 38V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Lightbulb inside */}
                <path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 26.5 17.2 28.8 19 30.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M21 36H27" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M22 40H26" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                {/* Radiance/Idea marks */}
                <path d="M24 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 10L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M34 10L32 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex items-center justify-center gap-0.5 text-2xl font-bold tracking-tight mb-1">
              <span className="text-slate-900">Flip</span><span className="text-orange-500">Iq</span>
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
                <NavItem icon={HomeIcon} label="Dashboard" active />
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
          <h1 className="text-xl font-bold text-gray-900">Welcome, Tony!</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Nov 26, 2025</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">TF</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Calls Card */}
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

            {/* Texts Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Texts</span>
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">11</span>
              </div>
            </div>

            {/* Offers Made Card */}
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

            {/* Relationships Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Relationships</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Action Plan</h2>
            <div className="flex flex-wrap gap-4">
              {/* Hot Deals Button */}
              <button className="bg-white border-2 border-orange-500 rounded-lg p-3 min-w-[140px] text-center hover:bg-orange-50 transition shadow-sm group cursor-pointer">
                <div className="relative w-12 h-12 mx-auto mb-2 rounded-full border-4 border-orange-200 border-t-orange-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">0/1</span>
                </div>
                <div className="text-xs font-bold text-gray-900">Hot Deals</div>
                <div className="text-[10px] text-orange-600 font-medium group-hover:underline">View 1 Deal</div>
              </button>

              {/* Warm Deals Button */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[140px] text-center opacity-70">
                <div className="relative w-12 h-12 mx-auto mb-2 rounded-full border-4 border-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">0/6</span>
                </div>
                <div className="text-xs text-gray-500">Warm Deals</div>
              </div>

              {/* New Agent Calls Button */}
              <button className="bg-white border border-gray-200 rounded-lg p-3 min-w-[140px] text-center hover:border-blue-400 hover:shadow-md transition cursor-pointer">
                <div className="relative w-12 h-12 mx-auto mb-2 rounded-full border-4 border-blue-100 border-l-blue-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">3/30</span>
                </div>
                <div className="text-xs font-medium text-gray-900">New Agent Calls</div>
                <div className="text-[10px] text-blue-600 font-medium">Start Dialer</div>
              </button>
              
              {/* Offers Made Button */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[140px] text-center">
                <div className="relative w-12 h-12 mx-auto mb-2 rounded-full border-4 border-gray-100 border-r-green-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">1/3</span>
                </div>
                <div className="text-xs text-gray-500">Offers Made</div>
              </div>
            </div>
          </div>

          {/* Deals Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50">
              <div className="flex gap-2">
                <span className="text-sm font-semibold text-gray-700">Deals to Follow Up (3)</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">Filter</button>
                <button className="px-3 py-1.5 bg-blue-600 rounded text-xs font-medium text-white hover:bg-blue-700 cursor-pointer flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Add Property
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-3 font-semibold w-1/3">Property</th>
                    <th className="px-6 py-3 font-semibold">Financials</th>
                    <th className="px-6 py-3 font-semibold">Spread / Equity</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Next Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-orange-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">2011 Windsor Cir</div>
                          <div className="text-xs text-gray-500 mt-0.5">Duarte, CA 91010</div>
                          <div className="text-[10px] text-gray-400 mt-1">3 Br / 0 Ba • 1,654 ft²</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">$500,000</span>
                        <span className="text-xs text-gray-500">ARV: $643k</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          0% Spread
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">Asking = ARV</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New Lead
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            Call Agent
                        </button>
                    </td>
                  </tr>

                  {/* Row 2 - Mock Data */}
                  <tr className="hover:bg-orange-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-gray-300"></div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">4502 Maple Ave</div>
                          <div className="text-xs text-gray-500 mt-0.5">Pasadena, CA 91105</div>
                          <div className="text-[10px] text-gray-400 mt-1">4 Br / 3 Ba • 2,100 ft²</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">$850,000</span>
                        <span className="text-xs text-gray-500">ARV: $1.1M</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          22% Spread
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">$250k Equity</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Offer Sent
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            Follow Up
                        </button>
                    </td>
                  </tr>

                   {/* Row 3 - Mock Data */}
                   <tr className="hover:bg-orange-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-gray-300"></div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">8821 Oak St</div>
                          <div className="text-xs text-gray-500 mt-0.5">Arcadia, CA 91006</div>
                          <div className="text-[10px] text-gray-400 mt-1">2 Br / 1 Ba • 950 ft²</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">$620,000</span>
                        <span className="text-xs text-gray-500">ARV: $700k</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          11% Spread
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">$80k Equity</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Analysis
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            Review Comp
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
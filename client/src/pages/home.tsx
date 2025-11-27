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

          {/* Action Plan */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Action Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="bg-white p-4 rounded-xl border-2 border-orange-500 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">0/1</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Hot Deals</h3>
                    <p className="text-xs text-orange-600 font-medium mt-1">View 1 Deal &rarr;</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <span className="text-3xl font-bold text-gray-900 opacity-60">0/6</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Warm Deals</h3>
                    <p className="text-xs text-gray-400 mt-1">Review Updates</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">3/30</span>
                    </div>
                    <h3 className="font-bold text-gray-900">New Agent Calls</h3>
                    <p className="text-xs text-blue-600 font-medium mt-1">Start Dialer &rarr;</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">1/3</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Offers Made</h3>
                    <p className="text-xs text-green-600 font-medium mt-1">View Offers &rarr;</p>
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
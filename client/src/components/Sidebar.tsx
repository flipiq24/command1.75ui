import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Phone, 
  Users, 
  Search,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart2,
  FileText,
  Lightbulb,
  Folder
} from 'lucide-react';
import { Link, useLocation } from "wouter";
import logoUrl from '@assets/flipiQlogo_1764227557148.JPG';
import { cn } from "@/lib/utils";

interface SidebarProps {
  onIQClick?: () => void;
  isIQActive?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onIQClick, isIQActive = false, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shrink-0 z-20 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className={cn("p-6 flex justify-center", isCollapsed ? "px-2" : "px-6")}>
           {isCollapsed ? (
             <img src={logoUrl} alt="FlipIQ" className="w-10 object-contain overflow-hidden" style={{objectPosition: 'left'}} /> 
           ) : (
             <img src={logoUrl} alt="FlipIQ" className="w-40 object-contain" />
           )}
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-visible">
          
          {/* Today's Plan Section */}
          <div>
            <div className={cn("px-2 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider", isCollapsed && "text-center")}>
                {isCollapsed ? "Plan" : "Today's Plan"}
            </div>
            <div className="space-y-1">
                <button 
                  onClick={onIQClick}
                  className={cn(
                    "group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition w-full",
                    isIQActive
                      ? "bg-gradient-to-r from-[#FF6600] to-[#FF8533] text-white border-[#FF6600] hover:from-[#e65c00] hover:to-[#FF6600]"
                      : "text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-100",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  data-testid="button-iq-overlay"
                >
                    <span className="flex items-center gap-3">
                      <Lightbulb className={cn("w-4 h-4 flex-shrink-0", isIQActive && "animate-pulse")} /> 
                      {!isCollapsed && <span>iQ</span>}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">iQ:</span><br/>
                        AI-powered daily check-in and deal review assistant.
                    </div>
                </button>

                <Link href="/" className={cn(
                  "group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition",
                  location === '/' && !isIQActive
                    ? "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200" 
                    : "text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-100",
                  isCollapsed ? "justify-center" : "justify-between"
                )}>
                    <span className="flex items-center gap-3">
                      <ListTodo className="w-4 h-4 flex-shrink-0" /> 
                      {!isCollapsed && <span>Deal Review</span>}
                    </span>
                    {!isCollapsed && <span className="text-gray-600 text-xs font-bold">5 / 56</span>}
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">Deal Review:</span><br/>
                        deals that are assigned to you they need attention today
                    </div>
                </Link>

                <Link href="/daily-outreach" className={cn(
                  "group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition",
                  location === '/daily-outreach'
                    ? "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200"
                    : "text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-100",
                  isCollapsed ? "justify-center" : "justify-between"
                )}>
                    <span className="flex items-center gap-3">
                      <Phone className="w-4 h-4 flex-shrink-0" /> 
                      {!isCollapsed && <span>Daily Outreach</span>}
                    </span>
                    {!isCollapsed && <span className="text-gray-600 text-xs font-bold">3 / 30</span>}
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">Daily Outreach:</span><br/>
                        list of Agents to call today focusing on relationship building
                    </div>
                </Link>
            </div>
          </div>

          {/* Pipeline Section */}
          <div>
            <div className={cn("px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider", isCollapsed && "text-center")}>
                {isCollapsed ? "Pipe" : "Pipeline"}
            </div>
            <div className="space-y-1">
                <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                    <div className="text-gray-500"><Folder className="w-4 h-4 flex-shrink-0" /></div>
                    {!isCollapsed && "My Deals"}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">My Deals:</span><br/>
                        List of all my active properties in the chronological order that are assigned to me.
                    </div>
                </a>
            </div>
          </div>

          {/* Find Leads Section */}
          <div>
            <div className={cn("px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider", isCollapsed && "text-center")}>
                {isCollapsed ? "Deals" : "Find Deals"}
            </div>
            <div className="space-y-1">
                <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                    <div className="text-gray-500"><Zap className="w-5 h-5 flex-shrink-0" /></div>
                    {!isCollapsed && "MLS Hot Deals"}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">MLS Hot Deals:</span><br/>
                        Latest MLS deals based on propensity to sell, Key words and percentage off ARV.
                    </div>
                </a>

                <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                     <div className="text-gray-500"><Search className="w-5 h-5 flex-shrink-0" /></div>
                    {!isCollapsed && "MLS Search"}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">MLS Search:</span><br/>
                        Use standard MLS filters to find any deal on the MLS.
                    </div>
                </a>

                <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                     <div className="text-gray-500"><Users className="w-5 h-5 flex-shrink-0" /></div>
                    {!isCollapsed && "Agent Search"}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">Agent Search:</span><br/>
                        Find investor friendly agents based on how they transact.
                    </div>
                </a>

                <a href="#" className={cn("group relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition", isCollapsed ? "justify-center" : "pl-8 pr-3")}>
                    {!isCollapsed && <span className="text-gray-400">└──</span>}
                    {!isCollapsed && "Campaigns"}
                    {isCollapsed && <div className="w-1 h-1 rounded-full bg-gray-400"></div>} {/* Dot for collapsed state */}
                    
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                        <span className="font-bold text-[#FF6600]">Campaigns:</span><br/>
                        My campaigns sent to my agent target list.
                    </div>
                </a>
            </div>
          </div>

          {/* Tools Section */}
          <div>
              <div className={cn("px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider", isCollapsed && "text-center")}>
                  {isCollapsed ? "Tools" : "Tools"}
              </div>
              <div className="space-y-1">
                  <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                      <BarChart2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {!isCollapsed && "My Stats"}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                          <span className="font-bold text-[#FF6600]">My Stats:</span><br/>
                          Text, call, email and offer tracking.
                      </div>
                  </a>
                  
                  <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {!isCollapsed && "DispoPro"}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                          <span className="font-bold text-[#FF6600]">DispoPro:</span><br/>
                          Easily market and wholesale your deals to active buyers.
                      </div>
                  </a>

                  <a href="#" className={cn("group relative flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg", isCollapsed && "justify-center")}>
                      <LayoutDashboard className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {!isCollapsed && "Pro Dashboard"}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                          <span className="font-bold text-[#FF6600]">Pro Dashboard:</span><br/>
                          Full detailed dashboard for Pro users.
                      </div>
                  </a>
              </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto border-t border-gray-100">
           <button 
             onClick={toggleSidebar}
             className={cn("w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors mb-4", isCollapsed && "justify-center")}
           >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              {!isCollapsed && <span>Collapse sidebar</span>}
           </button>

           <div className={cn("flex items-center gap-3 px-3 py-2", isCollapsed && "justify-center flex-col")}>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">Tony Fletcher</div>
                  <div className="text-xs text-gray-500 truncate">tonyf@fairclose.net</div>
                </div>
              )}
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
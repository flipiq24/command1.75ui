import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import OutreachActionPlan, { OutreachType } from "@/components/OutreachActionPlan";
import Sidebar from "@/components/Sidebar";
import { 
  ChevronDown,
  MoreVertical,
  Phone,
  MessageSquare,
  Mail,
  Bot,
  User,
  Building2,
  Calendar,
  Star,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Agent {
  id: number;
  name: string;
  brokerage: string;
  phone: string;
  email: string;
  outreachType: string;
  priority: string;
  lastContact: string;
  nextAction: string;
  status: string;
  notes: string | null;
  dealsWorked: string;
  relationshipScore: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hot Lead':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Active':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Nurturing':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Dormant':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-amber-600';
    case 'low':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-gray-500';
};

export default function DailyOutreach() {
  const [activeFilter, setActiveFilter] = useState<OutreachType | null>(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Agent> }) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update agent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a: Agent, b: Agent) => {
      const scoreA = parseInt(a.relationshipScore) || 0;
      const scoreB = parseInt(b.relationshipScore) || 0;
      return scoreB - scoreA;
    });
  }, [agents]);

  const filteredAgents = useMemo(() => {
    return sortedAgents.filter((agent: Agent) => {
      if (!activeFilter) return true;
      return agent.outreachType === activeFilter;
    });
  }, [sortedAgents, activeFilter]);

  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAgentIds(filteredAgents.map((a: Agent) => a.id));
      setIsBulkActionsOpen(true);
    } else {
      setSelectedAgentIds([]);
      setIsBulkActionsOpen(false);
    }
  };

  const handleSelectAgent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAgentIds(prev => [...prev, id]);
    } else {
      setSelectedAgentIds(prev => prev.filter(agentId => agentId !== id));
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium mb-1">Thursday, November 27</div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Nov 27, 2025 — Today's Outreach Plan!</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="bg-white hover:bg-gray-50 text-black text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm border border-gray-200" data-testid="button-add-agent">
                <span className="group-hover:text-[#FF6600] transition-colors">Add Agent</span>
                <span className="text-[#FF6600] text-xl font-bold leading-none">+</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                Add a new agent to your outreach list for relationship building.
              </div>
            </div>
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-colors border border-gray-200 shadow-sm" data-testid="button-ai-bot">
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
            
          <OutreachActionPlan 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
              
            <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none rounded-t-xl">
              <div className="w-[48px] shrink-0 flex flex-col justify-center items-center gap-0.5">
                <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">All</span>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filteredAgents.length > 0 && filteredAgents.every((a: Agent) => selectedAgentIds.includes(a.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  title="Select All Filtered Agents"
                  data-testid="checkbox-select-all"
                />
              </div> 
              <div className="flex-1 flex items-center">
              
                <div className="w-4/12 px-4 flex items-center gap-2 group relative">
                  <div className="flex items-center gap-1 cursor-help">
                    <span>Agent / Brokerage</span>
                    <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                      Agent name, brokerage affiliation, and relationship status indicator.
                    </div>
                  </div>

                  {selectedAgentIds.length > 0 && (
                    <DropdownMenu open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
                      <DropdownMenuTrigger asChild>
                        <button className="bg-[#FF6600] hover:bg-[#e65c00] text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 transition-colors ml-2 normal-case" data-testid="button-bulk-actions">
                          Bulk Actions ({selectedAgentIds.length})
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48 bg-white z-50 border-none shadow-xl">
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                          <Phone className="w-4 h-4" />
                          <span>Call All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                          <MessageSquare className="w-4 h-4" />
                          <span>Text All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                          <Mail className="w-4 h-4" />
                          <span>Email All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                          <Bot className="w-4 h-4" />
                          <span>AI Outreach</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                  <span>Contact Info</span>
                  <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                    Phone number and email for quick outreach actions.
                  </div>
                </div>
                
                <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                  <span>Last Contact</span>
                  <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                    When you last reached out to this agent and what the next action should be.
                  </div>
                </div>
                
                <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                  <span>Status / Score</span>
                  <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                    Relationship status and score based on engagement history and deal activity.
                  </div>
                </div>

                <div className="w-2/12 px-4 flex items-center gap-1 group relative cursor-help">
                  <span>Deals / Actions</span>
                  <svg className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                    Number of deals worked together and quick action buttons.
                  </div>
                </div>

              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Loading agents...
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No agents found matching the selected filter.
              </div>
            ) : (
              filteredAgents.map((agent: Agent) => (
                <div key={agent.id} className={cn("flex border-b border-gray-100 hover:bg-gray-50 transition group py-4", selectedAgentIds.includes(agent.id) && "bg-blue-50/50 hover:bg-blue-50")} data-testid={`row-agent-${agent.id}`}>
                  <div className="w-12 shrink-0 flex flex-col items-center gap-3 pt-1">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedAgentIds.includes(agent.id)}
                      onChange={(e) => handleSelectAgent(agent.id, e.target.checked)}
                      data-testid={`checkbox-agent-${agent.id}`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row">
                      
                    <div className="w-4/12 px-4 flex flex-col justify-start gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FF6600] to-[#FF8533] rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm" data-testid={`text-agent-name-${agent.id}`}>
                            {agent.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {agent.brokerage}
                          </div>
                        </div>
                      </div>
                      {agent.notes && (
                        <div className="text-[11px] text-gray-500 mt-1 italic pl-10">
                          {agent.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="w-2/12 px-4 flex flex-col justify-center gap-1">
                      <a href={`tel:${agent.phone}`} className="text-sm text-gray-700 hover:text-[#FF6600] transition flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="text-xs text-gray-500 hover:text-[#FF6600] transition truncate">
                        {agent.email}
                      </a>
                    </div>
                    
                    <div className="w-2/12 px-4 flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {agent.lastContact}
                      </div>
                      <div className="text-xs text-[#FF6600] font-medium">
                        → {agent.nextAction}
                      </div>
                    </div>
                    
                    <div className="w-2/12 px-4 flex flex-col justify-center gap-2">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit", getStatusColor(agent.status))}>
                        {agent.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={cn("w-3 h-3", getScoreColor(parseInt(agent.relationshipScore)))} />
                        <span className={cn("text-sm font-bold", getScoreColor(parseInt(agent.relationshipScore)))}>
                          {agent.relationshipScore}%
                        </span>
                        <span className="text-[10px] text-gray-400">score</span>
                      </div>
                    </div>

                    <div className="w-2/12 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{agent.dealsWorked}</div>
                          <div className="text-[9px] text-gray-400 uppercase">Deals</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition" title="Call" data-testid={`button-call-${agent.id}`}>
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition" title="Text" data-testid={`button-text-${agent.id}`}>
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600 transition" title="Email" data-testid={`button-email-${agent.id}`}>
                          <Mail className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" data-testid={`button-more-${agent.id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white z-50 border-none shadow-xl">
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                              <User className="w-4 h-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                              <Star className="w-4 h-4" />
                              <span>Add to Favorites</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50">
                              <Bot className="w-4 h-4" />
                              <span>AI Assist</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

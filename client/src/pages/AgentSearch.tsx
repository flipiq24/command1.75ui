import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { 
  ChevronDown,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Agent {
  id: number;
  name: string;
  officeName: string;
  cellPhone: string;
  email: string;
  assignedUser: string;
  relationshipStatus: 'Priority' | 'Warm' | 'Cold' | 'Unknown';
  basket: 'Prospect' | 'High Value' | 'Mid Value' | 'Low Value';
  requiredAction: number;
  followUpStatus: 'Priority' | 'Warm' | 'Cold' | 'Unknown' | 'Signed Up to Webinar' | 'Did Not Respond';
  followUpDate: string;
  investorSourceCount: number | null;
  activeInLast2Years: boolean;
  pending: number;
  backup: number;
  sold: number;
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: 1,
    name: "Aaron Zapata",
    officeName: "Real Broker",
    cellPhone: "7144823217",
    email: "aaron@impactprop.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Priority",
    basket: "Prospect",
    requiredAction: 0,
    followUpStatus: "Signed Up to Webinar",
    followUpDate: "11/27/2025",
    investorSourceCount: 5,
    activeInLast2Years: true,
    pending: 17,
    backup: 2,
    sold: 13
  },
  {
    id: 2,
    name: "Aaron Mills",
    officeName: "Compass Newport Beach",
    cellPhone: "714-270-2424",
    email: "aaronsmills@gmail.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Priority",
    basket: "Prospect",
    requiredAction: 0,
    followUpStatus: "Priority",
    followUpDate: "N/A",
    investorSourceCount: 6,
    activeInLast2Years: true,
    pending: 9,
    backup: 3,
    sold: 45
  },
  {
    id: 3,
    name: "Aaron Grushow",
    officeName: "Christie's International Real Estate SoCal",
    cellPhone: "3109240980",
    email: "homes@aarongrushow.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Unknown",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Unknown",
    followUpDate: "N/A",
    investorSourceCount: null,
    activeInLast2Years: true,
    pending: 1,
    backup: 0,
    sold: 5
  },
  {
    id: 4,
    name: "Aaron Montelongo",
    officeName: "Compass",
    cellPhone: "310-600-0288",
    email: "aaron@aaronmontelongo.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Warm",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Warm",
    followUpDate: "N/A",
    investorSourceCount: null,
    activeInLast2Years: true,
    pending: 3,
    backup: 2,
    sold: 15
  },
  {
    id: 5,
    name: "Aaron Cavazos",
    officeName: "CAVAZOS REAL ESTATE SERVICES",
    cellPhone: "626-232-1540",
    email: "aaroncavazos@sbcglobal.net",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Unknown",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Did Not Respond",
    followUpDate: "1/29/2024",
    investorSourceCount: 1,
    activeInLast2Years: true,
    pending: 2,
    backup: 0,
    sold: 25
  },
  {
    id: 6,
    name: "Aaron Buxbaum",
    officeName: "FIRST TEAM REAL ESTATE",
    cellPhone: "949-836-2312",
    email: "southerncalrealestate@yahoo.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Warm",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Warm",
    followUpDate: "3/13/2023 11:59",
    investorSourceCount: null,
    activeInLast2Years: true,
    pending: 1,
    backup: 0,
    sold: 15
  },
  {
    id: 7,
    name: "Aaron Guzman",
    officeName: "Compass",
    cellPhone: "562-556-0944",
    email: "aaronguzmanre@gmail.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Unknown",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Unknown",
    followUpDate: "N/A",
    investorSourceCount: null,
    activeInLast2Years: true,
    pending: 4,
    backup: 1,
    sold: 35
  },
  {
    id: 8,
    name: "Aaron Andersen",
    officeName: "Luxe Real Estate",
    cellPhone: "949-432-1922",
    email: "aaron@daftariangroup.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Warm",
    basket: "Mid Value",
    requiredAction: 0,
    followUpStatus: "Warm",
    followUpDate: "N/A",
    investorSourceCount: 1,
    activeInLast2Years: true,
    pending: 3,
    backup: 2,
    sold: 15
  },
  {
    id: 9,
    name: "Abby Cline",
    officeName: "Anvil Real Estate",
    cellPhone: "949-295-6643",
    email: "abby@anvilreinc.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Unknown",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Unknown",
    followUpDate: "N/A",
    investorSourceCount: 1,
    activeInLast2Years: true,
    pending: 0,
    backup: 0,
    sold: 5
  },
  {
    id: 10,
    name: "Abe Sassoon",
    officeName: "eXp Realty of Greater Los Angeles",
    cellPhone: "310-795-4367",
    email: "abe.sassoon@exprealty.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Cold",
    basket: "Mid Value",
    requiredAction: 0,
    followUpStatus: "Cold",
    followUpDate: "04/03/2024",
    investorSourceCount: 1,
    activeInLast2Years: true,
    pending: 2,
    backup: 0,
    sold: 25
  },
  {
    id: 11,
    name: "Abel Garfias",
    officeName: "ehomes",
    cellPhone: "323-524-8929",
    email: "abelgarfias310@gmail.com",
    assignedUser: "Tony Fletcher",
    relationshipStatus: "Warm",
    basket: "Low Value",
    requiredAction: 0,
    followUpStatus: "Warm",
    followUpDate: "N/A",
    investorSourceCount: 8,
    activeInLast2Years: true,
    pending: 6,
    backup: 1,
    sold: 55
  }
];

function AgentSearchContent() {
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAgentIds(SAMPLE_AGENTS.map(a => a.id));
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

  const getRelationshipStatusColor = (status: string) => {
    switch (status) {
      case 'Priority': return 'text-purple-600 font-semibold';
      case 'Warm': return 'text-orange-500 font-semibold';
      case 'Cold': return 'text-blue-500 font-semibold';
      default: return 'text-gray-500';
    }
  };

  const getFollowUpStatusColor = (status: string) => {
    switch (status) {
      case 'Priority': return 'text-purple-600 font-semibold';
      case 'Signed Up to Webinar': return 'text-green-600 font-semibold';
      case 'Warm': return 'text-orange-500 font-semibold';
      case 'Cold': return 'text-blue-500 font-semibold';
      case 'Did Not Respond': return 'text-red-500 font-semibold';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-gray-50">
      
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Agent Search</h1>
        </div>
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-search-agents"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00] rounded-lg transition flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 transition">
            Quick View
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
          
          {/* Table Header */}
          <div className="flex py-3 bg-white border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-400 select-none">
            <div className="w-[48px] shrink-0 flex flex-col justify-center items-center gap-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={SAMPLE_AGENTS.length > 0 && SAMPLE_AGENTS.every(a => selectedAgentIds.includes(a.id))}
                onChange={(e) => handleSelectAll(e.target.checked)}
                title="Select All Agents"
              />
              <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">All</span>
            </div> 
            <div className="flex-1 flex items-center">
              <div className="w-3/12 px-4">Agent Info</div>
              <div className="w-3/12 px-4">Relationship</div>
              <div className="w-3/12 px-4">Follow-Up</div>
              <div className="w-3/12 px-4">Activity & Status</div>
            </div>
          </div>

          {/* Agent Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {SAMPLE_AGENTS.map((agent) => (
              <div 
                key={agent.id}
                className="flex py-4 hover:bg-gray-50 transition-colors"
                data-testid={`row-agent-${agent.id}`}
              >
                {/* Checkbox */}
                <div className="w-[48px] shrink-0 flex flex-col justify-start items-center pt-1 gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedAgentIds.includes(agent.id)}
                    onChange={(e) => handleSelectAgent(agent.id, e.target.checked)}
                  />
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 flex items-start">
                  {/* Agent Info */}
                  <div className="w-3/12 px-4">
                    <div className="font-semibold text-gray-900 text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Office Name: {agent.officeName}</div>
                    <div className="text-xs mt-0.5">
                      <span className="text-gray-500">Best Cell phone: </span>
                      <span className="text-blue-600">{agent.cellPhone}</span>
                    </div>
                    <div className="text-xs mt-0.5">
                      <span className="text-gray-500">Best Email: </span>
                      <span className="text-blue-600">{agent.email}</span>
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="w-3/12 px-4">
                    <div className="text-xs text-gray-500">Assigned User: {agent.assignedUser}</div>
                    <div className="text-xs mt-0.5">
                      <span className="text-gray-900 font-medium">Relationship Status: </span>
                      <span className={getRelationshipStatusColor(agent.relationshipStatus)}>{agent.relationshipStatus}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Basket: {agent.basket}</div>
                  </div>

                  {/* Follow-Up */}
                  <div className="w-3/12 px-4">
                    <div className="text-xs text-gray-500">Required Action: {agent.requiredAction}</div>
                    <div className="text-xs mt-0.5">
                      <span className="text-gray-900 font-medium">Follow-Up Status: </span>
                      <span className={getFollowUpStatusColor(agent.followUpStatus)}>{agent.followUpStatus}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Follow-Up Date: {agent.followUpDate}</div>
                  </div>

                  {/* Activity & Status */}
                  <div className="w-3/12 px-4">
                    <div className="text-xs">
                      <span className="text-gray-900 font-semibold">Investor Source Count: </span>
                      {agent.investorSourceCount !== null ? (
                        <span className="text-blue-600 font-bold">{agent.investorSourceCount}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Active in Last 2 Years: {agent.activeInLast2Years ? 'TRUE' : 'FALSE'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Pending, Backup, Sold: ({agent.pending}) {agent.pending}P, {agent.backup}B, {agent.sold}S
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function AgentSearch() {
  return <AgentSearchContent />;
}

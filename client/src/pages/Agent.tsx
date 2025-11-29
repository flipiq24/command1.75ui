import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  ChevronDown,
  Globe,
  ExternalLink,
  MoreVertical,
  Phone,
  Mail,
  User,
  Calendar,
  Edit2,
  RefreshCw,
  MessageSquare,
  Building2
} from 'lucide-react';

function AgentContent() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const propertyId = params.id || '12';
  
  const [activeTab, setActiveTab] = useState('agent');
  const [activeRightTab, setActiveRightTab] = useState('notes');
  
  const [relationshipStatus, setRelationshipStatus] = useState('Unknown');
  const [agentRating, setAgentRating] = useState('Unknown');
  const [basket, setBasket] = useState('Low Value');
  const [activeInLast2Years, setActiveInLast2Years] = useState(true);
  const [investorSourceCount, setInvestorSourceCount] = useState(9);
  const [followUpStatus, setFollowUpStatus] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [assignedUser, setAssignedUser] = useState('Michael May');
  const [doNotCall, setDoNotCall] = useState(false);

  const leftTabs = [
    { id: 'piq', label: 'PIQ' },
    { id: 'comps', label: 'Comps' },
    { id: 'investment', label: 'Investment Analysis' },
    { id: 'agent', label: 'Agent' },
    { id: 'offer', label: 'Offer Terms' },
  ];

  const rightTabs = [
    { id: 'ai-connect', label: 'AI Connect' },
    { id: 'notes', label: 'Notes' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'activity', label: 'Activity' },
    { id: 'tax-data', label: 'Tax Data' },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'piq' || tabId === 'comps' || tabId === 'investment' || tabId === 'offer') {
      setLocation(`/piq/${propertyId}`);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="text-xs text-gray-500 mb-1">Saturday, November 29</div>
        <h1 className="text-lg font-bold text-gray-900">Welcome, Michael!</h1>
      </header>

      {/* Property Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation(`/piq/${propertyId}`)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">1119 Calzona Street , Los Angeles , CA 90023</h2>
              <Globe className="w-4 h-4 text-gray-400" />
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700">0%</span>
              <select 
                className="text-sm text-gray-600 bg-transparent border-none outline-none cursor-pointer"
                defaultValue="None"
              >
                <option>None</option>
                <option>Acquired</option>
                <option>Offer Accepted</option>
                <option>In Negotiations</option>
              </select>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Sub-header row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <button className="flex items-center gap-1 hover:text-gray-700">
            <span className="text-gray-400">+</span> New
            <ChevronDown className="w-3 h-3" />
          </button>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          </div>
          <span className="text-gray-300">•</span>
          <button className="flex items-center gap-1 hover:text-gray-700">
            To do: Not set
            <ChevronDown className="w-3 h-3" />
          </button>
          <span className="text-gray-300">•</span>
          <RefreshCw className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">•</span>
          <span>0 Critical</span>
          <span className="text-gray-300">•</span>
          <span>0 Reminders</span>
        </div>
      </div>

      {/* Property Details Cards */}
      <div className="bg-white border-b border-gray-200">
        <div className="grid grid-cols-5 divide-x divide-gray-200">
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Property Details</div>
            <div className="text-sm text-gray-900">Other (L) / 5 Br / 3 Ba / 0 Gar / 1923 / 1,648 ft² / 6,199 ft² / Pool: None</div>
          </div>
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">List Price</div>
            <div className="text-sm font-semibold text-gray-900">$599,000</div>
            <div className="text-xs text-gray-500">Owned over 15 years, Trust owned</div>
          </div>
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Market Info</div>
            <div className="text-sm text-gray-900">0 Days / Active</div>
            <div className="text-xs text-gray-500">DOM: 1 / CDOM: 0</div>
            <div className="text-xs text-gray-500">Sale Type: Standard</div>
          </div>
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Evaluation Metrics</div>
            <div className="text-sm text-gray-900">Asking VS ARV: <span className="font-semibold">89.76%</span></div>
            <div className="text-xs text-gray-500">ARV: $667,306</div>
            <div className="text-xs text-gray-500">Comp Data: A1, P1, B0, C3</div>
          </div>
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Last Open / Last Communication</div>
            <div className="text-sm text-gray-900">LOD: 11/29/2025</div>
            <div className="text-xs text-gray-500">LCD: N/A</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center justify-between">
          {/* Left Tabs */}
          <div className="flex">
            {leftTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition",
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Tabs */}
          <div className="flex items-center gap-1">
            {rightTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRightTab(tab.id)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition",
                  activeRightTab === tab.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
                data-testid={`tab-right-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Agent Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              
              {/* Agent Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Jeremy Flores</h3>
                  <button className="p-1 hover:bg-gray-100 rounded transition">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition" data-testid="button-agent-menu">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Active In Last 2 Years: <span className={activeInLast2Years ? "text-green-600 font-medium" : "text-gray-600"}>{activeInLast2Years ? 'True' : 'False'}</span>
                    </span>
                    <span className="text-gray-500">
                      Investor Source: {investorSourceCount > 0 ? (
                        <a 
                          href="https://nextjs-flipiq-agent.vercel.app/agents/AaronVillarreal"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                          data-testid="link-investor-source"
                        >
                          {investorSourceCount}
                        </a>
                      ) : (
                        <span className="text-gray-600">{investorSourceCount}</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>2135367426</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="underline">jeremydtla@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>ABC Realty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Assigned User */}
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 mb-2">Assigned User</div>
              <select 
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white min-w-[150px]"
                data-testid="select-assigned-user"
              >
                <option>Michael May</option>
                <option>Tony Fletcher</option>
                <option>Sarah Johnson</option>
              </select>
              
              <div className="flex items-center justify-end gap-2 mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={doNotCall}
                    onChange={(e) => setDoNotCall(e.target.checked)}
                    className="sr-only peer"
                    data-testid="toggle-do-not-call"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm text-gray-600">Do Not Call</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Section */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Agent Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Agent Status</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Relationship Status</label>
                <select 
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  data-testid="select-relationship-status"
                >
                  <option>Unknown</option>
                  <option>Priority</option>
                  <option>Hot</option>
                  <option>Warm</option>
                  <option>Cold</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Agent Rating</label>
                <select 
                  value={agentRating}
                  onChange={(e) => setAgentRating(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  data-testid="select-agent-rating"
                >
                  <option>Unknown</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Average</option>
                  <option>Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Basket</label>
                <select 
                  value={basket}
                  onChange={(e) => setBasket(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  data-testid="select-basket"
                >
                  <option>Low Value</option>
                  <option>High Value</option>
                  <option>Clients</option>
                </select>
              </div>
            </div>
          </div>

          {/* Last Communication Date */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Last Communication Date</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Communication Date</label>
                <input 
                  type="text"
                  defaultValue="-"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  readOnly
                  data-testid="input-last-comm-date"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Address Discussed</label>
                <input 
                  type="text"
                  defaultValue="-"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  readOnly
                  data-testid="input-last-address"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Communicated AA</label>
                <input 
                  type="text"
                  defaultValue="-"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  readOnly
                  data-testid="input-last-comm-aa"
                />
              </div>
            </div>
          </div>

          {/* Follow Up */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Follow Up</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Follow Up Status</label>
                <select 
                  value={followUpStatus}
                  onChange={(e) => setFollowUpStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  data-testid="select-followup-status"
                >
                  <option value="">Select...</option>
                  <option>Priority</option>
                  <option>Hot</option>
                  <option>Warm</option>
                  <option>Cold</option>
                  <option>Attempt 5</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Follow Up Status Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Select date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
                    data-testid="input-followup-date"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Communication Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    defaultValue="-"
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Address Discussed</label>
                <input 
                  type="text"
                  defaultValue="-"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Last Communicated AA</label>
                <input 
                  type="text"
                  defaultValue="-"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-500">—</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Note Dates</h4>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="text-sm text-gray-500">—</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Agent() {
  return <AgentContent />;
}

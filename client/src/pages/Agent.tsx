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
  Building2,
  FileText,
  X,
  Search,
  Filter,
  Paperclip,
  ChevronRight,
  Voicemail,
  Lightbulb,
  Mic,
  Bot
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
  const [doubleEnded, setDoubleEnded] = useState(0);
  const [averageDealsPerYear, setAverageDealsPerYear] = useState(6);
  const [followUpStatus, setFollowUpStatus] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [assignedUser, setAssignedUser] = useState('Michael May');
  const [doNotCall, setDoNotCall] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);

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
              {/* IQ Icon */}
              <div className="flex items-center gap-1 px-3 py-2 bg-orange-500 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">iQ</span>
              </div>
              
              {/* Agent Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Jeremy Flores</h3>
                  <button className="p-1 hover:bg-gray-100 rounded transition">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="relative">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded transition" 
                      data-testid="button-agent-menu"
                      onClick={() => setShowAgentMenu(!showAgentMenu)}
                    >
                      <MoreVertical className="w-4 h-4 text-red-500" />
                    </button>
                    {showAgentMenu && (
                      <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="menu-call">
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="menu-text">
                          <MessageSquare className="w-4 h-4" />
                          Text
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="menu-email">
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="menu-voicemail">
                          <Mic className="w-4 h-4" />
                          Text Voicemail
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="menu-ai-connect">
                          <Bot className="w-4 h-4" />
                          AI Connect
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-gray-500 ml-4">
                    <span>Active In Last 2 Years: <span className={activeInLast2Years ? "text-green-600 font-medium" : "text-gray-400"}>{activeInLast2Years ? 'True' : 'False'}</span></span>
                    <span>Average Deals Per Year: <span className={averageDealsPerYear > 0 ? "text-blue-600 font-medium" : "text-gray-400"}>{averageDealsPerYear}</span></span>
                    <span>Double Ended: <span className={doubleEnded > 0 ? "text-blue-600 font-medium" : "text-gray-400"}>{doubleEnded}</span></span>
                    <span>Investor Source: {investorSourceCount > 0 ? (
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
                      <span className="text-gray-400">{investorSourceCount}</span>
                    )}</span>
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

        {/* Next Steps Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Next Steps</h4>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">Run agent IQ reports</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Call Agent</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Update Agent Status</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Relationship Status -</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition border-orange-500">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">Set reminder</span>
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
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Follow Up</h4>
              <button 
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded border border-orange-500 transition"
                data-testid="button-reminders"
              >
                Set Reminder
              </button>
            </div>
            
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
            </div>
          </div>
        </div>

        {/* Agent Info Details */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Agent Info Details</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  data-testid="toggle-hide-empty"
                />
                <div className="w-9 h-5 bg-blue-600 rounded-full peer peer-checked:bg-blue-600"></div>
                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-0"></div>
              </div>
              <span className="text-sm text-gray-600">Hide Empty Fields</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg" data-testid="tab-general">
              General
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-agent-365">
              Agent 365 Report
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-milestones">
              Milestones
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-crm">
              CRM
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-other-fields">
              Other Fields
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg" data-testid="tab-notes">
                <FileText className="w-4 h-4" />
                Notes
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-emails">
                <Mail className="w-4 h-4" />
                Emails
                <span className="text-xs text-gray-400">Soon</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-sms">
                <Phone className="w-4 h-4" />
                SMS
                <span className="text-xs text-gray-400">Soon</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg" data-testid="tab-voicemail">
                <Voicemail className="w-4 h-4" />
                Voicemail
                <span className="text-xs text-gray-400">Soon</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition" data-testid="button-cancel">
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition" data-testid="button-search-notes">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition" data-testid="button-filter-notes">
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Text Input Area */}
          <div className="p-4 border-b border-gray-200">
            <textarea 
              placeholder="Start Typing"
              className="w-full h-24 p-3 text-sm text-gray-700 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="textarea-note"
            />
            <div className="flex items-center justify-end gap-4 mt-3">
              <button className="p-1.5 hover:bg-gray-100 rounded transition">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" data-testid="checkbox-communication" />
                Communication
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" data-testid="checkbox-critical" />
                Critical
              </label>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition" data-testid="button-post-note">
                Post Note
              </button>
            </div>
          </div>
          
          {/* Note Entry */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                MM
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Michael May</span>
                  <span className="text-xs text-gray-400">33s</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Notes</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700" data-testid="button-replies">
                <ChevronRight className="w-4 h-4" />
                0 Replies
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700" data-testid="button-email-note">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Agent() {
  return <AgentContent />;
}

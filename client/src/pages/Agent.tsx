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
  Lightbulb
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
  const [lastCommunicationDate, setLastCommunicationDate] = useState('-');
  const [daysSinceContact, setDaysSinceContact] = useState(30);

  // Smart Next Step Logic
  const getNextStep = () => {
    if (relationshipStatus === 'Unknown') {
      return { action: 'Start Vetting Script', type: 'vetting', color: 'bg-blue-600 hover:bg-blue-700' };
    }
    if (basket === 'Low Value') {
      return { action: 'Send Low-Ball Template', type: 'email', color: 'bg-orange-500 hover:bg-orange-600' };
    }
    if (daysSinceContact > 7) {
      return { action: 'Call Agent', type: 'call', color: 'bg-green-600 hover:bg-green-700' };
    }
    return { action: 'Log Activity', type: 'log', color: 'bg-gray-600 hover:bg-gray-700' };
  };

  const nextStep = getNextStep();

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
                  <button className="p-1 hover:bg-gray-100 rounded transition" data-testid="button-agent-menu">
                    <MoreVertical className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="flex items-center gap-3 ml-4">
                    {activeInLast2Years && (
                      <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        ACTIVE AGENT
                      </span>
                    )}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-500">
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
                      <span>Avg Deals/Year: <span className={averageDealsPerYear > 0 ? "text-blue-600 font-medium" : "text-gray-400"}>{averageDealsPerYear}</span></span>
                    </div>
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
          {/* Agent Status - Quick Select Pills */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Agent Status</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Relationship Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Unknown', 'New', 'Vetted', 'VIP', 'Blacklist'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setRelationshipStatus(status)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full transition",
                        relationshipStatus === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      data-testid={`pill-relationship-${status.toLowerCase()}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-2">Basket</label>
                <div className="flex flex-wrap gap-1.5">
                  {['High Value', 'Medium', 'Low Value', 'Trash'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setBasket(value)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full transition",
                        basket === value
                          ? value === 'High Value' ? "bg-green-600 text-white" 
                            : value === 'Low Value' || value === 'Trash' ? "bg-red-500 text-white"
                            : "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      data-testid={`pill-basket-${value.toLowerCase().replace(' ', '-')}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">Agent Rating</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Excellent', 'Good', 'Average', 'Poor'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setAgentRating(rating)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full transition",
                        agentRating === rating
                          ? rating === 'Excellent' || rating === 'Good' ? "bg-green-600 text-white"
                            : rating === 'Poor' ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      data-testid={`pill-rating-${rating.toLowerCase()}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Last Communication */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Communication History</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500">Last Contact</span>
                <span className={cn(
                  "text-sm font-medium",
                  daysSinceContact > 14 ? "text-red-500" : daysSinceContact > 7 ? "text-orange-500" : "text-green-600"
                )}>
                  {lastCommunicationDate === '-' ? 'Never' : `${daysSinceContact} days ago`}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500">Last Address</span>
                <span className="text-sm text-gray-700">-</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500">Last AA</span>
                <span className="text-sm text-gray-700">-</span>
              </div>
            </div>
          </div>

          {/* Next Steps - Smart Action Card */}
          <div className="bg-white rounded-lg border-2 border-yellow-400 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Next Step
              </h4>
              <button 
                className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded transition"
                data-testid="button-snooze"
              >
                Snooze
              </button>
            </div>
            
            {/* Smart Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">
                {relationshipStatus === 'Unknown' && "This is a new lead. Start the vetting process."}
                {relationshipStatus !== 'Unknown' && basket === 'Low Value' && "Low value agent. Send templated outreach."}
                {relationshipStatus !== 'Unknown' && basket !== 'Low Value' && daysSinceContact > 7 && `You haven't spoken to Jeremy in ${daysSinceContact} days.`}
                {relationshipStatus !== 'Unknown' && basket !== 'Low Value' && daysSinceContact <= 7 && "Agent is engaged. Keep the momentum."}
              </p>
            </div>

            {/* Primary Action Button */}
            <button 
              className={cn(
                "w-full py-3 text-sm font-semibold text-white rounded-lg transition mb-2",
                nextStep.color
              )}
              data-testid="button-next-step"
            >
              {nextStep.action}
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button 
                className="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                data-testid="button-log-call"
              >
                Log Call
              </button>
              <button 
                className="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-orange-500 transition"
                data-testid="button-set-reminder"
              >
                Set Reminder
              </button>
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

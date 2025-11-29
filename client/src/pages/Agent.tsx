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
  Bot,
  Clock,
  Linkedin,
  Facebook,
  Instagram
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
  const [showAddStep, setShowAddStep] = useState(false);
  const [customStep, setCustomStep] = useState('');
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [reminderDate, setReminderDate] = useState('11/29/2025');
  const [reminderTime, setReminderTime] = useState('11:30 AM');
  const [reminderCritical, setReminderCritical] = useState(false);
  const [reminderEmail, setReminderEmail] = useState(false);
  const [reminderText, setReminderText] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  
  // Action popups state
  const [iqReportLoading, setIqReportLoading] = useState(false);
  const [iqReportContent, setIqReportContent] = useState('');
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  
  const [nextSteps, setNextSteps] = useState([
    { id: 1, text: 'Run agent IQ reports', completed: false, tooltip: 'Generate AI-powered insights and analytics for this agent' },
    { id: 2, text: 'Call Agent', completed: false, tooltip: 'Make a phone call to discuss opportunities' },
    { id: 3, text: 'Update Agent Status', completed: false, tooltip: 'Change relationship status or agent rating' },
    { id: 4, text: 'Relationship Status -', completed: false, tooltip: 'Set the current relationship status with agent' },
    { id: 5, text: 'Set reminder', completed: false, tooltip: 'Schedule a follow-up reminder for this agent' },
  ]);

  const toggleStep = (id: number) => {
    setNextSteps(prev => {
      const updated = prev.map(step => 
        step.id === id ? { ...step, completed: !step.completed } : step
      );
      return [...updated.filter(s => !s.completed), ...updated.filter(s => s.completed)];
    });
  };

  const runIQReport = async () => {
    setIqReportLoading(true);
    setIqReportContent('');
    try {
      const response = await fetch('/api/ai/agent-iq-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentData: {
            agentName: 'Sarah Martinez',
            officeName: 'Keller Williams Realty',
            phone: '(323) 555-1234',
            email: 'sarah.martinez@kw.com',
            assignedUser: assignedUser,
            relationshipStatus: relationshipStatus,
            basket: basket,
            followUpStatus: followUpStatus || 'None',
            followUpDate: followUpDate || 'Not set',
            investorSourceCount: investorSourceCount,
            activeInLastTwoYears: activeInLast2Years,
          }
        })
      });
      const data = await response.json();
      setIqReportContent(data.report || 'Unable to generate report.');
    } catch (error) {
      setIqReportContent('Error generating report. Please try again.');
    }
    setIqReportLoading(false);
  };

  const handleStepAction = (stepText: string) => {
    switch (stepText) {
      case 'Run agent IQ reports':
        runIQReport();
        break;
      case 'Call Agent':
        setShowCallPopup(true);
        break;
      case 'Update Agent Status':
        setShowStatusDropdown(!showStatusDropdown);
        setShowRelationshipDropdown(false);
        break;
      case 'Relationship Status -':
        setShowRelationshipDropdown(!showRelationshipDropdown);
        setShowStatusDropdown(false);
        break;
      case 'Set reminder':
        setShowReminderPopup(true);
        break;
      default:
        break;
    }
  };

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
          {/* Top Row - Name, buttons, assigned user, do not call - ABOVE the line */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* IQ Icon */}
              <div className="flex items-center gap-1 px-3 py-2 bg-orange-500 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">iQ</span>
              </div>
              
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
              
              {/* Assigned User - next to red button */}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs font-medium text-gray-500">Assigned:</span>
                <select 
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
                  data-testid="select-assigned-user"
                >
                  <option>Michael May</option>
                  <option>Tony Fletcher</option>
                  <option>Sarah Johnson</option>
                </select>
              </div>
            </div>

            {/* Do Not Call - top right */}
            <div className="flex items-center gap-2">
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
          
          {/* Gray Line */}
          <div className="border-t border-gray-200 mb-4"></div>
          
          {/* Below the line - Contact and Metrics side by side on left */}
          <div className="flex items-start gap-12">
            {/* Contact info */}
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
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => window.open('https://www.linkedin.com/search/results/all/?keywords=Jeremy%20Flores%20Real%20Estate', '_blank')}
                  className="p-1.5 rounded-full hover:bg-blue-50 transition group"
                  title="Search on LinkedIn"
                  data-testid="icon-linkedin"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </button>
                <button 
                  onClick={() => window.open('https://www.facebook.com/search/top?q=Jeremy%20Flores%20Real%20Estate', '_blank')}
                  className="p-1.5 rounded-full hover:bg-blue-50 transition group"
                  title="Search on Facebook"
                  data-testid="icon-facebook"
                >
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-blue-700" />
                </button>
                <button 
                  onClick={() => window.open('https://www.instagram.com/explore/search/keyword/?q=Jeremy%20Flores%20Real%20Estate', '_blank')}
                  className="p-1.5 rounded-full hover:bg-pink-50 transition group"
                  title="Search on Instagram"
                  data-testid="icon-instagram"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
                </button>
                <button 
                  onClick={() => window.open('https://www.google.com/search?q=Jeremy%20Flores%20Real%20Estate%20Agent', '_blank')}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition group"
                  title="Search on Web"
                  data-testid="icon-web"
                >
                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </button>
              </div>
            </div>
            
            {/* Metrics - below Assigned dropdown */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>Active In Last 2 Years: <span className={activeInLast2Years ? "text-green-600 font-semibold" : "text-gray-400"}>{activeInLast2Years ? 'True' : 'False'}</span></span>
              <span>Average Deals Per Year: <span className={averageDealsPerYear > 0 ? "text-blue-600 font-semibold" : "text-gray-400"}>{averageDealsPerYear}</span></span>
              <span>Double Ended: <span className={doubleEnded > 0 ? "text-blue-600 font-semibold" : "text-gray-400"}>{doubleEnded}</span></span>
              <span>Investor Source: {investorSourceCount > 0 ? (
                <a 
                  href="https://nextjs-flipiq-agent.vercel.app/agents/AaronVillarreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                  data-testid="link-investor-source"
                >
                  {investorSourceCount}
                </a>
              ) : (
                <span className="text-gray-400">{investorSourceCount}</span>
              )}</span>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Next Steps:</span>
          {nextSteps.map((step) => (
            <div key={step.id} className="group relative">
              <div 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition text-xs ${
                  step.completed 
                    ? 'bg-gray-100 text-gray-400 line-through' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={step.completed}
                  onChange={() => toggleStep(step.id)}
                  className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  data-testid={`checkbox-step-${step.id}`}
                />
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!step.completed) {
                      handleStepAction(step.text);
                    }
                  }}
                  className="hover:underline"
                >
                  {step.text === 'Relationship Status -' ? `Relationship Status - ${relationshipStatus}` : step.text}
                </span>
              </div>
              
              {/* Inline Status Dropdown */}
              {step.text === 'Update Agent Status' && showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                  {['Unknown', 'Priority', 'Hot', 'Warm', 'Cold'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${agentRating === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      onClick={() => {
                        setAgentRating(status);
                        setShowStatusDropdown(false);
                        toggleStep(step.id);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Inline Relationship Dropdown */}
              {step.text === 'Relationship Status -' && showRelationshipDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                  {['Unknown', 'Priority', 'Hot', 'Warm', 'Cold'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${relationshipStatus === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      onClick={() => {
                        setRelationshipStatus(status);
                        setShowRelationshipDropdown(false);
                        toggleStep(step.id);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                {step.tooltip}
              </div>
            </div>
          ))}
          <div className="relative">
            <button 
              className="text-xs text-blue-600 hover:underline" 
              data-testid="button-add-step"
              onClick={() => setShowAddStep(!showAddStep)}
            >
              + Add
            </button>
            {showAddStep && (
              <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[220px] z-50">
                <div className="space-y-1 mb-3">
                  {['Send follow-up email', 'Schedule property tour', 'Send market analysis', 'Request referral'].map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1.5 rounded">
                      <input type="checkbox" className="w-3 h-3 rounded border-gray-300" />
                      {item}
                    </label>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <input 
                    type="text"
                    placeholder="Custom step..."
                    value={customStep}
                    onChange={(e) => setCustomStep(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2"
                    data-testid="input-custom-step"
                  />
                  <button 
                    className="w-full px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
                    onClick={() => setShowAddStep(false)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
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

        {/* iQ Report Section - Shows when report is loading or has content */}
        {(iqReportLoading || iqReportContent) && (
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Agent iQ Report</h3>
                  <p className="text-xs text-gray-500">AI-Powered Analysis for Sarah Martinez</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => runIQReport()}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-1.5"
                  disabled={iqReportLoading}
                  data-testid="button-regenerate-iq"
                >
                  <RefreshCw className={`w-3 h-3 ${iqReportLoading ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
                <button 
                  onClick={() => setIqReportContent('')}
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  data-testid="button-close-iq-inline"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            {iqReportLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-600">Generating AI report...</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {iqReportContent}
                </div>
              </div>
            )}
          </div>
        )}

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

      {/* Reminder Popup */}
      {showReminderPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reminder</h3>
                <p className="text-sm text-gray-500">1119 Calzona Street</p>
              </div>
              <button 
                onClick={() => setShowReminderPopup(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
                data-testid="button-close-reminder"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
                      data-testid="input-reminder-date"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8"
                      data-testid="input-reminder-time"
                    />
                    <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Quick Time Buttons */}
              <div className="flex gap-2 mb-4">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  10 Mins
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  30 Mins
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  1 Hour
                </button>
              </div>

              {/* Critical Checkbox */}
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={reminderCritical}
                  onChange={(e) => setReminderCritical(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                  data-testid="checkbox-reminder-critical"
                />
                <span className="text-sm text-gray-700">Critical</span>
              </label>

              {/* Notification Methods */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Methods</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                      data-testid="checkbox-reminder-email"
                    />
                    <span className="text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={reminderText}
                      onChange={(e) => setReminderText(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                      data-testid="checkbox-reminder-text"
                    />
                    <span className="text-sm text-gray-700">Text</span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  placeholder="Enter your message here..."
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[200px] resize-none"
                  data-testid="textarea-reminder-message"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
              <button 
                onClick={() => setShowReminderPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                data-testid="button-cancel-reminder"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowReminderPopup(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                data-testid="button-save-reminder"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Agent Popup */}
      {showCallPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Call Agent</h3>
              <button 
                onClick={() => setShowCallPopup(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
                data-testid="button-close-call"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Sarah Martinez</h4>
                <p className="text-sm text-gray-500">Keller Williams Realty</p>
              </div>
              
              <div className="space-y-3">
                <a 
                  href="tel:+13235551234"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  data-testid="button-call-primary"
                >
                  <Phone className="w-5 h-5" />
                  Call (323) 555-1234
                </a>
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  data-testid="button-call-secondary"
                >
                  <Phone className="w-5 h-5" />
                  Call Office: (323) 555-5678
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Log this call automatically</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
              <button 
                onClick={() => setShowCallPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Agent() {
  return <AgentContent />;
}

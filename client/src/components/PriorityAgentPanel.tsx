import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessagesSquare,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  MessageSquare,
  Building2,
  FileText,
  X,
  Search,
  Filter,
  Paperclip,
  Voicemail,
  Lightbulb,
  Mic,
  Linkedin,
  Facebook,
  Instagram,
  Globe,
  Plus
} from 'lucide-react';

interface PriorityAgentData {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  assignedUser: string;
  lastCommunicationDate?: string;
  lastAddressDiscussed?: string;
  lastCommunicatedAA?: string;
  activeInLast2Years?: boolean;
  averageDealsPerYear?: number;
  doubleEnded?: number;
  investorSource?: number;
  relationshipStatus?: string;
  agentRating?: string;
  basket?: string;
  followUpStatus?: string;
  followUpDate?: string;
}

interface PriorityAgentPanelProps {
  agent: PriorityAgentData;
  currentIndex: number;
  totalAgents: number;
  onPrevious: () => void;
  onNext: () => void;
  onCallNow?: () => void;
  onSendText?: () => void;
  onSendEmail?: () => void;
  onAgentIQReport?: () => void;
}

export default function PriorityAgentPanel({
  agent,
  currentIndex,
  totalAgents,
  onPrevious,
  onNext,
  onCallNow,
  onSendText,
  onSendEmail,
  onAgentIQReport
}: PriorityAgentPanelProps) {
  const [relationshipStatus, setRelationshipStatus] = useState(agent.relationshipStatus || 'Unknown');
  const [agentRating, setAgentRating] = useState(agent.agentRating || 'Unknown');
  const [basket, setBasket] = useState(agent.basket || 'Low Value');
  const [followUpStatus, setFollowUpStatus] = useState(agent.followUpStatus || '');
  const [followUpDate, setFollowUpDate] = useState(agent.followUpDate || '');
  const [assignedUser, setAssignedUser] = useState(agent.assignedUser || 'Unassigned');
  const [doNotCall, setDoNotCall] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showAddStep, setShowAddStep] = useState(false);
  const [customStep, setCustomStep] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [iqReportLoading, setIqReportLoading] = useState(false);
  const [iqReportContent, setIqReportContent] = useState('');
  const [activeInfoTab, setActiveInfoTab] = useState('general');
  const [activeNotesTab, setActiveNotesTab] = useState('notes');
  const [hideEmptyFields, setHideEmptyFields] = useState(true);

  const lastCommDate = agent.lastCommunicationDate || 'N/A';
  const lastAddress = agent.lastAddressDiscussed || 'N/A';
  const lastCommAA = agent.lastCommunicatedAA || agent.assignedUser || 'N/A';
  const activeIn2Years = agent.activeInLast2Years ?? false;
  const avgDeals = agent.averageDealsPerYear ?? 0;
  const doubleEnded = agent.doubleEnded ?? 0;
  const investorSrc = agent.investorSource ?? 0;

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
    if (onAgentIQReport) {
      onAgentIQReport();
      return;
    }
    setIqReportLoading(true);
    setIqReportContent('');
    try {
      const response = await fetch('/api/ai/agent-iq-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentData: {
            agentName: agent.name,
            officeName: agent.company,
            phone: agent.phone,
            email: agent.email,
            assignedUser: assignedUser,
            relationshipStatus: relationshipStatus,
            basket: basket,
            followUpStatus: followUpStatus || 'None',
            followUpDate: followUpDate || 'Not set',
            investorSourceCount: investorSrc,
            activeInLastTwoYears: activeIn2Years,
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
        onCallNow?.();
        break;
      case 'Update Agent Status':
        setShowStatusDropdown(!showStatusDropdown);
        setShowRelationshipDropdown(false);
        break;
      case 'Relationship Status -':
        setShowRelationshipDropdown(!showRelationshipDropdown);
        setShowStatusDropdown(false);
        break;
      default:
        break;
    }
  };

  const infoTabs = [
    { id: 'general', label: 'General' },
    { id: 'agent-365', label: 'Agent 365 Report' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'crm', label: 'CRM' },
    { id: 'other-fields', label: 'Other Fields' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Priority Agent Header with Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition",
              currentIndex === 0 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
            data-testid="button-prev-agent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Agent
          </button>
          
          <h3 className="text-lg font-bold text-gray-900">
            Priority Agent {currentIndex + 1} of {totalAgents}
          </h3>
          
          <button 
            onClick={onNext}
            disabled={currentIndex === totalAgents - 1}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm",
              currentIndex === totalAgents - 1 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 animate-pulse"
            )}
            data-testid="button-next-agent"
          >
            Next Agent
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Agent Profile Card */}
      <div className="p-6">
        {/* Top Row - Name, buttons, assigned user, do not call */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { onAgentIQReport?.(); runIQReport(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition shadow-sm"
              data-testid="button-agent-name-iq"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              iQ
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
            <button className="p-1 hover:bg-gray-100 rounded transition">
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
            <div className="relative">
              <button 
                className="p-1 hover:bg-gray-100 rounded transition" 
                data-testid="button-priority-agent-menu"
                onClick={() => setShowAgentMenu(!showAgentMenu)}
              >
                <MessagesSquare className="w-4 h-4 text-red-500" />
              </button>
              {showAgentMenu && (
                <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => { onCallNow?.(); setShowAgentMenu(false); }}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => { onSendText?.(); setShowAgentMenu(false); }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Text
                  </button>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => { onSendEmail?.(); setShowAgentMenu(false); }}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Mic className="w-4 h-4" />
                    Text Voicemail
                  </button>
                </div>
              )}
            </div>
            
            {/* Assigned User */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs font-medium text-gray-500">Assigned:</span>
              <select 
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
                data-testid="select-priority-assigned-user"
              >
                <option>Michael May</option>
                <option>Tony Fletcher</option>
                <option>Sarah Johnson</option>
                <option>Josh Santos</option>
              </select>
            </div>
          </div>

          {/* Do Not Call */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={doNotCall}
                onChange={(e) => setDoNotCall(e.target.checked)}
                className="sr-only peer"
                data-testid="toggle-priority-do-not-call"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm text-gray-600">Do Not Call</span>
          </div>
        </div>
        
        {/* Gray Line */}
        <div className="border-t border-gray-200 mb-4"></div>
        
        {/* Three columns: Agent Record, Last Communication, Performance */}
        <div className="grid grid-cols-3 gap-8">
          {/* Agent Record */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Agent Record</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="underline">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{agent.company}</span>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(agent.name)} Real Estate`, '_blank')}
                  className="p-1.5 rounded-full hover:bg-blue-50 transition group"
                  title="Search on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/search/top?q=${encodeURIComponent(agent.name)} Real Estate`, '_blank')}
                  className="p-1.5 rounded-full hover:bg-blue-50 transition group"
                  title="Search on Facebook"
                >
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-blue-700" />
                </button>
                <button 
                  onClick={() => window.open(`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(agent.name)} Real Estate`, '_blank')}
                  className="p-1.5 rounded-full hover:bg-pink-50 transition group"
                  title="Search on Instagram"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(agent.name)} Real Estate Agent`, '_blank')}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition group"
                  title="Search on Web"
                >
                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Last Communication */}
          <div className="mx-auto">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Last Communication</h4>
            <div className="space-y-1.5 text-sm">
              <div>
                <span className="text-gray-500">Last Communication Date: </span>
                <span className="font-medium text-gray-700">{lastCommDate}</span>
              </div>
              <div className="whitespace-nowrap">
                <span className="text-gray-500">Last Address Discussed: </span>
                <span className="font-medium text-gray-700">{lastAddress}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Communicated AA: </span>
                <span className="font-medium text-gray-700">{lastCommAA}</span>
              </div>
            </div>
          </div>
          
          {/* Performance */}
          <div className="ml-auto">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Performance</h4>
            <div className="space-y-1.5 text-sm">
              <div>
                <span className="text-gray-500">Active In Last 2 Years: </span>
                <span className={activeIn2Years ? "text-green-600 font-semibold" : "text-gray-400"}>{activeIn2Years ? 'True' : 'False'}</span>
              </div>
              <div>
                <span className="text-gray-500">Average Deals Per Year: </span>
                <span className={avgDeals > 0 ? "text-blue-600 font-semibold" : "text-gray-400"}>{avgDeals}</span>
              </div>
              <div>
                <span className="text-gray-500">Double Ended: </span>
                <span className={doubleEnded > 0 ? "text-blue-600 font-semibold" : "text-gray-400"}>{doubleEnded}</span>
              </div>
              <div>
                <span className="text-gray-500">Investor Source: </span>
                {investorSrc > 0 ? (
                  <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                    {investorSrc}
                  </span>
                ) : (
                  <span className="text-gray-400">{investorSrc}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-semibold text-orange-500 uppercase tracking-wide ${nextSteps.some(step => !step.completed) ? 'animate-pulse' : ''}`}>Next Steps:</span>
          {nextSteps.map((step) => (
            <div key={step.id} className="group relative">
              <button 
                onClick={(e) => {
                  if (!step.completed) {
                    handleStepAction(step.text);
                  } else {
                    toggleStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all text-sm font-medium shadow-sm ${
                  step.completed 
                    ? 'bg-gray-100 text-gray-400 line-through border border-gray-200' 
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 hover:shadow-md border border-gray-200 active:scale-95'
                }`}
                data-testid={`priority-chip-step-${step.id}`}
              >
                <input 
                  type="checkbox" 
                  checked={step.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleStep(step.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded-full border-2 border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span>
                  {step.text === 'Relationship Status -' ? `Relationship Status - ${relationshipStatus}` : step.text}
                </span>
              </button>
              
              {/* Inline Status Dropdown */}
              {step.text === 'Update Agent Status' && showStatusDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[160px] z-50">
                  {['Unknown', 'Priority', 'Hot', 'Warm', 'Cold'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition ${agentRating === status ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}
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
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[160px] z-50">
                  {['Unknown', 'Priority', 'Hot', 'Warm', 'Cold'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition ${relationshipStatus === status ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}
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
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 shadow-lg">
                {step.tooltip}
              </div>
            </div>
          ))}
          
          {/* Add Button */}
          <div className="relative">
            <button 
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all hover:shadow-sm active:scale-95" 
              data-testid="priority-button-add-step"
              onClick={() => setShowAddStep(!showAddStep)}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            {showAddStep && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[240px] z-50">
                <div className="space-y-2 mb-3">
                  {['Send follow-up email', 'Schedule property tour', 'Send market analysis', 'Request referral'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      {item}
                    </label>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <input 
                    type="text"
                    placeholder="Custom step..."
                    value={customStep}
                    onChange={(e) => setCustomStep(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  <button 
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition active:scale-98"
                    onClick={() => setShowAddStep(false)}
                  >
                    Add Step
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section - Status & Follow Up */}
      <div className="grid grid-cols-2 gap-6 px-6 pb-6">
        {/* Agent Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Agent Status</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Relationship Status</label>
              <select 
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
                className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:border-orange-500 focus:ring-0 outline-none"
                data-testid="priority-select-relationship-status"
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
                className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:border-orange-500 focus:ring-0 outline-none"
                data-testid="priority-select-agent-rating"
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
                className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:border-orange-500 focus:ring-0 outline-none"
                data-testid="priority-select-basket"
              >
                <option>Low Value</option>
                <option>High Value</option>
                <option>Clients</option>
              </select>
            </div>
          </div>
        </div>

        {/* Follow Up */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Follow Up</h4>
            <button 
              className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition"
              data-testid="priority-button-set-reminder"
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
                className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:border-orange-500 focus:ring-0 outline-none"
                data-testid="priority-select-followup-status"
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
                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Select date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full border-0 border-b border-gray-200 pl-6 pr-0 py-2 text-sm bg-transparent focus:border-orange-500 focus:ring-0 outline-none"
                  data-testid="priority-input-followup-date"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Info Details */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Agent Info Details</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox"
                checked={hideEmptyFields}
                onChange={(e) => setHideEmptyFields(e.target.checked)}
                className="sr-only peer"
                data-testid="priority-toggle-hide-empty"
              />
              <div className={`w-9 h-5 rounded-full transition ${hideEmptyFields ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${hideEmptyFields ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
            <span className="text-sm text-gray-600">Hide Empty Fields</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          {infoTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveInfoTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition",
                activeInfoTab === tab.id 
                  ? "text-blue-600 bg-white border border-blue-200"
                  : "text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100"
              )}
              data-testid={`priority-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* iQ Report Section - Shows when report is loading or has content */}
      {(iqReportLoading || iqReportContent) && (
        <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Agent iQ Report</h3>
                <p className="text-xs text-gray-500">AI-Powered Analysis for {agent.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => runIQReport()}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-1.5"
                disabled={iqReportLoading}
              >
                <RefreshCw className={`w-3 h-3 ${iqReportLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button 
                onClick={() => setIqReportContent('')}
                className="p-1.5 hover:bg-gray-100 rounded transition"
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
      <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200">
        {/* Tab Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveNotesTab('notes')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition",
                activeNotesTab === 'notes'
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-500 bg-gray-50 border border-gray-200"
              )}
              data-testid="priority-tab-notes"
            >
              <FileText className="w-4 h-4" />
              Notes
            </button>
            <button 
              onClick={() => setActiveNotesTab('emails')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition",
                activeNotesTab === 'emails'
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-500 bg-gray-50 border border-gray-200"
              )}
            >
              <Mail className="w-4 h-4" />
              Emails
              <span className="text-xs text-gray-400">Soon</span>
            </button>
            <button 
              onClick={() => setActiveNotesTab('sms')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition",
                activeNotesTab === 'sms'
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-500 bg-gray-50 border border-gray-200"
              )}
            >
              <Phone className="w-4 h-4" />
              SMS
              <span className="text-xs text-gray-400">Soon</span>
            </button>
            <button 
              onClick={() => setActiveNotesTab('voicemail')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition",
                activeNotesTab === 'voicemail'
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-500 bg-gray-50 border border-gray-200"
              )}
            >
              <Voicemail className="w-4 h-4" />
              Voicemail
              <span className="text-xs text-gray-400">Soon</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Text Input Area */}
        <div className="p-4 border-b border-gray-200">
          <textarea 
            placeholder="Start Typing"
            className="w-full h-24 p-3 text-sm text-gray-700 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="priority-textarea-note"
          />
          <div className="flex items-center justify-end gap-4 mt-3">
            <button className="p-1.5 hover:bg-gray-100 rounded transition">
              <Paperclip className="w-4 h-4 text-gray-400" />
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              Communication
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              Critical
            </label>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition" data-testid="priority-button-post-note">
              Post Note
            </button>
          </div>
        </div>
        
        </div>

      </div>
  );
}

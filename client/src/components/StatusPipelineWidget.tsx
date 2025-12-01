import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusItem {
  percent: number;
  label: string;
}

interface StatusCategory {
  name: string;
  items: StatusItem[];
}

const statusData: StatusCategory[] = [
  {
    name: 'New Lead',
    items: [
      { percent: 0, label: 'None' },
      { percent: 10, label: 'Initial Contact Started' },
    ],
  },
  {
    name: 'Working / Nurture',
    items: [
      { percent: 20, label: 'Continue to Follow Up' },
      { percent: 30, label: 'Back Up' },
    ],
  },
  {
    name: 'Offer Sent',
    items: [
      { percent: 30, label: 'Offer Terms Sent' },
      { percent: 50, label: 'Contract Submitted' },
    ],
  },
  {
    name: 'In Negotiation',
    items: [
      { percent: 60, label: 'In Negotiations' },
    ],
  },
  {
    name: 'Under Contract',
    items: [
      { percent: 80, label: 'Offer Accepted' },
    ],
  },
  {
    name: 'Acquired',
    items: [
      { percent: 100, label: 'Acquired' },
    ],
  },
  {
    name: 'Lost / Do Not Pursue',
    items: [
      { percent: 0, label: 'Pass' },
      { percent: 0, label: 'Sold Others/Closed' },
      { percent: 0, label: 'Cancelled FEC' },
      { percent: 0, label: 'DO NOT USE' },
    ],
  },
];

const pipelineStages = [
  { id: 'new-lead', name: 'New Lead', minPercent: 0, maxPercent: 10 },
  { id: 'working', name: 'Working', minPercent: 20, maxPercent: 30 },
  { id: 'offer', name: 'Offer', minPercent: 30, maxPercent: 50 },
  { id: 'negotiation', name: 'Negotiation', minPercent: 60, maxPercent: 60 },
  { id: 'under-contract', name: 'Under Contract', minPercent: 80, maxPercent: 80 },
  { id: 'acquired', name: 'Acquired', minPercent: 100, maxPercent: 100 },
];

function getToDoAction(percent: number, label: string): string {
  if (label === 'Pass' || label === 'Sold Others/Closed' || label === 'Cancelled FEC' || label === 'DO NOT USE') {
    return 'Archive File';
  }
  if (percent <= 10) {
    return 'Review photos & comps';
  }
  if (percent <= 30) {
    return 'Calculate MAO (Max Allowable Offer)';
  }
  if (percent === 50) {
    return 'Await feedback';
  }
  if (percent === 60) {
    return 'Finalize terms or Counter';
  }
  if (percent === 80) {
    return 'Open Escrow';
  }
  if (percent === 100) {
    return 'Start Rehab';
  }
  return 'Review deal status';
}

function getCurrentStageIndex(percent: number, label: string): number {
  if (label === 'Pass' || label === 'Sold Others/Closed' || label === 'Cancelled FEC' || label === 'DO NOT USE') {
    return -1;
  }
  for (let i = pipelineStages.length - 1; i >= 0; i--) {
    if (percent >= pipelineStages[i].minPercent) {
      return i;
    }
  }
  return 0;
}

interface StatusPipelineWidgetProps {
  currentPercent?: number;
  currentLabel?: string;
  onStatusChange?: (percent: number, label: string) => void;
}

export default function StatusPipelineWidget({
  currentPercent = 0,
  currentLabel = 'None',
  onStatusChange,
}: StatusPipelineWidgetProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState(currentPercent);
  const [selectedLabel, setSelectedLabel] = useState(currentLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (percent: number, label: string) => {
    setSelectedPercent(percent);
    setSelectedLabel(label);
    setIsDropdownOpen(false);
    onStatusChange?.(percent, label);
  };

  const toDoAction = getToDoAction(selectedPercent, selectedLabel);
  const currentStageIndex = getCurrentStageIndex(selectedPercent, selectedLabel);

  return (
    <div className="relative inline-flex flex-col items-end" ref={dropdownRef}>
      {/* Status Pill */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full",
          "text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
        )}
        data-testid="status-pipeline-pill"
      >
        <span className="text-gray-900 font-semibold">{selectedPercent}%</span>
        <span>{selectedLabel}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isDropdownOpen && "rotate-180")} />
      </button>

      {/* Next Step Indicator */}
      <div
        className="relative mt-1.5"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        ref={tooltipRef}
      >
        <span className="text-xs text-orange-500 font-medium cursor-pointer hover:text-orange-600 transition">
          Next Step: {toDoAction}
        </span>

        {/* Tooltip/Popover */}
        {isTooltipOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pipeline Progress</h4>
            <div className="space-y-2">
              {pipelineStages.map((stage, index) => {
                const isCompleted = currentStageIndex > index;
                const isCurrent = currentStageIndex === index;
                const isLost = currentStageIndex === -1;

                return (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex items-center gap-3 py-1.5 px-2 rounded",
                      isCurrent && "bg-blue-50",
                      isCompleted && "opacity-70"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full border-2",
                      isCompleted ? "bg-green-500 border-green-500" : 
                      isCurrent ? "bg-blue-500 border-blue-500" : 
                      "bg-white border-gray-300"
                    )}>
                      {isCompleted && <Check className="w-3 h-3 text-white" />}
                      {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className={cn(
                      "text-sm",
                      isCurrent ? "font-bold text-blue-700" :
                      isCompleted ? "text-gray-500 line-through" :
                      "text-gray-600"
                    )}>
                      {stage.name}
                    </span>
                    {isCompleted && (
                      <span className="ml-auto text-xs text-green-600 font-medium">Completed</span>
                    )}
                    {isCurrent && (
                      <span className="ml-auto text-xs text-blue-600 font-medium">Current</span>
                    )}
                  </div>
                );
              })}
              {currentStageIndex === -1 && (
                <div className="flex items-center gap-3 py-1.5 px-2 rounded bg-red-50">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 border-2 border-red-500">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <span className="text-sm font-bold text-red-700">Lost / Do Not Pursue</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-orange-500">To Do:</span> {toDoAction}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
          {statusData.map((category, catIndex) => (
            <div key={catIndex} className="mb-1">
              {/* Category Header - Not Clickable */}
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-50">
                {category.name}
              </div>
              {/* Status Items - Clickable */}
              {category.items.map((item, itemIndex) => {
                const isSelected = selectedPercent === item.percent && selectedLabel === item.label;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => handleStatusSelect(item.percent, item.label)}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition",
                      isSelected 
                        ? "bg-orange-50 text-orange-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    data-testid={`status-option-${item.percent}-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span className="w-8 text-right font-semibold text-gray-500">{item.percent}%</span>
                    <span className="flex-1">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

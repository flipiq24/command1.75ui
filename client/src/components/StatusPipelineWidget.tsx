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
  { id: 'new-lead', name: 'New Lead', range: '(0-10%)' },
  { id: 'working', name: 'Working', range: '(20%)' },
  { id: 'offer', name: 'Offer Sent', range: '(30-50%)' },
  { id: 'negotiation', name: 'In Negotiation', range: '(60%)' },
  { id: 'under-contract', name: 'Under Contract', range: '(80%)' },
  { id: 'acquired', name: 'Acquired', range: '(100%)' },
];

function getCurrentStageIndex(percent: number, label: string): number {
  if (label === 'Pass' || label === 'Sold Others/Closed' || label === 'Cancelled FEC' || label === 'DO NOT USE') {
    return -1;
  }
  if (percent <= 10) return 0;
  if (percent === 20) return 1;
  if (percent >= 30 && percent <= 50) return 2;
  if (percent === 60) return 3;
  if (percent === 80) return 4;
  if (percent === 100) return 5;
  return 0;
}

interface StatusPipelineWidgetProps {
  currentPercent?: number;
  currentLabel?: string;
  toDo?: string;
  onStatusChange?: (percent: number, label: string) => void;
}

export default function StatusPipelineWidget({
  currentPercent = 0,
  currentLabel = 'None',
  toDo = 'Not set',
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
        <span className="text-blue-600 font-semibold">{selectedPercent}%</span>
        <span className="text-gray-700">{selectedLabel}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
      </button>

      {/* Next Step Indicator */}
      <div
        className="relative mt-1.5"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        ref={tooltipRef}
      >
        <span className="text-xs cursor-pointer transition">
          <span className="text-orange-500 font-bold">Next Steps:</span>
          <span className="text-gray-600 ml-1">{toDo}</span>
        </span>

        {/* Tooltip/Popover - Elongated */}
        {isTooltipOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
            {/* Current Status Display */}
            <div className="mb-3 pb-3 border-b border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Current Status</div>
              <div className="text-sm font-semibold text-gray-900">{selectedPercent}% {selectedLabel}</div>
            </div>
            
            {/* Pipeline Stages */}
            <div className="space-y-1">
              {pipelineStages.map((stage, index) => {
                const isCompleted = currentStageIndex > index;
                const isCurrent = currentStageIndex === index;

                return (
                  <div key={stage.id}>
                    <div className="flex items-center gap-3 py-1.5">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm flex-1",
                        isCurrent ? "font-medium text-blue-600" : "text-gray-600"
                      )}>
                        {stage.name} {stage.range}
                      </span>
                    </div>
                    
                    {/* Current stage details */}
                    {isCurrent && (
                      <div className="ml-7 py-2 px-3 bg-blue-50 rounded-md space-y-1 mb-1">
                        <p className="text-xs text-gray-700">
                          <span className="text-gray-500">Current Status:</span> {selectedPercent}% {selectedLabel}
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="text-gray-500">Next Action:</span> {toDo}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
                    <span className="w-8 text-right font-semibold text-blue-600">{item.percent}%</span>
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

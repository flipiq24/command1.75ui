import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle } from "lucide-react";

export type DealType = "hot" | "warm" | "cold" | "new";

interface ActionItem {
  id: DealType;
  label: string;
  count: number;
  total: number;
  color: string;
  buttonText: string;
  tooltipTitle: string;
  tooltipText: string;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: "hot",
    label: "High Priority",
    count: 0,
    total: 2,
    color: "#ef4444", // red-500
    buttonText: "Call High Priority",
    tooltipTitle: "High Priority (Work First)",
    tooltipText:
      "Logic: High probability to close. The agent is responsive, or we are in active negotiations.\n\nInstruction: These are your immediate money-making opportunities. Focus here first.",
  },
  {
    id: "warm",
    label: "Medium Priority",
    count: 1,
    total: 1,
    color: "#f59e0b", // amber-500
    buttonText: "Review Medium Priority",
    tooltipTitle: "Medium Priority (Work Second)",
    tooltipText:
      "Logic: Viable potential. The agent is engaged, but the deal requires nurturing, feedback, or time.\n\nInstruction: These are your pipeline builders. Focus here after clearing High Priority items.",
  },
  {
    id: "cold",
    label: "Low Priority",
    count: 0,
    total: 1,
    color: "#3b82f6", // blue-500
    buttonText: "Open Low Priority",
    tooltipTitle: "Low Priority (Work Last)",
    tooltipText:
      "Logic: Low probability right now. The agent is unresponsive, or there is a wide price gap.\n\nInstruction: Keep these alive, but do not let them distract you. Focus here last or when time permits.",
  },
  {
    id: "new",
    label: "New Deals",
    count: 56,
    total: 3,
    color: "#6b7280", // gray-500
    buttonText: "Process New Deals",
    tooltipTitle: "New Deals",
    tooltipText:
      'These are new incoming deals that do not have a priority assigned yet (High, Medium, Low) or are offer status "None". They need to be reviewed and categorized.',
  },
];

const CircularProgress = ({
  count,
  total,
  color,
  size = 120,
  strokeWidth = 10,
}: {
  count: number;
  total: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total === 0 ? 0 : count / total;
  const dashOffset = circumference - progress * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // gray-200
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Inner Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">
          {count}
          <span className="text-gray-400 text-lg">/{total}</span>
        </span>
      </div>
    </div>
  );
};

interface ActionPlanProps {
  onFilterChange?: (filter: DealType | "goal" | "completed" | null) => void;
  activeFilter?: DealType | "goal" | "completed" | null;
  completionPercent?: number;
  userName?: string;
  onMilestoneComplete?: () => void;
}

export default function ActionPlan({
  onFilterChange,
  activeFilter,
  completionPercent = 32,
  userName = "Tony",
  onMilestoneComplete,
}: ActionPlanProps) {
  const [hoveredId, setHoveredId] = useState<DealType | null>(null);
  const [goalTooltipOpen, setGoalTooltipOpen] = useState(false);
  const [relationshipTooltipOpen, setRelationshipTooltipOpen] = useState(false);

  const getHeaderText = () => {
    switch (activeFilter) {
      case "hot":
        return "Today's High Priority Deals!";
      case "warm":
        return "Today's Mid Priority Deals!";
      case "cold":
        return "Today's Low Priority Deals!";
      case "new":
        return "Today's New Deals!";
      default:
        return "Today's Deal Review Plan!";
    }
  };

  const handleFilterClick = (filter: DealType | "goal" | "completed") => {
    if (onFilterChange) {
      if (activeFilter === filter) {
        onFilterChange(null);
      } else {
        onFilterChange(filter);
      }
    }
  };

  const handleNewDealsClick = () => {
    if (completionPercent >= 100 && onMilestoneComplete) {
      onMilestoneComplete();
    } else {
      handleFilterClick("new");
    }
  };

  return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Nov 27, 2025 — {getHeaderText()}
            </h2>
          </div>

          <div className="space-y-2">
            <div
              className={cn(
                "flex items-center gap-1.5 group relative w-fit cursor-pointer transition-opacity hover:opacity-80 z-20",
                activeFilter === "completed" &&
                  "ring-2 ring-[#FF6600] ring-offset-2 rounded px-2 bg-orange-50 -ml-2",
              )}
              onClick={() => handleFilterClick("completed")}
            >
              <p className="text-sm text-gray-500 font-medium">
                You have completed{" "}
                <span className="font-bold text-[#FF6600]">{completionPercent}%</span> of today's
                follow-ups.
              </p>
              <Info className="w-3.5 h-3.5 text-gray-400" />

              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-left leading-relaxed">
                <p className="mb-2">
                  This tracks your contact progress on{" "}
                  <strong>Hot, Warm, and Cold</strong> deals.
                </p>
                <hr className="border-gray-700 my-2" />
                <p className="text-gray-300">
                  To hit{" "}
                  <strong className="text-[#FF6600]">
                    100% Daily Completion
                  </strong>
                  , you must finish these follow-ups <strong>AND</strong> meet
                  your Daily Offer Goal.
                </p>
              </div>
            </div>

            <div className="w-full max-w-md bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF6600] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="text-right relative">
          <div
            className="inline-flex items-center gap-1.5 cursor-help"
            onMouseEnter={() => setGoalTooltipOpen(true)}
            onMouseLeave={() => setGoalTooltipOpen(false)}
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Daily Offer Goal
            </span>
            <Info className="w-3 h-3 text-gray-400" />
          </div>

          {/* Daily Goal Tooltip */}
          <div
            className={cn(
              "absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-30 transition-all duration-200 pointer-events-none text-left text-xs leading-relaxed",
              goalTooltipOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2",
            )}
          >
            <div className="font-bold text-white mb-2 text-sm">
              Monthly Goal: 100+ Offers
            </div>
            <p className="text-gray-300 mb-4">
              Submit a combination of Offer Terms and Contracts to hit your
              target of 2 closed deals per month.
            </p>

            <div className="space-y-2 mb-4">
              <div>
                <span className="font-bold text-gray-300">• 1st Number:</span>{" "}
                <span className="text-gray-400">Offers made today.</span>
              </div>
              <div>
                <span className="font-bold text-gray-300">• 2nd Number:</span>{" "}
                <span className="text-gray-400">Your daily goal.</span>
              </div>
            </div>

            <div className="text-gray-400 italic border-t border-gray-700 pt-2 mt-2">
              Click to filter and see the offers you made today.
            </div>
          </div>

          <div
            className={cn(
              "flex items-baseline justify-end gap-1 cursor-pointer transition-opacity hover:opacity-80",
              activeFilter === "goal" &&
                "ring-2 ring-[#FF6600] ring-offset-2 rounded px-2 bg-orange-50",
            )}
            onClick={() => handleFilterClick("goal")}
          >
            <span className="text-4xl font-black text-[#FF6600]">1</span>
            <span className="text-2xl font-bold text-[#FF6600]">/ 3</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Offers Made</div>
        </div>

        {/* New Agent Relationships Section */}
        <div className="text-right relative border-l border-gray-200 pl-6">
          <div
            className="inline-flex items-center gap-1.5 cursor-help"
            onMouseEnter={() => setRelationshipTooltipOpen(true)}
            onMouseLeave={() => setRelationshipTooltipOpen(false)}
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              New Agent Relationships
            </span>
            <Info className="w-3 h-3 text-gray-400" />
          </div>

          {/* Relationship Tooltip */}
          <div
            className={cn(
              "absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-30 transition-all duration-200 pointer-events-none text-left text-xs leading-relaxed",
              relationshipTooltipOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2",
            )}
          >
            <div className="font-bold text-white mb-2 text-sm">
              Weekly Goal: 5 New Agent Relationships
            </div>
            <p className="text-gray-300 mb-4">
              Build new connections with agents to expand your deal pipeline and increase your chances of closing more deals.
            </p>

            <div className="space-y-2 mb-4">
              <div>
                <span className="font-bold text-gray-300">• 1st Number:</span>{" "}
                <span className="text-gray-400">Relationships built this week.</span>
              </div>
              <div>
                <span className="font-bold text-gray-300">• 2nd Number:</span>{" "}
                <span className="text-gray-400">Your weekly goal.</span>
              </div>
            </div>

            <div className="text-gray-400 italic border-t border-gray-700 pt-2 mt-2">
              Click to view your new agent relationships.
            </div>
          </div>

          <div
            className="flex items-baseline justify-end gap-1 cursor-pointer transition-opacity hover:opacity-80 mt-1"
          >
            <span className="text-4xl font-black text-blue-600">1</span>
            <span className="text-2xl font-bold text-blue-600">/5</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Relationships Built</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ACTION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip */}
            <div
              className={cn(
                "absolute -top-32 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-20 transition-all duration-200 pointer-events-none text-center",
                hoveredId === item.id
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              )}
            >
              <div className="font-bold text-white mb-1">
                {item.tooltipTitle}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {item.tooltipText}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
            </div>

            {/* Circle */}
            <div
              className={cn(
                "mb-4 relative cursor-pointer transition-transform hover:scale-105",
                activeFilter === item.id && "ring-4 ring-offset-2 rounded-full",
              )}
              style={
                {
                  "--tw-ring-color": item.color,
                } as React.CSSProperties
              }
              onClick={() => handleFilterClick(item.id)}
            >
              <CircularProgress
                count={item.count}
                total={item.total}
                color={item.color}
              />
            </div>

            {/* Labels */}
            <div className="text-center mb-4 flex flex-col items-center">
            </div>

            {/* CTA Button */}
            <button
              disabled={item.count >= item.total && item.id !== "new"}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold border-2 transition-all w-full max-w-[180px] flex items-center justify-center gap-2",
                item.count >= item.total && item.id !== "new"
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-default"
                  : item.id === "hot"
                    ? "bg-red-500 border-red-500 text-white animate-pulse hover:scale-105 shadow-lg shadow-red-200"
                    : "bg-white hover:bg-gray-50",
                activeFilter === item.id &&
                  !(item.count >= item.total && item.id !== "new") &&
                  "ring-2 ring-offset-2",
              )}
              style={
                item.count >= item.total && item.id !== "new"
                  ? {}
                  : {
                      borderColor: item.id === "hot" ? "#ef4444" : item.color, // red-500
                      color: item.id === "hot" ? "white" : item.color,
                    }
              }
              onClick={() => item.id === "new" ? handleNewDealsClick() : handleFilterClick(item.id)}
            >
              {item.count >= item.total && item.id !== "new" ? (
                <>
                  <span>{item.label.split(" ")[0]} Complete</span>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </>
              ) : (
                item.buttonText
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

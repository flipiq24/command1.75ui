import React, { useState } from 'react';
import Layout, { useLayout } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { 
  Phone, 
  MessageSquare, 
  FileText, 
  Users, 
  Calendar,
  ChevronDown
} from 'lucide-react';

const MOCK_STATS = {
  calls: {
    value: 4,
    percentDiff: -82.5,
    chartData: [3, 4, 3, 4, 5, 4, 3, 4, 4, 3, 4, 5, 4, 4]
  },
  text: {
    value: 11,
    percentDiff: -98.3,
    chartData: [8, 10, 9, 11, 10, 11, 9, 10, 11, 10, 11, 11, 10, 11]
  },
  offers: {
    value: 7,
    percentDiff: 7.7,
    chartData: [5, 6, 5, 7, 6, 7, 6, 7, 8, 7, 6, 7, 8, 7]
  },
  relationships: {
    value: 3,
    percentDiff: -94.3,
    chartData: [2, 3, 2, 3, 4, 3, 2, 3, 3, 4, 3, 4, 3, 3]
  }
};

const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 24;
  const padding = 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#10b981" : "#6b7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isPositive ? "0" : "3 2"}
      />
    </svg>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  percentDiff, 
  chartData,
  isLast = false
}: { 
  icon: React.ElementType;
  label: string;
  value: number;
  percentDiff: number;
  chartData: number[];
  isLast?: boolean;
}) => {
  const isPositive = percentDiff > 0;
  const textColor = isPositive ? 'text-green-600' : 'text-red-500';
  const sign = isPositive ? '+' : '';

  return (
    <div className={cn(
      "flex-1 py-4 px-5",
      !isLast && "border-r border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <span className="text-xs font-medium text-gray-500">{label}</span>
        </div>
        <span className={cn("text-xs", textColor)}>
          {sign}{Math.abs(percentDiff).toFixed(1)}% than average
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <MiniSparkline data={chartData} isPositive={isPositive} />
      </div>
    </div>
  );
};

function MyStatsContent() {
  const [dateRange] = useState('Weekly');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">My Stats</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Nov 17 - Nov 23, 2025</span>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Open all stats
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100">
        <StatCard
          icon={Phone}
          label="Calls"
          value={MOCK_STATS.calls.value}
          percentDiff={MOCK_STATS.calls.percentDiff}
          chartData={MOCK_STATS.calls.chartData}
        />
        <StatCard
          icon={MessageSquare}
          label="Text"
          value={MOCK_STATS.text.value}
          percentDiff={MOCK_STATS.text.percentDiff}
          chartData={MOCK_STATS.text.chartData}
        />
        <StatCard
          icon={FileText}
          label="Offers"
          value={MOCK_STATS.offers.value}
          percentDiff={MOCK_STATS.offers.percentDiff}
          chartData={MOCK_STATS.offers.chartData}
        />
        <StatCard
          icon={Users}
          label="Relationships"
          value={MOCK_STATS.relationships.value}
          percentDiff={MOCK_STATS.relationships.percentDiff}
          chartData={MOCK_STATS.relationships.chartData}
          isLast
        />
      </div>

      <div className="flex-1 bg-gray-50" />
    </div>
  );
}

export default function MyStats() {
  return (
    <Layout>
      <MyStatsContent />
    </Layout>
  );
}

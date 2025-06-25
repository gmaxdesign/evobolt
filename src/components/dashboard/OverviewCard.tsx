import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    isPositive: boolean;
  };
  color: 'green' | 'blue' | 'purple' | 'orange';
}

export function OverviewCard({ title, value, icon: Icon, change, color }: OverviewCardProps) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change.isPositive ? '+' : ''}{change.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className
}) => {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-6 border border-border shadow-elevation-1 animate-scale-in flex flex-col h-full",
        className
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-9 w-9 rounded-full bg-clinic-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-clinic-700" />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        
        {trend && trendValue && (
          <div className="flex items-center mt-3">
            <div 
              className={cn(
                "rounded-full text-xs font-medium flex items-center px-2 py-0.5",
                trend === 'up' && "bg-green-50 text-green-700",
                trend === 'down' && "bg-red-50 text-red-700",
                trend === 'neutral' && "bg-gray-50 text-gray-700"
              )}
            >
              {trend === 'up' && <span className="mr-1">↑</span>}
              {trend === 'down' && <span className="mr-1">↓</span>}
              {trendValue}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
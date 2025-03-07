
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

export const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">{title}</p>
          <div className="p-1 rounded-full bg-blue-900/30">{icon}</div>
        </div>
        
        <div className="mt-1">
          <div className="text-2xl font-bold">{value}</div>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <div className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change)}%
              </div>
              <span className="text-xs text-gray-400 ml-1.5">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

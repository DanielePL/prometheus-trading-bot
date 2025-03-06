
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
    <Card className={cn("overflow-hidden h-full transition-all duration-200 hover:shadow-lg", className)}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 rounded-full bg-secondary/50">{icon}</div>
        </div>
        
        <div className="mt-1">
          <div className="text-2xl font-bold">{value}</div>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <div className={cn(
                "flex items-center text-xs font-medium rounded-full px-1.5 py-0.5",
                isPositive ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : 
                             "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change)}%
              </div>
              <span className="text-xs text-muted-foreground ml-1.5">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

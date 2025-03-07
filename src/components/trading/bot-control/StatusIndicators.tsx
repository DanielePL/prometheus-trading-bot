
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';

interface StatusIndicatorsProps {
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  cpuUsage,
  memoryUsage,
  executionTime
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Bot Status
      </h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>CPU Usage</span>
            <span>{cpuUsage}%</span>
          </div>
          <Progress value={cpuUsage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Memory</span>
            <span>{memoryUsage}%</span>
          </div>
          <Progress value={memoryUsage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Runtime</span>
            <span>{Math.floor(executionTime / 60)}m {executionTime % 60}s</span>
          </div>
          <Progress value={(executionTime % 300) / 3} className="h-2" />
        </div>
      </div>
    </div>
  );
};

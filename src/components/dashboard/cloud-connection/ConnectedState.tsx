
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Server, Power, RefreshCw, Clock, ArrowUpDown, Shield, Terminal, Wifi } from 'lucide-react';
import { CloudServiceType, CloudConnectionConfig } from './types';
import { getServiceName } from './utils';

interface ConnectedStateProps {
  selectedService: CloudServiceType;
  connectionConfig?: CloudConnectionConfig;
  uptime: string;
  lastSync: string;
  cpuUsage: number;
  memoryUsage: number;
  isRestarting: boolean;
  disconnectService: () => void;
  restartService: () => void;
}

export const ConnectedState: React.FC<ConnectedStateProps> = ({
  selectedService,
  connectionConfig,
  uptime,
  lastSync,
  cpuUsage,
  memoryUsage,
  isRestarting,
  disconnectService,
  restartService
}) => {
  // Open terminal in new window
  const openTerminal = () => {
    window.open(`ssh://root@${connectionConfig?.ipAddress}:${connectionConfig?.port || 22}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center">
            <Server className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Service</span>
          </div>
          <p className="text-sm">{getServiceName(selectedService)}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Uptime</span>
          </div>
          <p className="text-sm">{uptime}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Last Sync</span>
          </div>
          <p className="text-sm">{lastSync}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Wifi className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">IP Address</span>
          </div>
          <p className="text-sm">{connectionConfig?.ipAddress || 'N/A'}</p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">CPU Usage</span>
          <span className="text-sm text-muted-foreground">{cpuUsage}%</span>
        </div>
        <Progress 
          value={cpuUsage} 
          className="h-2" 
          indicator={cpuUsage > 80 ? "bg-red-500" : cpuUsage > 50 ? "bg-yellow-500" : undefined}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Memory Usage</span>
          <span className="text-sm text-muted-foreground">{memoryUsage}%</span>
        </div>
        <Progress 
          value={memoryUsage} 
          className="h-2"
          indicator={memoryUsage > 80 ? "bg-red-500" : memoryUsage > 50 ? "bg-yellow-500" : undefined}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline"
          className="flex-1 text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
          onClick={disconnectService}
        >
          <Power className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={restartService}
          disabled={isRestarting}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRestarting ? 'animate-spin' : ''}`} />
          {isRestarting ? 'Restarting...' : 'Restart'}
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={openTerminal}
        >
          <Terminal className="mr-2 h-4 w-4" />
          Terminal
        </Button>
      </div>
    </div>
  );
};

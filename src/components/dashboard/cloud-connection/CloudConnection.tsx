
import React from 'react';
import { DisconnectedState } from './DisconnectedState';
import { ConnectedState } from './ConnectedState';
import { getStatusBadgeClass } from './utils';
import { Badge } from '@/components/ui/badge';
import { Cloud } from 'lucide-react';

interface CloudConnectionProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  selectedService: string;
  setSelectedService: (service: string) => void;
  connectionConfig: any;
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  lastSync: string;
  isRestarting: boolean;
  isAuthenticated: boolean;
  connectToService: (config?: any) => void;
  disconnectService: () => void;
  restartService: () => void;
}

export const CloudConnection: React.FC<CloudConnectionProps> = ({
  connectionStatus,
  selectedService,
  setSelectedService,
  connectionConfig,
  uptime,
  cpuUsage,
  memoryUsage,
  lastSync,
  isRestarting,
  isAuthenticated,
  connectToService,
  disconnectService,
  restartService
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-muted-foreground" />
          <span>Cloud connection</span>
        </div>
        <Badge variant="outline" className={getStatusBadgeClass(connectionStatus)}>
          {connectionStatus === 'connected' ? 'Connected' : 
           connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {connectionStatus === 'disconnected' ? (
          <DisconnectedState 
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            connectionConfig={connectionConfig}
            connectToService={connectToService}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <ConnectedState 
            selectedService={selectedService}
            uptime={uptime}
            cpuUsage={cpuUsage}
            memoryUsage={memoryUsage}
            lastSync={lastSync}
            isRestarting={isRestarting}
            disconnectService={disconnectService}
            restartService={restartService}
          />
        )}
      </div>
    </div>
  );
};

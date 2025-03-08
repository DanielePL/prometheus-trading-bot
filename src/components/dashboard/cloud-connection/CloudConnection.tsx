
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudServiceType, ConnectionStatusType, CloudConnectionConfig } from './types';
import { getServiceName } from './utils';
import { ConnectedState } from './ConnectedState';
import { DisconnectedState } from './DisconnectedState';

interface CloudConnectionProps {
  connectionStatus: ConnectionStatusType;
  selectedService: CloudServiceType;
  setSelectedService: (service: CloudServiceType) => void;
  connectionConfig: CloudConnectionConfig;
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  lastSync: string;
  isRestarting: boolean;
  connectToService: (config?: CloudConnectionConfig) => void;
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
  connectToService,
  disconnectService,
  restartService
}) => {
  return (
    <div className="w-full space-y-4">
      {connectionStatus === 'connected' ? (
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
      ) : (
        <DisconnectedState
          connectionStatus={connectionStatus}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          connectionConfig={connectionConfig}
          connectToService={connectToService}
        />
      )}
    </div>
  );
};

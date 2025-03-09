
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Cloud } from 'lucide-react';
import { DisconnectedState } from './DisconnectedState';
import { ConnectedState } from './ConnectedState';
import { useCloudConnection } from './useCloudConnection';
import { getStatusBadgeClass } from './utils';

export const CloudConnectionCard: React.FC = () => {
  const {
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
  } = useCloudConnection();

  return (
    <Card className="h-full border-2 border-amber-500/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Prometheus Cloud</CardTitle>
              <CardDescription>Trading system cloud connection</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={getStatusBadgeClass(connectionStatus)}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectionStatus === 'disconnected' ? (
            <DisconnectedState 
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              connectionConfig={connectionConfig}
              connectToService={connectToService}
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
      </CardContent>
    </Card>
  );
};

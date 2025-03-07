
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, RefreshCw, Server, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusPanelProps {
  isConnected: boolean;
  exchangeName: string;
  apiEndpoint: string;
  lastPing?: number; // ms
  connectionQuality?: number; // 0-100
  onReconnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
}

export const ConnectionStatusPanel: React.FC<ConnectionStatusPanelProps> = ({
  isConnected,
  exchangeName,
  apiEndpoint,
  lastPing = 0,
  connectionQuality = 100,
  onReconnect,
  onDisconnect,
  onTest
}) => {
  return (
    <Card className="border-2 border-amber-500/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Exchange Connection</CardTitle>
              <CardDescription>API connection status</CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={isConnected 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Connected to {exchangeName} API</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-sm font-medium">Exchange</span>
            <p className="text-sm">{exchangeName}</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-medium">Endpoint</span>
            <p className="text-sm truncate" title={apiEndpoint}>
              {apiEndpoint}
            </p>
          </div>
          
          {isConnected && (
            <>
              <div className="space-y-1">
                <span className="text-sm font-medium">Latency</span>
                <p className="text-sm">{lastPing} ms</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium">Quality</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={connectionQuality} 
                    className="h-2 flex-grow" 
                    color={
                      connectionQuality > 80 ? "bg-green-500" : 
                      connectionQuality > 50 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }
                  />
                  <span className="text-xs">{connectionQuality}%</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          {isConnected ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={onDisconnect}
              >
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onTest}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Test
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
              onClick={onReconnect}
            >
              <Wifi className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, RefreshCw, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusPanelProps {
  isConnected: boolean;
  exchangeName: string;
  apiEndpoint: string;
  usingFallback?: boolean;
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
  usingFallback = false,
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
              ? usingFallback 
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {isConnected 
              ? usingFallback 
                ? "Fallback Connected" 
                : "Connected" 
              : "Disconnected"
            }
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <div className={`flex items-center mb-2 ${usingFallback ? 'text-yellow-600' : 'text-green-600'}`}>
            {usingFallback ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Connected to fallback API</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Connected to {exchangeName} API</span>
              </>
            )}
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
        
        {usingFallback && isConnected && (
          <div className="p-2 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-sm">
            <AlertTriangle className="h-4 w-4 inline-block mr-1" />
            Using fallback endpoint due to connection issues with primary endpoint.
          </div>
        )}
        
        <div className="flex gap-2 pt-4 mt-2 border-t">
          {isConnected ? (
            <>
              <Button 
                variant="destructive" 
                size="sm"
                className="flex-1"
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
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
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

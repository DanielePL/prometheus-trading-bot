
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle, Info, PlayCircle, StopCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const BotStatus = () => {
  const [isRunning, setIsRunning] = React.useState(true);
  const [progress, setProgress] = React.useState(78);
  
  // Simulate progress change
  React.useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const change = Math.random() * 5 - 2;
          return Math.max(0, Math.min(100, prev + change));
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);
  
  const toggleBot = () => {
    setIsRunning(!isRunning);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Bot Status</CardTitle>
            <CardDescription>Current trading bot status</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={isRunning 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {isRunning ? "Active" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Bot Control</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {isRunning ? "Running" : "Stopped"}
              </span>
              <Switch 
                checked={isRunning} 
                onCheckedChange={toggleBot} 
                className={isRunning ? "bg-green-600" : ""} 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">System Load</span>
              <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span>Connected to exchange API</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span>Websocket feed active</span>
            </div>
            <div className="flex items-center text-sm">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span>Last executed trade: 2 minutes ago</span>
            </div>
            <div className="flex items-center text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span>CPU usage slightly elevated</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 pt-2">
            <Button 
              variant="outline" 
              className={isRunning ? "text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" : "text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"}
              onClick={toggleBot}
            >
              {isRunning ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Bot
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Bot
                </>
              )}
            </Button>
            <Button variant="outline">
              <Info className="mr-2 h-4 w-4" />
              Logs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

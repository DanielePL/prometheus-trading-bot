
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, RefreshCw } from 'lucide-react';

interface BotLogPanelProps {
  logs: string[];
  isRunning: boolean;
  onRefreshData: () => void;
}

export const BotLogPanel: React.FC<BotLogPanelProps> = ({
  logs,
  isRunning,
  onRefreshData
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-amber-500" />
          <div>
            <CardTitle>Bot Logs</CardTitle>
            <CardDescription>Real-time trading activity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[425px] rounded-md border bg-muted p-4 font-mono text-sm overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="pb-1">
                {log}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-center pt-8">
              Bot is idle. Start the bot to see logs.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-muted-foreground">
            {isRunning ? 'Bot is running' : 'Bot is stopped'}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefreshData}
            disabled={!isRunning}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};


import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BotLogPanelProps {
  logs: string[];
  isRunning: boolean;
  onRefreshData: () => void;
  isExchangeConnected?: boolean;
}

export const BotLogPanel: React.FC<BotLogPanelProps> = ({
  logs,
  isRunning,
  onRefreshData,
  isExchangeConnected = false
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll logs to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  const handleDownloadLogs = () => {
    // Create a blob with the logs
    const logText = logs.join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `prometheus-bot-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs Downloaded",
      description: "Bot logs have been saved to your computer",
    });
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Bot Logs</CardTitle>
              <CardDescription>Real-time trading activity</CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleDownloadLogs}
            disabled={logs.length === 0}
            title="Download Logs"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={logContainerRef}
          className="h-[425px] rounded-md border bg-muted p-4 font-mono text-sm overflow-y-auto"
        >
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
          <div className="text-sm text-muted-foreground flex items-center">
            {isRunning ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Bot is running
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                Bot is stopped
              </>
            )}
            {!isExchangeConnected && isRunning && (
              <div className="ml-3 flex items-center text-amber-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Using simulated market data</span>
              </div>
            )}
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

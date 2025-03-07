
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlayCircle, StopCircle } from 'lucide-react';

interface BotControlsProps {
  isRunning: boolean;
  onStartBot: () => void;
  onStopBot: () => void;
  onClearLogs: () => void;
}

export const BotControls: React.FC<BotControlsProps> = ({
  isRunning,
  onStartBot,
  onStopBot,
  onClearLogs
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center space-x-2">
        <Switch 
          id="bot-active" 
          checked={isRunning} 
          onCheckedChange={(checked) => checked ? onStartBot() : onStopBot()}
        />
        <Label htmlFor="bot-active">
          {isRunning ? 'Active' : 'Inactive'}
        </Label>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearLogs}
          type="button"
        >
          Clear Logs
        </Button>
        <Button
          variant={isRunning ? "destructive" : "default"}
          size="sm"
          onClick={() => isRunning ? onStopBot() : onStartBot()}
          type="button"
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
      </div>
    </div>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RefreshCw, Zap, Newspaper, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useTradingBot } from '@/hooks/useTradingBot';

interface DashboardHeaderProps {
  isRefreshing: boolean;
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isRefreshing,
  setIsRefreshing,
}) => {
  const [botState, botActions] = useTradingBot();
  
  const handleDashboardRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate data refreshing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    toast.success('Dashboard data refreshed');
    setIsRefreshing(false);
  };
  
  const handleStartBot = () => {
    if (!botState.isRunning) {
      botActions.startBot();
      toast.success('Trading bot started');
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="flex space-x-2 items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDashboardRefresh}
          disabled={isRefreshing}
          className="h-9"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        {!botState.isRunning && (
          <Button onClick={handleStartBot} variant="default">
            <Play className="mr-2 h-4 w-4" />
            Start Bot
          </Button>
        )}
        
        {!botState.isExchangeConnected && (
          <Button onClick={botActions.reconnectExchange} variant="default">
            <Zap className="mr-2 h-4 w-4" />
            Connect Bot
          </Button>
        )}
        {botState.isExchangeConnected && (
          <Button variant="outline" asChild>
            <Link to="/tradingbot">
              <Zap className="mr-2 h-4 w-4" />
              Manage Bot
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to="/news-scanner">
            <Newspaper className="mr-2 h-4 w-4" />
            Market Intelligence
          </Link>
        </Button>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, Settings, PlayCircle, PauseCircle, AlertCircle, 
  Check, Settings2, Edit, Trash2, Plus, Cloud, Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'backtest';
  performanceScore: number;
  winRate: number;
  profitFactor: number;
  trades: number;
  pairs: string[];
  deployedTo?: string;
}

const strategies: Strategy[] = [
  {
    id: '1',
    name: 'MACD Crossover',
    description: 'Identifies momentum shifts using MACD indicator crossovers with confirmation from volume',
    status: 'active',
    performanceScore: 82,
    winRate: 68.5,
    profitFactor: 2.3,
    trades: 124,
    pairs: ['BTC/USDT', 'ETH/USDT']
  },
  {
    id: '2',
    name: 'RSI Divergence',
    description: 'Detects potential trend reversals by identifying divergences between price action and RSI',
    status: 'active',
    performanceScore: 75,
    winRate: 61.2,
    profitFactor: 1.8,
    trades: 98,
    pairs: ['SOL/USDT', 'BTC/USDT']
  },
  {
    id: '3',
    name: 'Bull Flag Pattern',
    description: 'Identifies consolidation patterns after strong moves and enters on breakout confirmation',
    status: 'inactive',
    performanceScore: 68,
    winRate: 58.7,
    profitFactor: 1.6,
    trades: 45,
    pairs: ['ETH/USDT']
  },
  {
    id: '4',
    name: 'Bollinger Squeeze',
    description: 'Identifies periods of low volatility and potential breakouts using Bollinger Bands',
    status: 'backtest',
    performanceScore: 0,
    winRate: 0,
    profitFactor: 0,
    trades: 0,
    pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
  }
];

const Strategies = () => {
  const [strategiesList, setStrategiesList] = useState<Strategy[]>(strategies);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentServer, setDeploymentServer] = useState('digitalocean');
  const { toast } = useToast();

  const handleStatusChange = (strategyId: string, isActive: boolean) => {
    setStrategiesList(prev => 
      prev.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, status: isActive ? 'active' : 'inactive' }
          : strategy
      )
    );

    toast({
      title: isActive ? "Strategy Activated" : "Strategy Deactivated",
      description: `The trading strategy has been ${isActive ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleDeployStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const deployToServer = () => {
    if (!selectedStrategy) return;

    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setStrategiesList(prev => 
        prev.map(strategy => 
          strategy.id === selectedStrategy.id 
            ? { ...strategy, deployedTo: deploymentServer }
            : strategy
        )
      );
      
      setIsDeploying(false);
      setSelectedStrategy(null);
      
      toast({
        title: "Strategy Deployed",
        description: `${selectedStrategy.name} has been successfully deployed to your DigitalOcean Droplet.`,
      });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategies</h1>
            <p className="text-muted-foreground mt-1">
              Manage and configure your Prometheus trading strategies
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            New Strategy
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {strategiesList.map((strategy) => (
            <Card key={strategy.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {strategy.name}
                    </CardTitle>
                    <CardDescription>
                      {strategy.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${strategy.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${strategy.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${strategy.status === 'backtest' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      `}
                    >
                      {strategy.status === 'active' && 'Active'}
                      {strategy.status === 'inactive' && 'Inactive'}
                      {strategy.status === 'backtest' && 'Backtest Mode'}
                    </Badge>
                    {strategy.deployedTo && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                        <Cloud size={12} />
                        Deployed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Performance Score</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : `${strategy.performanceScore}%`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Win Rate</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : `${strategy.winRate}%`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Profit Factor</p>
                    <p className="text-2xl font-bold">
                      {strategy.status === 'backtest' ? '—' : strategy.profitFactor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Total Trades</p>
                    <p className="text-2xl font-bold">{strategy.trades}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Trading Pairs</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.pairs.map((pair) => (
                      <Badge key={pair} variant="secondary">{pair}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/30 px-6 py-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`activate-${strategy.id}`} 
                      checked={strategy.status === 'active'} 
                      disabled={strategy.status === 'backtest'}
                      onCheckedChange={(isChecked) => handleStatusChange(strategy.id, isChecked)}
                    />
                    <Label htmlFor={`activate-${strategy.id}`}>
                      {strategy.status === 'active' ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeployStrategy(strategy)}
                          className={strategy.deployedTo ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" : ""}
                        >
                          <Server className="h-4 w-4 mr-1" />
                          {strategy.deployedTo ? "Deployed" : "Deploy"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Deploy Strategy</DialogTitle>
                          <DialogDescription>
                            Deploy "{selectedStrategy?.name}" to your cloud server
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="deployment-server">Deployment Target</Label>
                            <Select value={deploymentServer} onValueChange={setDeploymentServer}>
                              <SelectTrigger id="deployment-server">
                                <SelectValue placeholder="Select server" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="digitalocean">DigitalOcean Droplet</SelectItem>
                                <SelectItem value="aws" disabled>AWS EC2</SelectItem>
                                <SelectItem value="gcp" disabled>Google Cloud</SelectItem>
                                <SelectItem value="local">Local Environment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">Deployment Options:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Strategy will be deployed to your droplet</li>
                              <li>Auto-restart on server reboot</li>
                              <li>Error logging and notifications</li>
                              <li>Automatic data backups</li>
                            </ul>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedStrategy(null)}>Cancel</Button>
                          <Button onClick={deployToServer} disabled={isDeploying}>
                            {isDeploying ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Cloud className="h-4 w-4 mr-2" />
                                Deploy Strategy
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Strategies;

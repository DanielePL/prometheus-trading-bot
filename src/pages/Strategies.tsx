import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, Settings, PlayCircle, PauseCircle, AlertCircle, 
  Check, Settings2, Edit, Trash2, Plus, Cloud, Server, Globe
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  applyToAllCoins?: boolean;
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
  const [isEditingStrategy, setIsEditingStrategy] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState<Strategy | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<string | null>(null);
  const [isCreatingStrategy, setIsCreatingStrategy] = useState(false);
  const [newStrategy, setNewStrategy] = useState<Strategy>({
    id: '',
    name: 'New Strategy',
    description: 'A new trading strategy',
    status: 'inactive',
    performanceScore: 0,
    winRate: 0,
    profitFactor: 0,
    trades: 0,
    pairs: ['BTC/USDT'],
    applyToAllCoins: false
  });
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
        description: `${selectedStrategy.name} has been successfully deployed to your ${deploymentServer === 'digitalocean' ? 'DigitalOcean Droplet' : 'Local Environment'}.`,
      });
    }, 2000);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditedStrategy({...strategy});
    setIsEditingStrategy(true);
  };

  const saveStrategyChanges = () => {
    if (!editedStrategy) return;

    setStrategiesList(prev => 
      prev.map(strategy => 
        strategy.id === editedStrategy.id 
          ? editedStrategy
          : strategy
      )
    );
    
    setIsEditingStrategy(false);
    setEditedStrategy(null);
    
    toast({
      title: "Strategy Updated",
      description: "Your strategy has been successfully updated.",
    });
  };

  const handleDeletePrompt = (strategyId: string) => {
    setStrategyToDelete(strategyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStrategy = () => {
    if (!strategyToDelete) return;
    
    setStrategiesList(prev => prev.filter(strategy => strategy.id !== strategyToDelete));
    setStrategyToDelete(null);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Strategy Deleted",
      description: "The strategy has been permanently deleted.",
    });
  };

  const handleConfigureStrategy = (strategy: Strategy) => {
    toast({
      title: "Configure Strategy",
      description: `Opening configuration for ${strategy.name}. This would typically show a detailed settings panel.`,
    });
  };

  const handleCreateNewStrategy = () => {
    setIsCreatingStrategy(true);
    setNewStrategy({
      id: `${Date.now()}`,
      name: "New Strategy",
      description: "A new trading strategy",
      status: 'inactive',
      performanceScore: 0,
      winRate: 0,
      profitFactor: 0,
      trades: 0,
      pairs: ['BTC/USDT'],
      applyToAllCoins: false
    });
  };

  const saveNewStrategy = () => {
    const strategy = { ...newStrategy, id: `${Date.now()}` };
    setStrategiesList(prev => [...prev, strategy]);
    setIsCreatingStrategy(false);
    
    toast({
      title: "New Strategy Created",
      description: strategy.applyToAllCoins 
        ? "A new trading strategy has been created for all monitored coins."
        : "A new trading strategy has been created for specific trading pairs.",
    });
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
          <Button className="gap-2" onClick={handleCreateNewStrategy}>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleConfigureStrategy(strategy)}
                    >
                      <Settings2 className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    
                    <Dialog open={isEditingStrategy && editedStrategy?.id === strategy.id} onOpenChange={(open) => !open && setIsEditingStrategy(false)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEditStrategy(strategy)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Strategy</DialogTitle>
                          <DialogDescription>
                            Modify your trading strategy details
                          </DialogDescription>
                        </DialogHeader>
                        {editedStrategy && (
                          <div className="py-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="strategy-name">Strategy Name</Label>
                              <Input 
                                id="strategy-name" 
                                value={editedStrategy.name} 
                                onChange={(e) => setEditedStrategy({...editedStrategy, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="strategy-description">Description</Label>
                              <Textarea 
                                id="strategy-description" 
                                value={editedStrategy.description}
                                onChange={(e) => setEditedStrategy({...editedStrategy, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Trading Pairs</Label>
                              <div className="flex flex-wrap gap-2">
                                {editedStrategy.pairs.map((pair) => (
                                  <Badge key={pair} variant="secondary" className="py-1.5 px-2">
                                    {pair}
                                    <button 
                                      className="ml-1.5 text-muted-foreground hover:text-foreground"
                                      onClick={() => setEditedStrategy({
                                        ...editedStrategy, 
                                        pairs: editedStrategy.pairs.filter(p => p !== pair)
                                      })}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </Badge>
                                ))}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7"
                                  onClick={() => setEditedStrategy({
                                    ...editedStrategy,
                                    pairs: [...editedStrategy.pairs, 'ETH/USDT']
                                  })}
                                >
                                  <Plus size={14} />
                                  Add Pair
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditingStrategy(false)}>Cancel</Button>
                          <Button onClick={saveStrategyChanges}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog open={isDeleteDialogOpen && strategyToDelete === strategy.id} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-800/30"
                          onClick={() => handleDeletePrompt(strategy.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this strategy? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setStrategyToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={confirmDeleteStrategy}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
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

      {/* Create New Strategy Dialog */}
      <Dialog open={isCreatingStrategy} onOpenChange={setIsCreatingStrategy}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Strategy</DialogTitle>
            <DialogDescription>
              Set up a new trading strategy
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-strategy-name">Strategy Name</Label>
              <Input 
                id="new-strategy-name" 
                value={newStrategy.name} 
                onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-strategy-description">Description</Label>
              <Textarea 
                id="new-strategy-description" 
                value={newStrategy.description}
                onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 py-2 border rounded-md p-3 bg-muted/30">
              <Switch
                id="apply-all-coins-strategy"
                checked={newStrategy.applyToAllCoins}
                onCheckedChange={(checked) => setNewStrategy({...newStrategy, applyToAllCoins: checked})}
              />
              <Label htmlFor="apply-all-coins-strategy" className="flex-1">
                Apply to All Monitored Coins
              </Label>
            </div>
            
            {!newStrategy.applyToAllCoins && (
              <div className="space-y-2">
                <Label>Trading Pairs</Label>
                <div className="flex flex-wrap gap-2">
                  {newStrategy.pairs.map((pair) => (
                    <Badge key={pair} variant="secondary" className="py-1.5 px-2">
                      {pair}
                      <button 
                        className="ml-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setNewStrategy({
                          ...newStrategy, 
                          pairs: newStrategy.pairs.filter(p => p !== pair)
                        })}
                      >
                        <Trash2 size={12} />
                      </button>
                    </Badge>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7"
                    onClick={() => setNewStrategy({
                      ...newStrategy,
                      pairs: [...newStrategy.pairs, 'ETH/USDT']
                    })}
                  >
                    <Plus size={14} />
                    Add Pair
                  </Button>
                </div>
              </div>
            )}
            
            {newStrategy.applyToAllCoins && (
              <div className="p-3 rounded-md bg-primary/10 flex items-center gap-2 border">
                <Globe size={16} className="text-primary"/>
                <span className="text-sm">Strategy will be applied to all monitored coins</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingStrategy(false)}>Cancel</Button>
            <Button onClick={saveNewStrategy}>Create Strategy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Strategies;

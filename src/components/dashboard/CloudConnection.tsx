
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Cloud, 
  Server, 
  Power, 
  RefreshCw, 
  Clock, 
  ArrowUpDown, 
  Shield, 
  Flame,
  Terminal
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";

export const CloudConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [selectedService, setSelectedService] = useState<string>('aws');
  const [uptime, setUptime] = useState<string>('0h 0m');
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [lastSync, setLastSync] = useState<string>('Never');
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const { toast } = useToast();

  // Simulate connection status checks
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      const timer = setTimeout(() => {
        setConnectionStatus('connected');
        setLastSync('Just now');
        startResourceUpdates();
        
        toast({
          title: "Cloud Service Connected",
          description: `Successfully connected to ${getServiceName(selectedService)}`,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [connectionStatus, selectedService, toast]);

  // Simulate resource usage updates when connected
  const startResourceUpdates = () => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 60) + 10);
      setMemoryUsage(Math.floor(Math.random() * 40) + 30);
      
      // Update uptime
      const [hours, minutes] = uptime.split('h ');
      const newMinutes = parseInt(minutes) + 5;
      if (newMinutes >= 60) {
        setUptime(`${parseInt(hours) + 1}h ${newMinutes - 60}m`);
      } else {
        setUptime(`${hours} ${newMinutes}m`);
      }
      
      // Update last sync time randomly
      if (Math.random() > 0.7) {
        setLastSync('Just now');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  };

  const connectToService = () => {
    setConnectionStatus('connecting');
    toast({
      title: "Connecting to Cloud Service",
      description: `Establishing connection to ${getServiceName(selectedService)}...`,
    });
  };

  const disconnectService = () => {
    setConnectionStatus('disconnected');
    setUptime('0h 0m');
    setCpuUsage(0);
    setMemoryUsage(0);
    
    toast({
      title: "Cloud Service Disconnected",
      description: `Connection to ${getServiceName(selectedService)} terminated.`,
    });
  };

  const restartService = () => {
    setIsRestarting(true);
    
    toast({
      title: "Restarting Cloud Service",
      description: `Restarting ${getServiceName(selectedService)}...`,
    });
    
    setTimeout(() => {
      setIsRestarting(false);
      setLastSync('Just now');
      
      toast({
        title: "Cloud Service Restarted",
        description: `${getServiceName(selectedService)} has been restarted successfully.`,
      });
    }, 3000);
  };

  const getServiceName = (serviceId: string): string => {
    switch (serviceId) {
      case 'aws': return 'AWS EC2';
      case 'digitalocean': return 'DigitalOcean Droplet';
      case 'gcp': return 'Google Cloud Compute';
      case 'railway': return 'Railway.app';
      default: return 'Cloud Service';
    }
  };

  const getStatusBadgeClass = (): string => {
    switch (connectionStatus) {
      case 'connected': 
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'disconnected': 
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case 'connecting': 
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Prometheus Cloud</CardTitle>
              <CardDescription>Trading system cloud connection</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={getStatusBadgeClass()}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectionStatus === 'disconnected' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Cloud Service</label>
                <Select 
                  value={selectedService} 
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cloud service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS EC2</SelectItem>
                    <SelectItem value="digitalocean">DigitalOcean Droplet</SelectItem>
                    <SelectItem value="gcp">Google Cloud Compute</SelectItem>
                    <SelectItem value="railway">Railway.app</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={connectToService}
              >
                <Cloud className="mr-2 h-4 w-4" />
                Connect to Cloud Service
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Service</span>
                  </div>
                  <p className="text-sm">{getServiceName(selectedService)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Uptime</span>
                  </div>
                  <p className="text-sm">{uptime}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Last Sync</span>
                  </div>
                  <p className="text-sm">{lastSync}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <p className="text-sm text-green-500">Secure</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">{cpuUsage}%</span>
                </div>
                <Progress 
                  value={cpuUsage} 
                  className="h-2" 
                  color={cpuUsage > 80 ? "bg-red-500" : cpuUsage > 50 ? "bg-yellow-500" : ""}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">{memoryUsage}%</span>
                </div>
                <Progress 
                  value={memoryUsage} 
                  className="h-2"
                  color={memoryUsage > 80 ? "bg-red-500" : memoryUsage > 50 ? "bg-yellow-500" : ""}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={disconnectService}
                >
                  <Power className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={restartService}
                  disabled={isRestarting}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRestarting ? 'animate-spin' : ''}`} />
                  {isRestarting ? 'Restarting...' : 'Restart'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1"
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Console
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

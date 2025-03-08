
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ConnectionStatusType, CloudServiceType, CloudConnectionConfig } from './types';
import { getServiceName } from './utils';

export const useCloudConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('disconnected');
  const [selectedService, setSelectedService] = useState<CloudServiceType>('digitalocean');
  const [connectionConfig, setConnectionConfig] = useState<CloudConnectionConfig>({});
  const [uptime, setUptime] = useState<string>('0h 0m');
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [lastSync, setLastSync] = useState<string>('Never');
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const { toast } = useToast();

  // Load saved connection from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('cloudConnectionConfig');
    const savedService = localStorage.getItem('cloudServiceType');
    const savedStatus = localStorage.getItem('cloudConnectionStatus');
    
    if (savedConfig) {
      setConnectionConfig(JSON.parse(savedConfig));
    }
    
    if (savedService) {
      setSelectedService(savedService as CloudServiceType);
    }
    
    if (savedStatus === 'connected') {
      // Try to restore connection
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
        startResourceUpdates();
        setLastSync('Restored connection');
      }, 1500);
    }
  }, []);

  // Save connection config to localStorage when it changes
  useEffect(() => {
    if (Object.keys(connectionConfig).length > 0) {
      localStorage.setItem('cloudConnectionConfig', JSON.stringify(connectionConfig));
    }
    
    localStorage.setItem('cloudServiceType', selectedService);
    localStorage.setItem('cloudConnectionStatus', connectionStatus);
  }, [connectionConfig, selectedService, connectionStatus]);

  // Simulate connection status checks
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      const timer = setTimeout(() => {
        setConnectionStatus('connected');
        setLastSync('Just now');
        startResourceUpdates();
        
        toast({
          title: "Cloud Service Connected",
          description: `Successfully connected to ${getServiceName(selectedService)} at ${connectionConfig.ipAddress}:${connectionConfig.port}`,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [connectionStatus, selectedService, connectionConfig, toast]);

  // Simulate resource usage updates when connected
  const startResourceUpdates = () => {
    const interval = setInterval(() => {
      // More realistic resource usage patterns
      setCpuUsage(prevCpu => {
        const variation = Math.random() > 0.7 ? Math.floor(Math.random() * 20) - 10 : Math.floor(Math.random() * 6) - 3;
        return Math.max(5, Math.min(95, prevCpu + variation));
      });
      
      setMemoryUsage(prevMem => {
        const variation = Math.random() > 0.7 ? Math.floor(Math.random() * 15) - 5 : Math.floor(Math.random() * 4) - 2;
        return Math.max(10, Math.min(90, prevMem + variation));
      });
      
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

  const connectToService = (config?: CloudConnectionConfig) => {
    if (config) {
      setConnectionConfig(config);
    }
    setConnectionStatus('connecting');
    
    const configDescription = config?.ipAddress 
      ? ` at ${config.ipAddress}${config.port ? `:${config.port}` : ''}` 
      : '';
    
    toast({
      title: "Connecting to Cloud Service",
      description: `Establishing connection to ${getServiceName(selectedService)}${configDescription}...`,
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

  return {
    connectionStatus,
    selectedService,
    setSelectedService,
    connectionConfig,
    uptime,
    cpuUsage,
    memoryUsage,
    lastSync,
    isRestarting,
    connectToService,
    disconnectService,
    restartService
  };
};

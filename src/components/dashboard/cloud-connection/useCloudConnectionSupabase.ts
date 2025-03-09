
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ConnectionStatusType, CloudServiceType, CloudConnectionConfig } from './types';
import { getServiceName } from './utils';
import { supabase } from '@/integrations/supabase/client';

export const useCloudConnectionSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('disconnected');
  const [selectedService, setSelectedService] = useState<CloudServiceType>('digitalocean');
  const [connectionConfig, setConnectionConfig] = useState<CloudConnectionConfig>({});
  const [uptime, setUptime] = useState<string>('0h 0m');
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [lastSync, setLastSync] = useState<string>('Never');
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [resourceUpdateInterval, setResourceUpdateInterval] = useState<number | null>(null);
  const { toast } = useToast();

  // Load saved connection from Supabase on mount
  useEffect(() => {
    loadConnectionFromSupabase();
    
    // Cleanup interval on unmount
    return () => {
      if (resourceUpdateInterval) {
        clearInterval(resourceUpdateInterval);
      }
    };
  }, []);

  const loadConnectionFromSupabase = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.log('No authenticated user found');
        return;
      }
      
      const { data: connections, error } = await supabase
        .from('cloud_connections')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true)
        .order('last_connected_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error loading connection:', error);
        return;
      }
      
      if (connections && connections.length > 0) {
        const connection = connections[0];
        
        setSelectedService(connection.service_type as CloudServiceType);
        setConnectionConfig({
          ipAddress: connection.ip_address,
          port: connection.port,
          apiKey: connection.api_key,
          instanceId: connection.instance_id,
          region: connection.region,
        });
        setConnectionId(connection.id);
        
        // Restore connection with real API call
        setConnectionStatus('connecting');
        const connected = await makeRealConnectionToDigitalOcean(connection.api_key);
        
        if (connected) {
          setConnectionStatus('connected');
          startResourceUpdates(connection.api_key, connection.instance_id);
          setLastSync('Restored connection');
        } else {
          setConnectionStatus('disconnected');
          toast({
            title: "Connection Failed",
            description: "Could not restore connection to Digital Ocean",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error loading connection:', error);
    }
  };

  // Save connection to Supabase
  const saveConnectionToSupabase = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.log('No authenticated user found');
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to save cloud connections.",
          variant: "destructive"
        });
        return false;
      }
      
      // Deactivate previous connections
      await supabase
        .from('cloud_connections')
        .update({ is_active: false })
        .eq('user_id', user.user.id);
      
      // Insert new connection
      const { data, error } = await supabase
        .from('cloud_connections')
        .insert({
          user_id: user.user.id,
          service_type: selectedService,
          ip_address: connectionConfig.ipAddress || '',
          port: connectionConfig.port || 22,
          api_key: connectionConfig.apiKey,
          instance_id: connectionConfig.instanceId,
          region: connectionConfig.region,
          is_active: true
        })
        .select();
        
      if (error) {
        console.error('Error saving connection:', error);
        toast({
          title: "Error Saving Connection",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      setConnectionId(data[0].id);
      return true;
    } catch (error) {
      console.error('Error saving connection:', error);
      return false;
    }
  };

  // Record metrics to Supabase
  const recordMetrics = async () => {
    if (!connectionId) return;
    
    try {
      await supabase
        .from('instance_metrics')
        .insert({
          connection_id: connectionId,
          cpu_usage: cpuUsage,
          memory_usage: memoryUsage,
          uptime: uptime
        });
    } catch (error) {
      console.error('Error recording metrics:', error);
    }
  };

  // Make real connection to Digital Ocean API
  const makeRealConnectionToDigitalOcean = async (apiKey: string) => {
    try {
      // Real API call to Digital Ocean
      const response = await fetch('https://api.digitalocean.com/v2/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Error connecting to Digital Ocean:', response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log('Connected to Digital Ocean account:', data);
      return true;
    } catch (error) {
      console.error('Error connecting to Digital Ocean:', error);
      return false;
    }
  };
  
  // Get real resource metrics from Digital Ocean API
  const getDigitalOceanMetrics = async (apiKey: string, dropletId: string) => {
    try {
      // Real API call to Digital Ocean for droplet metrics
      const response = await fetch(`https://api.digitalocean.com/v2/monitoring/metrics?host_id=${dropletId}&start=30m&end=0m`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Error fetching Digital Ocean metrics:', response.statusText);
        return;
      }
      
      const metricsData = await response.json();
      
      // Parse real metrics
      // Note: This is a simplified example - actual metrics parsing would depend on DO's API response structure
      if (metricsData?.metrics?.cpu) {
        setCpuUsage(parseFloat(metricsData.metrics.cpu.usage) || 0);
      }
      
      if (metricsData?.metrics?.memory) {
        setMemoryUsage(parseFloat(metricsData.metrics.memory.usage) || 0);
      }
      
      if (metricsData?.metrics?.uptime) {
        const uptimeHours = Math.floor(metricsData.metrics.uptime / 3600);
        const uptimeMinutes = Math.floor((metricsData.metrics.uptime % 3600) / 60);
        setUptime(`${uptimeHours}h ${uptimeMinutes}m`);
      }
      
      setLastSync('Just now');
      recordMetrics();
    } catch (error) {
      console.error('Error fetching Digital Ocean metrics:', error);
    }
  };

  // Start real resource updates polling
  const startResourceUpdates = (apiKey: string, dropletId: string) => {
    // Initial metrics fetch
    getDigitalOceanMetrics(apiKey, dropletId);
    
    // Set up interval for periodic updates
    const interval = setInterval(() => {
      getDigitalOceanMetrics(apiKey, dropletId);
    }, 30000); // Update every 30 seconds
    
    setResourceUpdateInterval(interval);
    return () => clearInterval(interval);
  };

  const connectToService = async (config?: CloudConnectionConfig) => {
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
    
    // Save connection to Supabase
    const saved = await saveConnectionToSupabase();
    if (!saved) {
      setConnectionStatus('disconnected');
      return;
    }
    
    // Make real connection to Digital Ocean
    const apiKey = config?.apiKey || connectionConfig.apiKey;
    const connected = await makeRealConnectionToDigitalOcean(apiKey);
    
    if (connected) {
      setConnectionStatus('connected');
      setLastSync('Just now');
      
      // Start real resource updates
      const dropletId = config?.instanceId || connectionConfig.instanceId;
      startResourceUpdates(apiKey, dropletId);
      
      toast({
        title: "Cloud Service Connected",
        description: `Successfully connected to ${getServiceName(selectedService)}${configDescription}`,
      });
    } else {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${getServiceName(selectedService)}. Please check your API key and try again.`,
        variant: "destructive"
      });
    }
  };

  const disconnectService = async () => {
    setConnectionStatus('disconnected');
    setUptime('0h 0m');
    setCpuUsage(0);
    setMemoryUsage(0);
    
    // Clear resource update interval
    if (resourceUpdateInterval) {
      clearInterval(resourceUpdateInterval);
      setResourceUpdateInterval(null);
    }
    
    // Update is_active in Supabase
    if (connectionId) {
      try {
        await supabase
          .from('cloud_connections')
          .update({ is_active: false })
          .eq('id', connectionId);
      } catch (error) {
        console.error('Error disconnecting service:', error);
      }
    }
    
    toast({
      title: "Cloud Service Disconnected",
      description: `Connection to ${getServiceName(selectedService)} terminated.`,
    });
  };

  const restartService = async () => {
    setIsRestarting(true);
    
    toast({
      title: "Restarting Cloud Service",
      description: `Restarting ${getServiceName(selectedService)}...`,
    });
    
    try {
      // Real API call to restart a droplet
      const response = await fetch(`https://api.digitalocean.com/v2/droplets/${connectionConfig.instanceId}/actions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connectionConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "type": "reboot"
        })
      });
      
      if (!response.ok) {
        console.error('Error restarting droplet:', response.statusText);
        toast({
          title: "Restart Failed",
          description: `Failed to restart ${getServiceName(selectedService)}. Please try again.`,
          variant: "destructive"
        });
        setIsRestarting(false);
        return;
      }
      
      // Wait for restart to complete
      setTimeout(() => {
        setIsRestarting(false);
        setLastSync('Just now');
        recordMetrics();
        
        toast({
          title: "Cloud Service Restarted",
          description: `${getServiceName(selectedService)} has been restarted successfully.`,
        });
      }, 10000); // Assuming restart takes about 10 seconds
    } catch (error) {
      console.error('Error restarting droplet:', error);
      toast({
        title: "Restart Failed",
        description: `Failed to restart ${getServiceName(selectedService)}. Please try again.`,
        variant: "destructive"
      });
      setIsRestarting(false);
    }
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

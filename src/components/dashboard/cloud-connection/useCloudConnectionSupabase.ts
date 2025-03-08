
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
  const { toast } = useToast();

  // Load saved connection from Supabase on mount
  useEffect(() => {
    loadConnectionFromSupabase();
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
        
        // Restore connection
        setConnectionStatus('connecting');
        setTimeout(() => {
          setConnectionStatus('connected');
          startResourceUpdates();
          setLastSync('Restored connection');
        }, 1500);
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
        recordMetrics();
      }
    }, 5000);
    
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
    
    // Simulate successful connection
    setTimeout(() => {
      setConnectionStatus('connected');
      setLastSync('Just now');
      startResourceUpdates();
      
      toast({
        title: "Cloud Service Connected",
        description: `Successfully connected to ${getServiceName(selectedService)}${configDescription}`,
      });
    }, 2000);
  };

  const disconnectService = async () => {
    setConnectionStatus('disconnected');
    setUptime('0h 0m');
    setCpuUsage(0);
    setMemoryUsage(0);
    
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

  const restartService = () => {
    setIsRestarting(true);
    
    toast({
      title: "Restarting Cloud Service",
      description: `Restarting ${getServiceName(selectedService)}...`,
    });
    
    setTimeout(() => {
      setIsRestarting(false);
      setLastSync('Just now');
      recordMetrics();
      
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

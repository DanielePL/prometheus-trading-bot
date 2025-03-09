
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudConnection as CloudConnectionWrapper } from './cloud-connection';
import { useCloudConnectionSupabase } from './cloud-connection/useCloudConnectionSupabase';
import { CloudServiceType } from './cloud-connection/types';

export const CloudConnection = () => {
  const cloudConnection = useCloudConnectionSupabase();
  
  // Create a properly typed wrapper for setSelectedService
  const handleSetSelectedService = (service: CloudServiceType) => {
    cloudConnection.setSelectedService(service);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Connection</CardTitle>
        <CardDescription>
          Connect to your cloud provider to manage your trading infrastructure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CloudConnectionWrapper 
          {...cloudConnection}
          setSelectedService={handleSetSelectedService}
        />
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudConnection as CloudConnectionWrapper } from './cloud-connection';
import { useCloudConnectionSupabase } from './cloud-connection/useCloudConnectionSupabase';

export const CloudConnection = () => {
  const cloudConnection = useCloudConnectionSupabase();

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
        />
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  PositionSizer 
} from '@/components/risk-management/PositionSizer';
import { 
  StopLossCalculator 
} from '@/components/risk-management/StopLossCalculator';
import { 
  RiskMetricsPanel 
} from '@/components/risk-management/RiskMetricsPanel';
import { Shield, Calculator, Activity } from 'lucide-react';

export const RiskManagementTools = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Risk Management
        </CardTitle>
        <CardDescription>
          Tools to manage and mitigate trading risks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="position-sizer" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="position-sizer">Position Sizer</TabsTrigger>
            <TabsTrigger value="stop-loss">Stop Loss</TabsTrigger>
            <TabsTrigger value="risk-metrics">Risk Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="position-sizer">
            <PositionSizer />
          </TabsContent>
          
          <TabsContent value="stop-loss">
            <StopLossCalculator />
          </TabsContent>
          
          <TabsContent value="risk-metrics">
            <RiskMetricsPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

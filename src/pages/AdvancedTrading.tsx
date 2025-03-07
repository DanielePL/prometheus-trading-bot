
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskManagementTools } from '@/components/risk-management/RiskManagementTools';
import { BacktestingEngine } from '@/components/backtesting/BacktestingEngine';
import { PortfolioDiversificationTool } from '@/components/portfolio/PortfolioDiversificationTool';
import { Shield, Clock, Layers } from 'lucide-react';

const AdvancedTrading = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Trading</h1>
          <p className="text-muted-foreground mt-1">
            Professional-grade tools for risk management, backtesting, and portfolio optimization
          </p>
        </div>

        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="risk">
              <Shield className="h-4 w-4 mr-2" />
              Risk Management
            </TabsTrigger>
            <TabsTrigger value="backtest">
              <Clock className="h-4 w-4 mr-2" />
              Backtesting
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Layers className="h-4 w-4 mr-2" />
              Portfolio Optimization
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk">
            <RiskManagementTools />
          </TabsContent>
          
          <TabsContent value="backtest">
            <BacktestingEngine />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <PortfolioDiversificationTool />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdvancedTrading;

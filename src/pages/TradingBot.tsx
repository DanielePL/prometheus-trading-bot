
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingBot } from '@/components/trading/TradingBot';
import { TradingSystem } from '@/components/trading/TradingSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Zap, BarChart2, GitBranch, Bell, LayoutDashboard } from 'lucide-react';

// Trading system component that integrates the TradingBot and other subcomponents
const TradingBotPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Bot</h1>
          <p className="text-muted-foreground mt-1">
            Configure, monitor, and control your automated trading system
          </p>
        </div>

        <Tabs defaultValue="bot" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bot">
              <Zap className="h-4 w-4 mr-2" />
              Bot Control
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Bot Settings
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bot" className="space-y-4">
            <TradingBot />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Trading System Information</CardTitle>
                <CardDescription>Performance metrics and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
                    <div className="text-2xl font-bold">67%</div>
                    <p className="text-xs text-muted-foreground">
                      Based on last 100 trades
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Profit Factor</h3>
                    <div className="text-2xl font-bold">1.73</div>
                    <p className="text-xs text-muted-foreground">
                      Ratio of gross profits to gross losses
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Trade</h3>
                    <div className="text-2xl font-bold">$12.85</div>
                    <p className="text-xs text-muted-foreground">
                      Average profit per trade
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Bot Settings</CardTitle>
                <CardDescription>Configure your trading bot parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-24 text-center">
                  Bot settings panel to be implemented
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Trading Dashboard</CardTitle>
                <CardDescription>Performance overview and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-24 text-center">
                  Trading performance dashboard to be implemented
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Trading Alerts</CardTitle>
                <CardDescription>Configure and manage trading alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-24 text-center">
                  Trading alerts configuration to be implemented
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TradingBotPage;

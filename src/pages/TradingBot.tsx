
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingBot } from '@/components/trading/TradingBot';
import { TradingSystem } from '@/components/trading/TradingSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Zap, BarChart2, Bell, LayoutDashboard, 
  Brain, Shield, Calendar, Microscope 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskManager } from '@/components/trading/risk-management/RiskManager';
import { EventCorrelationView } from '@/components/event-analysis/EventCorrelationView';
import { PredictionEngine } from '@/components/event-analysis/PredictionEngine';
import { PatternIdentifier } from '@/components/event-analysis/PatternIdentifier';

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
            <TabsTrigger value="system">
              <BarChart2 className="h-4 w-4 mr-2" />
              Trading System
            </TabsTrigger>
            <TabsTrigger value="risk">
              <Shield className="h-4 w-4 mr-2" />
              Risk Management
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Event Analysis
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Brain className="h-4 w-4 mr-2" />
              AI Advisor
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
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <TradingSystem />
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RiskManager 
                  tradingPair="BTC-USD"
                  tradeMode="paper"
                  portfolioValue={25000}
                  isRunning={false}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Capital Preservation</CardTitle>
                    <CardDescription>Strategic risk management insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Risk management is essential for long-term trading success. Set appropriate position sizes and stop-loss levels to protect your capital from market volatility.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Use position sizing based on account risk percentages</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Set maximum drawdown limits for daily trading</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Implement dynamic stop-losses based on volatility</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Monitor portfolio correlation to reduce systemic risk</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <EventCorrelationView 
                    cryptocurrency="BTC"
                    dateRange={{ from: new Date(2022, 0, 1), to: new Date() }}
                    eventCategories={['economic', 'regulatory', 'political']}
                  />
                </div>
                <div>
                  <PatternIdentifier 
                    cryptocurrency="BTC"
                    dateRange={{ from: new Date(2022, 0, 1), to: new Date() }}
                    eventCategories={['economic', 'regulatory', 'political']}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="grid grid-cols-1 gap-6">
              <PredictionEngine 
                cryptocurrency="BTC"
                eventCategories={['economic', 'regulatory', 'political', 'disaster']}
              />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>AI Trading Advisor</CardTitle>
                    <CardDescription>Smart analysis and recommendations</CardDescription>
                  </div>
                  <Microscope className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      The AI advisor analyzes market patterns, news events, and historical correlations to 
                      provide trading recommendations optimized for your specific risk profile and goals.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-base font-medium flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-accent" />
                        Trading Recommendation
                      </h4>
                      <p className="mt-2 text-sm">
                        Based on recent Federal Reserve statements and upcoming regulatory decisions, 
                        expect increased volatility in Bitcoin over the next 7-10 days. Consider reducing 
                        position sizes and implementing tighter stop-losses until market direction becomes 
                        clearer. Historical analysis suggests a potential support level at $37,800.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="mt-6">
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

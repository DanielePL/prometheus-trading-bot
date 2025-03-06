
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Activity, TrendingUp, PieChart, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Performance = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze your Prometheus Trade Bot performance metrics
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="history">Historical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">$12,548.32</div>
                    <div className="ml-2 flex items-center text-sm text-green-500">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      12.5%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Since bot activation</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">68.7%</div>
                    <div className="ml-2 flex items-center text-sm text-green-500">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      2.1%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Compared to last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">4.2%</div>
                    <div className="ml-2 flex items-center text-sm text-red-500">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      0.8%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Maximum in current period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">1.82</div>
                    <div className="ml-2 flex items-center text-sm text-green-500">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      0.24
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
                </CardContent>
              </Card>
            </div>
            
            <PerformanceChart />
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profit and Loss History</CardTitle>
                  <CardDescription>Daily P&L for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                    <TrendingUp className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Chart will be implemented here</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key trading statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Trade Duration</span>
                    <span className="font-medium">4h 12m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Factor</span>
                    <span className="font-medium">2.14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Consecutive Wins</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Consecutive Losses</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recovery Factor</span>
                    <span className="font-medium">3.82</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trades per Day</span>
                    <span className="font-medium">6.3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Breakdown of performance by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                  <Calendar className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Monthly performance chart will be implemented here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Performance;

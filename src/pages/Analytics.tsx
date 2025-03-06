
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, PieChart, LineChart, Activity, 
  Download, Calendar, Share2, TrendingUp, 
  BarChart2, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Detailed analysis and insights into your trading performance
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium">Average Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">2.4%</div>
                <div className="ml-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  0.3%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per winning trade</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">-1.2%</div>
                <div className="ml-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  0.1%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per losing trade</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">2.14</div>
                <div className="ml-2 flex items-center text-sm text-red-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  0.12
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Gross profit / gross loss</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="timeframes">Timeframes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Profit and Loss</CardTitle>
                  <CardDescription>Daily PnL for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                    <BarChart className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">PnL chart will be implemented here</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Performance by Strategy</CardTitle>
                  <CardDescription>Total profit distribution across strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                    <PieChart className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Strategy distribution chart will be implemented here</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Return</CardTitle>
                <CardDescription>Growth of $10,000 invested at bot launch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
                  <LineChart className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Equity curve will be implemented here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
                <CardDescription>Comparison of all trading strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-md">
                  <BarChart2 className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Strategy comparison chart will be implemented here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assets" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>Profit and loss by cryptocurrency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-md">
                  <Activity className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Asset performance chart will be implemented here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeframes" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Time-Based Analysis</CardTitle>
                <CardDescription>Performance by time of day, day of week, and month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-md">
                  <TrendingUp className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Time-based performance chart will be implemented here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-0.5">
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>
                Key risk metrics for your trading strategy
              </CardDescription>
            </div>
            <AlertCircle className="w-4 h-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Max Drawdown</div>
              <div className="text-2xl font-bold">6.2%</div>
              <div className="text-xs text-muted-foreground">Largest peak-to-trough decline</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Sharpe Ratio</div>
              <div className="text-2xl font-bold">1.82</div>
              <div className="text-xs text-muted-foreground">Risk-adjusted return metric</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Volatility</div>
              <div className="text-2xl font-bold">2.8%</div>
              <div className="text-xs text-muted-foreground">Daily standard deviation</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;

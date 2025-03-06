
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, CreditCard, Coins, CircleDollarSign, Wallet } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export const PortfolioOverview = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Balance"
          value="$145,289.57"
          change={3.2}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatsCard
          title="Available Cash"
          value="$32,410.85"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Profit/Loss"
          value="$17,583.22"
          change={5.8}
          icon={<CircleDollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Assets Count"
          value="12"
          icon={<Coins className="h-4 w-4" />}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Value changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1month">
            <TabsList className="mb-2">
              <TabsTrigger value="1week">1W</TabsTrigger>
              <TabsTrigger value="1month">1M</TabsTrigger>
              <TabsTrigger value="3months">3M</TabsTrigger>
              <TabsTrigger value="1year">1Y</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="1week" className="h-[200px] flex items-center justify-center text-muted-foreground">
              Weekly performance chart (placeholder)
            </TabsContent>
            <TabsContent value="1month" className="h-[200px] flex items-center justify-center text-muted-foreground">
              Monthly performance chart (placeholder)
            </TabsContent>
            <TabsContent value="3months" className="h-[200px] flex items-center justify-center text-muted-foreground">
              3-month performance chart (placeholder)
            </TabsContent>
            <TabsContent value="1year" className="h-[200px] flex items-center justify-center text-muted-foreground">
              Yearly performance chart (placeholder)
            </TabsContent>
            <TabsContent value="all" className="h-[200px] flex items-center justify-center text-muted-foreground">
              All-time performance chart (placeholder)
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

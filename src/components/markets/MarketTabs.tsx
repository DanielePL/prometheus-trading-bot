
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const MarketTabs = () => {
  return (
    <TabsList>
      <TabsTrigger value="all">All Markets</TabsTrigger>
      <TabsTrigger value="tracked">Tracked</TabsTrigger>
      <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
    </TabsList>
  );
};

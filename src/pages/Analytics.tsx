
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
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsMetrics } from '@/components/analytics/AnalyticsMetrics';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Detailed analysis and insights into your trading performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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

        <AnalyticsMetrics />
        
        <AnalyticsCharts />
        
        <AnalyticsOverview />
      </div>
    </AppLayout>
  );
};

export default Analytics;

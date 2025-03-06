
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';
import { PortfolioAllocations } from '@/components/portfolio/PortfolioAllocations';
import { PortfolioHoldings } from '@/components/portfolio/PortfolioHoldings';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Filter, RefreshCw } from 'lucide-react';

const Portfolio = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your trading assets and allocations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <PortfolioOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PortfolioAllocations />
          </div>
          <div className="lg:col-span-2">
            <PortfolioHoldings />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Portfolio;

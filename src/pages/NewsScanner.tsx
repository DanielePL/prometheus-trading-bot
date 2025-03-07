
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NewsSourceManager } from '@/components/news/NewsSourceManager';
import { NewsResults } from '@/components/news/NewsResults';
import { ScanStatusCard } from '@/components/news/ScanStatusCard';
import { SemanticInsights } from '@/components/news/SemanticInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NewsScanner = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Scan and analyze news sources to enhance trading decisions with semantic analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <NewsResults />
            <SemanticInsights />
          </div>
          <div className="space-y-6">
            <ScanStatusCard />
            <NewsSourceManager />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewsScanner;

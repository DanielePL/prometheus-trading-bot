
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NewsSourceManager } from '@/components/news/NewsSourceManager';
import { NewsResults } from '@/components/news/NewsResults';
import { ScanStatusCard } from '@/components/news/ScanStatusCard';
import { SemanticInsights } from '@/components/news/SemanticInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { scanAllSources } from '@/services/newsCrawlerService';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const NewsScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('news');
  
  const handleScan = async () => {
    setIsScanning(true);
    try {
      await scanAllSources();
      toast.success('Scan completed successfully');
    } catch (error) {
      toast.error('Scan failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
            <p className="text-muted-foreground mt-1">
              Scan and analyze news sources to enhance trading decisions with semantic analysis
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleScan}
            disabled={isScanning}
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="news">News & Analysis</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <NewsResults />
                <SemanticInsights />
              </div>
              <div className="space-y-6">
                <ScanStatusCard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources">
            <NewsSourceManager />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default NewsScanner;

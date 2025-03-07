
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/event-analysis/DateRangePicker';
import { EventCorrelationView } from '@/components/event-analysis/EventCorrelationView';
import { PredictionEngine } from '@/components/event-analysis/PredictionEngine';
import { PatternIdentifier } from '@/components/event-analysis/PatternIdentifier';
import { WorldEventTimeline } from '@/components/event-analysis/WorldEventTimeline';
import { Download, Filter, Calendar, LineChart, Settings, Brain } from 'lucide-react';
import { toast } from 'sonner';

const EventAnalysis = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1y');
  const [eventCategories, setEventCategories] = useState<string[]>(['economic', 'political', 'regulatory']);
  const [dateRange, setDateRange] = useState({ from: new Date(2020, 0, 1), to: new Date() });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    toast.info("Starting deep analysis of historical data and events");
    
    // Simulate analysis completion
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete - patterns identified");
    }, 3000);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event-Based Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Analyze cryptocurrency patterns in relation to world events
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Historical View
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Analysis
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
            >
              <Brain className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Analysis Parameters</CardTitle>
              <CardDescription>Configure data sources and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cryptocurrency</label>
                <Select 
                  value={selectedCrypto} 
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                    <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Frame</label>
                <Select 
                  value={timeframe} 
                  onValueChange={setTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="3y">3 Years</SelectItem>
                    <SelectItem value="5y">5 Years</SelectItem>
                    <SelectItem value="max">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker 
                  dateRange={dateRange} 
                  onUpdate={setDateRange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Categories</label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={eventCategories.includes('economic') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (eventCategories.includes('economic')) {
                        setEventCategories(eventCategories.filter(c => c !== 'economic'));
                      } else {
                        setEventCategories([...eventCategories, 'economic']);
                      }
                    }}
                  >
                    Economic
                  </Button>
                  <Button 
                    variant={eventCategories.includes('political') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (eventCategories.includes('political')) {
                        setEventCategories(eventCategories.filter(c => c !== 'political'));
                      } else {
                        setEventCategories([...eventCategories, 'political']);
                      }
                    }}
                  >
                    Political
                  </Button>
                  <Button 
                    variant={eventCategories.includes('regulatory') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (eventCategories.includes('regulatory')) {
                        setEventCategories(eventCategories.filter(c => c !== 'regulatory'));
                      } else {
                        setEventCategories([...eventCategories, 'regulatory']);
                      }
                    }}
                  >
                    Regulatory
                  </Button>
                  <Button 
                    variant={eventCategories.includes('disaster') ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (eventCategories.includes('disaster')) {
                        setEventCategories(eventCategories.filter(c => c !== 'disaster'));
                      } else {
                        setEventCategories([...eventCategories, 'disaster']);
                      }
                    }}
                  >
                    Disasters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3 space-y-4">
            <Tabs defaultValue="correlation" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="correlation">Event Correlation</TabsTrigger>
                <TabsTrigger value="patterns">Pattern Identification</TabsTrigger>
                <TabsTrigger value="prediction">Prediction Engine</TabsTrigger>
                <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="correlation">
                <EventCorrelationView 
                  cryptocurrency={selectedCrypto}
                  dateRange={dateRange}
                  eventCategories={eventCategories}
                />
              </TabsContent>
              
              <TabsContent value="patterns">
                <PatternIdentifier 
                  cryptocurrency={selectedCrypto}
                  dateRange={dateRange}
                  eventCategories={eventCategories}
                />
              </TabsContent>
              
              <TabsContent value="prediction">
                <PredictionEngine 
                  cryptocurrency={selectedCrypto}
                  eventCategories={eventCategories}
                />
              </TabsContent>
              
              <TabsContent value="timeline">
                <WorldEventTimeline 
                  dateRange={dateRange}
                  eventCategories={eventCategories}
                  cryptocurrency={selectedCrypto}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventAnalysis;

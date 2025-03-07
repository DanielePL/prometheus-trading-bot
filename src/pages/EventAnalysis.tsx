
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/event-analysis/DateRangePicker';
import { EventCorrelationView } from '@/components/event-analysis/EventCorrelationView';
import { PatternIdentifier } from '@/components/event-analysis/PatternIdentifier';
import { WorldEventTimeline } from '@/components/event-analysis/WorldEventTimeline';
import { PredictionEngine } from '@/components/event-analysis/PredictionEngine';
import { addMonths, subMonths } from 'date-fns';

export default function EventAnalysis() {
  // Default date range of last 6 months
  const defaultFrom = subMonths(new Date(), 6);
  const defaultTo = new Date();
  
  const [cryptocurrency, setCryptocurrency] = useState('Bitcoin');
  const [dateRange, setDateRange] = useState<DateRange>({ from: defaultFrom, to: defaultTo });
  const [selectedTab, setSelectedTab] = useState('correlation');
  const [eventCategories, setEventCategories] = useState(['economic', 'political', 'regulatory', 'disaster']);
  
  const handleEventCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setEventCategories([...eventCategories, category]);
    } else {
      setEventCategories(eventCategories.filter(cat => cat !== category));
    }
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };
  
  return (
    <AppLayout>
      <div className="container p-4 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Event Analysis</h1>
            <p className="text-muted-foreground">
              Analyze how real-world events correlate with cryptocurrency price movements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Analysis Parameters</CardTitle>
                <CardDescription>Configure your analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
                  <Select 
                    value={cryptocurrency} 
                    onValueChange={setCryptocurrency}
                  >
                    <SelectTrigger id="cryptocurrency">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="Ethereum">Ethereum (ETH)</SelectItem>
                      <SelectItem value="Solana">Solana (SOL)</SelectItem>
                      <SelectItem value="Cardano">Cardano (ADA)</SelectItem>
                      <SelectItem value="Ripple">Ripple (XRP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <DateRangePicker 
                    dateRange={dateRange}
                    onUpdate={handleDateRangeChange}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Event Categories</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="economic" 
                        checked={eventCategories.includes('economic')}
                        onCheckedChange={(checked) => handleEventCategoryChange('economic', checked as boolean)}
                      />
                      <Label htmlFor="economic" className="font-normal">Economic Events</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="political" 
                        checked={eventCategories.includes('political')}
                        onCheckedChange={(checked) => handleEventCategoryChange('political', checked as boolean)}
                      />
                      <Label htmlFor="political" className="font-normal">Political Events</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="regulatory" 
                        checked={eventCategories.includes('regulatory')}
                        onCheckedChange={(checked) => handleEventCategoryChange('regulatory', checked as boolean)}
                      />
                      <Label htmlFor="regulatory" className="font-normal">Regulatory Changes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="disaster" 
                        checked={eventCategories.includes('disaster')}
                        onCheckedChange={(checked) => handleEventCategoryChange('disaster', checked as boolean)}
                      />
                      <Label htmlFor="disaster" className="font-normal">Disasters & Crises</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <Tabs 
                  defaultValue="correlation" 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="correlation">Correlation</TabsTrigger>
                    <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    <TabsTrigger value="prediction">Prediction</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                  
                  <CardTitle>
                    {selectedTab === 'correlation' && 'Event Correlation Analysis'}
                    {selectedTab === 'patterns' && 'Pattern Identification'}
                    {selectedTab === 'prediction' && 'Future Event Prediction'}
                    {selectedTab === 'timeline' && 'World Event Timeline'}
                  </CardTitle>
                  <CardDescription>
                    {selectedTab === 'correlation' && `Analyze how ${cryptocurrency} price correlates with world events`}
                    {selectedTab === 'patterns' && `Identify patterns between ${cryptocurrency} price movements and world events`}
                    {selectedTab === 'prediction' && `Predict how ${cryptocurrency} might react to upcoming events`}
                    {selectedTab === 'timeline' && `View a timeline of events that impacted ${cryptocurrency}`}
                  </CardDescription>
                </Tabs>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <TabsContent value="correlation" className="mt-0">
                  <EventCorrelationView 
                    cryptocurrency={cryptocurrency}
                    dateRange={dateRange as { from: Date; to: Date }}
                    eventCategories={eventCategories}
                  />
                </TabsContent>
                
                <TabsContent value="patterns" className="mt-0">
                  <PatternIdentifier 
                    cryptocurrency={cryptocurrency}
                    dateRange={dateRange as { from: Date; to: Date }}
                    eventCategories={eventCategories}
                  />
                </TabsContent>
                
                <TabsContent value="prediction" className="mt-0">
                  <PredictionEngine 
                    cryptocurrency={cryptocurrency}
                    dateRange={dateRange as { from: Date; to: Date }}
                    eventCategories={eventCategories}
                  />
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-0">
                  <WorldEventTimeline 
                    cryptocurrency={cryptocurrency}
                    dateRange={dateRange as { from: Date; to: Date }}
                    eventCategories={eventCategories}
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

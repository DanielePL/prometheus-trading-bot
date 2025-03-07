
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { TrendingUp, TrendingDown, History, Tag } from 'lucide-react';

interface WorldEventTimelineProps {
  dateRange: { from: Date; to: Date };
  eventCategories: string[];
  cryptocurrency: string;
}

// Generate mock data for the timeline
const generateTimelineData = (crypto: string, categories: string[]) => {
  // Use a fixed seed for reproducibility
  const baseDate = new Date(2021, 0, 1);
  const endDate = new Date(2023, 3, 30);
  
  // Base prices by crypto
  const basePrices: Record<string, number> = {
    'BTC': 30000,
    'ETH': 1200,
    'SOL': 30,
    'ADA': 0.20,
    'DOT': 5,
  };
  
  const basePrice = basePrices[crypto] || 1000;
  
  // Generate price data with some key events
  const priceData = [];
  const events = [];
  
  let currentDate = new Date(baseDate);
  let currentPrice = basePrice;
  let id = 1;
  
  while (currentDate <= endDate) {
    // Add price point
    priceData.push({
      date: currentDate.toISOString().split('T')[0],
      price: currentPrice,
    });
    
    // Randomly add events (more frequent for the selected categories)
    if (Math.random() < 0.06) {
      const eventTypes = [
        { category: 'economic', name: 'Interest Rate Decision', description: 'Federal Reserve adjusts interest rates', impact: -5 },
        { category: 'economic', name: 'Inflation Report', description: 'Higher than expected inflation reported', impact: -8 },
        { category: 'economic', name: 'Corporate Adoption', description: 'Major company adds crypto to balance sheet', impact: 12 },
        { category: 'economic', name: 'Banking Crisis', description: 'Banking instability drives crypto interest', impact: 15 },
        { category: 'political', name: 'Election Results', description: 'Pro-crypto candidate elected', impact: 7 },
        { category: 'political', name: 'Geopolitical Tension', description: 'Regional conflict impacts markets', impact: -6 },
        { category: 'political', name: 'Government Endorsement', description: 'Country announces bitcoin adoption plans', impact: 18 },
        { category: 'regulatory', name: 'Regulatory Crackdown', description: 'Major country announces restrictive regulation', impact: -20 },
        { category: 'regulatory', name: 'Favorable Ruling', description: 'Court rules in favor of crypto innovation', impact: 10 },
        { category: 'regulatory', name: 'Exchange Approval', description: 'Regulatory approval for major exchange or product', impact: 8 },
        { category: 'disaster', name: 'Exchange Hack', description: 'Major cryptocurrency exchange suffers security breach', impact: -15 },
        { category: 'disaster', name: 'Protocol Exploit', description: 'Vulnerability exposed in major protocol', impact: -25 },
        { category: 'disaster', name: 'Stablecoin Collapse', description: 'Major stablecoin loses its peg', impact: -22 },
      ];
      
      // Filter by selected categories
      const filteredEvents = eventTypes.filter(e => categories.includes(e.category));
      
      if (filteredEvents.length > 0) {
        const eventTemplate = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
        const eventDate = new Date(currentDate);
        
        events.push({
          id: id++,
          date: eventDate.toISOString().split('T')[0],
          name: eventTemplate.name,
          description: eventTemplate.description,
          category: eventTemplate.category,
          impact: eventTemplate.impact,
          duration: Math.floor(Math.random() * 14) + 1, // 1-14 days
        });
        
        // Apply event's impact to price over the next several days
        currentPrice = currentPrice * (1 + eventTemplate.impact / 100);
      }
    }
    
    // Add some random price movement
    currentPrice = currentPrice * (0.99 + Math.random() * 0.04);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return { priceData, events };
};

export const WorldEventTimeline = ({
  dateRange,
  eventCategories,
  cryptocurrency
}: WorldEventTimelineProps) => {
  const { priceData, events } = generateTimelineData(cryptocurrency, eventCategories);
  
  // Filter events by selected date range
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= dateRange.from && eventDate <= dateRange.to;
  });
  
  // Filter price data by selected date range
  const filteredPriceData = priceData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'economic':
        return '💰';
      case 'political':
        return '🏛️';
      case 'regulatory':
        return '⚖️';
      case 'disaster':
        return '🚨';
      default:
        return '📅';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic':
        return 'rgb(34, 197, 94)';
      case 'political':
        return 'rgb(168, 85, 247)';
      case 'regulatory':
        return 'rgb(59, 130, 246)';
      case 'disaster':
        return 'rgb(239, 68, 68)';
      default:
        return 'rgb(100, 116, 139)';
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'economic':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Economic</Badge>;
      case 'political':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Political</Badge>;
      case 'regulatory':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Regulatory</Badge>;
      case 'disaster':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Disaster</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>World Events Timeline</CardTitle>
        <CardDescription>
          Historical events that impacted {cryptocurrency} prices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredPriceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={formatDateLabel}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => formatDateLabel(label as string)}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="var(--accent)" 
                fill="var(--accent)" 
                fillOpacity={0.1}
              />
              
              {/* Event reference lines */}
              {filteredEvents.map(event => (
                <ReferenceLine 
                  key={event.id}
                  x={event.date} 
                  stroke={getCategoryColor(event.category)} 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: getCategoryIcon(event.category), 
                    position: event.impact > 0 ? 'top' : 'bottom',
                    fill: getCategoryColor(event.category)
                  }} 
                />
              ))}
              
              {/* Event impact areas */}
              {filteredEvents.map(event => {
                // Calculate end date by adding duration
                const startDate = new Date(event.date);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + event.duration);
                
                // Only show area if it's within our filtered data
                if (endDate > dateRange.from && startDate < dateRange.to) {
                  return (
                    <ReferenceArea 
                      key={`area-${event.id}`}
                      x1={event.date} 
                      x2={endDate.toISOString().split('T')[0]}
                      fill={getCategoryColor(event.category)}
                      fillOpacity={0.1}
                      stroke={getCategoryColor(event.category)}
                      strokeOpacity={0.3}
                    />
                  );
                }
                return null;
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium flex items-center">
              <History className="h-5 w-5 mr-2 text-muted-foreground" />
              Significant Events
            </h3>
            <div className="flex flex-wrap gap-2">
              {eventCategories.map(category => (
                <div key={category} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor(category) }}></span>
                  <span className="text-xs">{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(event => (
                    <div key={event.id} className="flex gap-4 relative pb-6">
                      <div className="w-12 flex-shrink-0 text-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ 
                            backgroundColor: `${getCategoryColor(event.category)}20`, 
                            color: getCategoryColor(event.category)
                          }}
                        >
                          {getCategoryIcon(event.category)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <h4 className="font-semibold">{event.name}</h4>
                            <div className="flex items-center mt-1">
                              {getCategoryBadge(event.category)}
                              <span className="ml-2 text-sm text-muted-foreground">
                                {formatDateLabel(event.date)}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center text-sm font-medium ${event.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {event.impact > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {event.impact > 0 ? '+' : ''}{event.impact}% impact
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        {event.duration > 1 && (
                          <div className="mt-1 text-xs text-muted-foreground flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            Market impact lasted approximately {event.duration} days
                          </div>
                        )}
                      </div>
                      
                      {/* Connecting line */}
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No significant events found for the selected timeframe and categories</p>
                  <p className="text-sm mt-2">Try selecting a wider date range or more event categories</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

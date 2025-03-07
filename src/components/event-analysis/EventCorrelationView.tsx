
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';

interface EventCorrelationViewProps {
  cryptocurrency: string;
  dateRange: { from: Date; to: Date };
  eventCategories: string[];
}

// Mock data generator for the correlation view
const generateEventCorrelationData = (crypto: string, categories: string[]) => {
  // Generate event data points with correlation to price
  const eventTypes = {
    economic: { color: 'rgb(34, 197, 94)', name: 'Economic Events' },
    political: { color: 'rgb(168, 85, 247)', name: 'Political Events' },
    regulatory: { color: 'rgb(59, 130, 246)', name: 'Regulatory Events' },
    disaster: { color: 'rgb(239, 68, 68)', name: 'Disasters' },
  };
  
  type EventType = keyof typeof eventTypes;
  
  // Generate data points for selected categories
  const data = categories.flatMap(category => {
    const evType = category as EventType;
    return Array.from({ length: 15 }).map((_, i) => {
      // Price impact: -50% to +50%
      const priceImpact = (Math.random() - 0.5) * 100; 
      
      // Time delay: 0 to 30 days
      const timeDelay = Math.random() * 30; 
      
      // Impact duration: 1 to 60 days
      const impactDuration = 1 + Math.random() * 59; 
      
      // Event magnitude: 1 to 10
      const magnitude = 1 + Math.random() * 9; 
      
      return {
        category,
        name: `${evType.charAt(0).toUpperCase() + evType.slice(1)} Event ${i+1}`,
        priceImpact,
        timeDelay,
        impactDuration,
        magnitude,
        fill: eventTypes[evType].color
      };
    });
  });
  
  return { data, eventTypes };
};

export const EventCorrelationView = ({ 
  cryptocurrency,
  dateRange,
  eventCategories 
}: EventCorrelationViewProps) => {
  const { data, eventTypes } = generateEventCorrelationData(cryptocurrency, eventCategories);
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Event Correlation Analysis</CardTitle>
            <CardDescription>
              Price impact vs. time delay after events for {cryptocurrency}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventCategories.map(category => (
              <Badge key={category} variant="outline" style={{
                backgroundColor: eventTypes[category as keyof typeof eventTypes]?.color + '20',
                color: eventTypes[category as keyof typeof eventTypes]?.color
              }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                type="number" 
                dataKey="timeDelay" 
                name="Time Delay" 
                unit=" days" 
                label={{ value: 'Time Delay (days)', position: 'insideBottom', offset: -10 }}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                type="number" 
                dataKey="priceImpact" 
                name="Price Impact" 
                unit="%" 
                label={{ value: 'Price Impact (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <ZAxis 
                type="number" 
                dataKey="magnitude" 
                range={[60, 400]} 
                name="Event Magnitude" 
                unit=" pts" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any, name: string) => {
                  if (name === 'Price Impact') return [`${value.toFixed(2)}%`, name];
                  if (name === 'Time Delay') return [`${value.toFixed(1)} days`, name];
                  if (name === 'Event Magnitude') return [`${value.toFixed(1)} pts`, name];
                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border p-3 rounded-lg shadow-md text-sm">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">Category: {data.category.charAt(0).toUpperCase() + data.category.slice(1)}</p>
                        <p className="text-sm">Price Impact: {data.priceImpact.toFixed(2)}%</p>
                        <p className="text-sm">Time Delay: {data.timeDelay.toFixed(1)} days</p>
                        <p className="text-sm">Impact Duration: {data.impactDuration.toFixed(1)} days</p>
                        <p className="text-sm">Event Magnitude: {data.magnitude.toFixed(1)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {eventCategories.map(category => (
                <Scatter 
                  key={category}
                  name={eventTypes[category as keyof typeof eventTypes]?.name || category}
                  data={data.filter(item => item.category === category)}
                  fill={eventTypes[category as keyof typeof eventTypes]?.color || '#8884d8'}
                />
              ))}
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This chart displays the correlation between world events and {cryptocurrency} price movements.
            Each bubble represents an event, with the size indicating the event's magnitude.
            The X-axis shows the time delay before price impact, while the Y-axis shows the percentage price change.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

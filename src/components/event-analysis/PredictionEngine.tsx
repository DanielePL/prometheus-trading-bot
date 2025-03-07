import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Brain, Copy, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PredictionEngineProps {
  cryptocurrency: string;
  eventCategories: string[];
  dateRange?: { from: Date; to: Date };
}

// Helper function to get date strings for the next 30 days
const getNextDays = (days: number) => {
  const result = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    result.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  return result;
};

export const PredictionEngine = ({
  cryptocurrency,
  eventCategories,
  dateRange
}: PredictionEngineProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pricePrediction, setPricePrediction] = useState<{
    current: number;
    predicted: number;
    confidence: number;
    trend: 'up' | 'down' | 'neutral';
    horizon: number;
  } | null>(null);
  
  useEffect(() => {
    // Base prices for different cryptocurrencies
    const basePrices: Record<string, number> = {
      'BTC': 40000,
      'ETH': 2200,
      'SOL': 120,
      'ADA': 0.45,
      'DOT': 6.8,
    };
    
    const basePrice = basePrices[cryptocurrency] || 1000;
    const currentPrice = basePrice * (0.95 + Math.random() * 0.1); // Random current price around base
    
    const dateLabels = getNextDays(30);
    
    // Generate prediction line (slightly trending upward with noise)
    const predictionData = dateLabels.map((date, i) => {
      // Add some trend and randomness
      const dayFactor = i / 30;
      const trendFactor = Math.random() > 0.7 ? 1.1 : 1.03; // Occasionally stronger trend
      const noiseFactor = 0.98 + Math.random() * 0.04; // Random noise
      
      // Calculate price with increasing volatility over time
      const volatilityFactor = 1 + (i / 30) * 0.1; // Volatility increases with time
      const price = currentPrice * Math.pow(trendFactor, dayFactor) * noiseFactor * volatilityFactor;
      
      return {
        date,
        price: parseFloat(price.toFixed(2)),
        lower: parseFloat((price * (0.97 - dayFactor * 0.08)).toFixed(2)),
        upper: parseFloat((price * (1.03 + dayFactor * 0.08)).toFixed(2)),
      };
    });
    
    // Upcoming events that might affect price
    const mockEvents = [
      {
        id: 1,
        name: 'Federal Reserve Meeting',
        date: dateLabels[4],
        category: 'economic',
        description: 'Discussion of interest rates and monetary policy',
        impact: 'high',
        predictedEffect: -3.2,
        reliability: 87
      },
      {
        id: 2,
        name: 'EU Crypto Regulation Vote',
        date: dateLabels[8],
        category: 'regulatory',
        description: 'Final vote on the Markets in Crypto-Assets (MiCA) regulation',
        impact: 'high',
        predictedEffect: -5.8,
        reliability: 92
      },
      {
        id: 3,
        name: 'Major Tech Company Earnings',
        date: dateLabels[12],
        category: 'economic',
        description: 'Quarterly earnings report of a major tech company with crypto holdings',
        impact: 'medium',
        predictedEffect: 2.1,
        reliability: 76
      },
      {
        id: 4,
        name: 'Crypto Conference',
        date: dateLabels[17],
        category: 'economic',
        description: 'Major blockchain conference with expected project announcements',
        impact: 'medium',
        predictedEffect: 4.3,
        reliability: 68
      },
      {
        id: 5,
        name: 'Political Elections',
        date: dateLabels[22],
        category: 'political',
        description: 'Elections in a major economy with crypto-friendly candidates',
        impact: 'high',
        predictedEffect: 7.6,
        reliability: 72
      },
    ].filter(event => eventCategories.includes(event.category));
    
    // Filter events by selected categories
    setUpcomingEvents(mockEvents);
    
    // Generate final prediction
    const lastDay = predictionData[predictionData.length - 1];
    const predictedPrice = lastDay.price;
    const trend = predictedPrice > currentPrice ? 'up' : 
                 predictedPrice < currentPrice ? 'down' : 'neutral';
    
    setPricePrediction({
      current: currentPrice,
      predicted: predictedPrice,
      confidence: 72 + Math.random() * 10,
      trend,
      horizon: 30
    });
    
    setPredictions(predictionData);
  }, [cryptocurrency, eventCategories]);
  
  const handleRunPrediction = () => {
    setIsLoading(true);
    toast.info("Running AI prediction model");
    
    // Simulate prediction completion
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Prediction complete - results updated");
    }, 2000);
  };
  
  const handleCopyReport = () => {
    let report = `Crypto AI Prediction Report for ${cryptocurrency}\n`;
    report += `Current price: $${pricePrediction?.current.toFixed(2)}\n`;
    report += `Predicted price in ${pricePrediction?.horizon} days: $${pricePrediction?.predicted.toFixed(2)}\n`;
    report += `Confidence: ${pricePrediction?.confidence.toFixed(1)}%\n\n`;
    
    report += "Upcoming events that may impact price:\n";
    upcomingEvents.forEach(event => {
      report += `- ${event.date}: ${event.name} (${event.category})\n`;
      report += `  Impact: ${event.impact}, Predicted effect: ${event.predictedEffect}%\n`;
    });
    
    navigator.clipboard.writeText(report);
    toast.success("Prediction report copied to clipboard");
  };
  
  const getPercentageChange = () => {
    if (!pricePrediction) return 0;
    return ((pricePrediction.predicted - pricePrediction.current) / pricePrediction.current) * 100;
  };
  
  const percentChange = getPercentageChange();
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Prediction Engine</CardTitle>
            <CardDescription>
              AI-powered price prediction based on historical event correlations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={handleCopyReport}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Report
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleRunPrediction}
              disabled={isLoading}
            >
              <Brain className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading ? 'Running...' : 'Run Prediction'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!pricePrediction ? (
          <div className="py-8 text-center text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium">No prediction available</h3>
            <p className="mt-1">
              Run the prediction engine to generate price forecasts
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                    <h3 className="text-2xl font-bold mt-1">${pricePrediction.current.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Predicted Price ({pricePrediction.horizon} days)
                    </p>
                    <h3 className="text-2xl font-bold mt-1 flex items-center justify-center">
                      ${pricePrediction.predicted.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                      <span className={`ml-2 text-sm ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {percentChange >= 0 ? (
                          <ArrowUpRight className="inline h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="inline h-4 w-4" />
                        )}
                        {Math.abs(percentChange).toFixed(2)}%
                      </span>
                    </h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Prediction Confidence</p>
                    <h3 className="text-2xl font-bold mt-1">{pricePrediction.confidence.toFixed(1)}%</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']}
                  />
                  <ReferenceLine 
                    y={pricePrediction.current} 
                    stroke="var(--accent)" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Current Price', 
                      position: 'left',
                      fill: 'var(--accent)',
                      fontSize: 12
                    }} 
                  />
                  {upcomingEvents.map(event => (
                    <ReferenceLine 
                      key={event.id}
                      x={event.date} 
                      stroke={event.predictedEffect >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                      strokeDasharray="3 3" 
                      label={{ 
                        value: event.name, 
                        position: 'top',
                        fontSize: 10,
                        fill: event.predictedEffect >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"
                      }} 
                    />
                  ))}
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="var(--accent)" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="var(--accent)" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    activeDot={false}
                    strokeOpacity={0.6}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="var(--accent)" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    activeDot={false}
                    strokeOpacity={0.6}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <Alert key={event.id} variant="outline" className="py-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <AlertTitle className="flex items-center">
                            {event.name}
                            <Badge 
                              variant="outline" 
                              className="ml-2"
                              style={{
                                backgroundColor: event.predictedEffect >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: event.predictedEffect >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                              }}
                            >
                              {event.predictedEffect >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {event.predictedEffect >= 0 ? '+' : ''}{event.predictedEffect}%
                            </Badge>
                          </AlertTitle>
                          <AlertDescription className="text-sm mt-1">
                            {event.description}
                          </AlertDescription>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{event.date}</div>
                          <div className="text-muted-foreground capitalize">{event.category}</div>
                          <div className="text-xs mt-1">
                            Reliability: {event.reliability}%
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No upcoming events found for selected categories</p>
                  </div>
                )}
              </div>
            </div>
            
            <Alert variant={percentChange >= 0 ? "default" : "destructive"} className="mt-4">
              <AlertTitle className="flex items-center">
                {percentChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2" />
                )}
                AI Prediction Summary
              </AlertTitle>
              <AlertDescription>
                {percentChange >= 0 
                  ? `Based on historical patterns and upcoming events, ${cryptocurrency} is predicted to increase by ${Math.abs(percentChange).toFixed(2)}% in the next ${pricePrediction.horizon} days.`
                  : `Based on historical patterns and upcoming events, ${cryptocurrency} is predicted to decrease by ${Math.abs(percentChange).toFixed(2)}% in the next ${pricePrediction.horizon} days.`
                }
                {' '}The most significant factors are upcoming {upcomingEvents[0]?.category} events, particularly the {upcomingEvents[0]?.name}.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};

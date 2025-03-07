
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge, Megaphone, TrendingUp } from 'lucide-react';

interface MarketSentimentProps {
  tradingPair: string;
}

export const MarketSentiment = ({ tradingPair }: MarketSentimentProps) => {
  // Generate some mock sentiment data
  const sentimentTrend = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (14 - i - 1));
    
    // Create somewhat trending sentiment data with some randomness
    const baseValue = 0.5;
    const trendFactor = i * 0.015;
    const randomFactor = Math.random() * 0.15 - 0.075;
    const value = Math.min(1, Math.max(0, baseValue + trendFactor + randomFactor));
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: value
    };
  });
  
  // Social media mentions data
  const socialMentions = [
    { network: 'Twitter', count: 12450, sentiment: 0.62, change: 5.2 },
    { network: 'Reddit', count: 5621, sentiment: 0.58, change: -2.1 },
    { network: 'YouTube', count: 843, sentiment: 0.71, change: 8.7 },
    { network: 'Telegram', count: 32145, sentiment: 0.64, change: 12.3 },
  ];
  
  // Expert analysis
  const expertAnalysis = [
    { expert: 'Trading View', sentiment: 0.75, signal: 'Strong Buy' },
    { expert: 'Coin Bureau', sentiment: 0.68, signal: 'Buy' },
    { expert: 'CoinDesk', sentiment: 0.54, signal: 'Neutral' },
  ];
  
  // Current sentiment scores
  const overallSentiment = 0.67;
  const retailSentiment = 0.72;
  const institutionalSentiment = 0.61;
  const newsSentiment = 0.58;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base">Market Sentiment</CardTitle>
          <CardDescription>Social & news analysis for {tradingPair}</CardDescription>
        </div>
        <Megaphone className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Gauge className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Overall Sentiment</span>
                </div>
                <span className={`text-sm font-medium ${
                  overallSentiment > 0.65 ? 'text-green-500' : 
                  overallSentiment < 0.4 ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {(overallSentiment * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={overallSentiment * 100} 
                className={`h-2 ${
                  overallSentiment > 0.65 ? 'bg-green-500' : 
                  overallSentiment < 0.4 ? 'bg-red-500' : 'bg-amber-500'
                }`} 
              />
              <p className="text-xs text-muted-foreground">
                {overallSentiment > 0.65 ? 'Bullish' : 
                 overallSentiment < 0.4 ? 'Bearish' : 'Neutral'} sentiment detected
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Retail</span>
                  <Progress value={retailSentiment * 100} className="h-1.5" />
                  <span className="text-xs">{(retailSentiment * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Institutional</span>
                  <Progress value={institutionalSentiment * 100} className="h-1.5" />
                  <span className="text-xs">{(institutionalSentiment * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">News</span>
                  <Progress value={newsSentiment * 100} className="h-1.5" />
                  <span className="text-xs">{(newsSentiment * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center mb-2">
                <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sentiment Trend (14d)</span>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      tickLine={{ stroke: 'var(--border)' }}
                      axisLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={{ stroke: 'var(--border)' }}
                      axisLine={{ stroke: 'var(--border)' }}
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Sentiment']}
                    />
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, fill: 'var(--background)' }}
                      activeDot={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, r: 6, fill: 'hsl(var(--accent))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="pt-4">
            <div className="space-y-4">
              {socialMentions.map((item) => (
                <div key={item.network} className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.network}</span>
                      <span className={`ml-2 text-xs ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.count.toLocaleString()} mentions
                    </div>
                  </div>
                  <div>
                    <Progress 
                      value={item.sentiment * 100} 
                      className="h-1.5 w-16" 
                    />
                    <div className="text-xs text-right mt-1">
                      {(item.sentiment * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-xs text-muted-foreground pt-2">
                <p>Data analyzed from 50,000+ social media posts in the last 24 hours</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="experts" className="pt-4">
            <div className="space-y-4">
              {expertAnalysis.map((item) => (
                <div key={item.expert} className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <div className="text-sm font-medium">{item.expert}</div>
                    <div className={`text-xs ${
                      item.signal === 'Strong Buy' ? 'text-green-500' : 
                      item.signal === 'Buy' ? 'text-green-400' :
                      item.signal === 'Strong Sell' ? 'text-red-500' :
                      item.signal === 'Sell' ? 'text-red-400' :
                      'text-amber-500'
                    }`}>
                      {item.signal}
                    </div>
                  </div>
                  <div>
                    <Progress 
                      value={item.sentiment * 100} 
                      className="h-1.5 w-16" 
                    />
                    <div className="text-xs text-right mt-1">
                      {(item.sentiment * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-xs text-muted-foreground pt-2">
                <p>Expert analysis updated daily based on technical and fundamental indicators</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

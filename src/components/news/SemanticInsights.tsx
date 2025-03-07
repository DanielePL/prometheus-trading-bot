
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Brain, AlertTriangle } from 'lucide-react';
import { getSentimentAnalysis, SentimentAnalysis } from '@/services/newsCrawlerService';

export const SemanticInsights = () => {
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  
  useEffect(() => {
    setAnalysis(getSentimentAnalysis());
  }, []);
  
  if (!analysis) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Semantic Analysis</CardTitle>
          <CardDescription>Insights derived from market intelligence</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 text-center">
          <Brain className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium text-muted-foreground">No analysis available</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Scan news sources to generate semantic analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Transform topic data for chart
  const chartData = analysis.keyTopics.map(topic => ({
    name: topic.topic,
    value: topic.count,
    sentiment: topic.sentiment
  }));

  // Generate mock time series data for sentiment over time
  const timeSeriesData = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (14 - i - 1));
    
    // Create somewhat trending sentiment data
    const baseValue = analysis.overallSentiment === 'positive' ? 0.6 : analysis.overallSentiment === 'negative' ? 0.4 : 0.5;
    const trendFactor = i * 0.02; // slight trend
    const randomFactor = Math.random() * 0.2 - 0.1; // random noise
    const value = Math.min(1, Math.max(0, baseValue + trendFactor + randomFactor));
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: value
    };
  });

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Semantic Analysis</CardTitle>
            <CardDescription>Insights derived from market intelligence</CardDescription>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className={getImpactColor(analysis.marketImpact)}>
              {analysis.marketImpact.charAt(0).toUpperCase() + analysis.marketImpact.slice(1)} Impact
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Key Topics</TabsTrigger>
            <TabsTrigger value="trend">Sentiment Trend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center">
                <div className="mr-4">
                  {getSentimentIcon(analysis.overallSentiment)}
                </div>
                <div>
                  <div className="text-lg font-medium">
                    {analysis.overallSentiment.charAt(0).toUpperCase() + analysis.overallSentiment.slice(1)} Market Sentiment
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {Math.round(analysis.confidenceScore * 100)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-accent" />
                Trading Recommendation
              </h3>
              <p className="text-sm">{analysis.tradingRecommendation}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Key Topics:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.keyTopics.map((topic, i) => (
                  <div key={i} className="flex items-center border rounded-md p-2">
                    {getSentimentIcon(topic.sentiment)}
                    <div className="ml-2">
                      <div className="font-medium">{topic.topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {topic.sentiment.charAt(0).toUpperCase() + topic.sentiment.slice(1)} sentiment (mentioned {topic.count} times)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={120}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--accent))" 
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="trend">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNewsItems, NewsItem } from '@/services/newsCrawlerService';
import { Search, ExternalLink, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const NewsResults = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  useEffect(() => {
    setNewsItems(getNewsItems());
  }, []);

  useEffect(() => {
    let filtered = newsItems;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(item => item.sentiment === selectedTab);
    }
    
    setFilteredItems(filtered);
  }, [newsItems, searchTerm, selectedTab]);

  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral' | null) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentClass = (sentiment: 'positive' | 'negative' | 'neutral' | null) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="col-span-full h-full">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Market News</CardTitle>
            <CardDescription>Latest news and updates from scanned sources</CardDescription>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="ml-2">
              {filteredItems.length} results
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{item.source}</Badge>
                      <Badge variant="outline" className={getSentimentClass(item.sentiment)}>
                        <span className="flex items-center gap-1">
                          {getSentimentIcon(item.sentiment)}
                          {item.sentiment ? item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1) : 'Unknown'}
                        </span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.keywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium text-muted-foreground">No results found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {newsItems.length === 0 
                  ? "No news items yet. Try scanning your sources."
                  : "Try a different search term or filter."}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

import { toast } from "sonner";

export interface NewsSource {
  id: string;
  name: string;
  type: 'reddit' | 'news' | 'finance' | 'crypto' | 'custom';
  url?: string;
  apiEndpoint?: string;
  enabled: boolean;
  lastScanned?: string;
  parameters?: Record<string, string>;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  relevanceScore: number;
  keywords: string[];
}

export interface ScanResult {
  totalItems: number;
  sources: string[];
  timestamp: string;
  duration: number;
  status: 'completed' | 'failed' | 'partial';
  message?: string;
}

export interface SentimentAnalysis {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  confidenceScore: number;
  keyTopics: {topic: string, sentiment: 'positive' | 'negative' | 'neutral', count: number}[];
  marketImpact: 'high' | 'medium' | 'low';
  tradingRecommendation?: string;
}

// Default news sources
const defaultSources: NewsSource[] = [
  {
    id: '1',
    name: 'Reddit Crypto',
    type: 'reddit',
    enabled: true,
    parameters: {
      subreddits: 'cryptocurrency,bitcoin,ethereum,CryptoMarkets',
      timeframe: 'day',
      limit: '25'
    }
  },
  {
    id: '2',
    name: 'News.io Crypto',
    type: 'news',
    enabled: true,
    parameters: {
      q: 'cryptocurrency OR bitcoin OR ethereum',
      language: 'en',
      limit: '25'
    }
  },
  {
    id: '3',
    name: 'AlphaVantage Market News',
    type: 'finance',
    enabled: true,
    parameters: {
      topics: 'blockchain,forex,financial_markets',
      limit: '25'
    }
  },
  {
    id: '4',
    name: 'Etherscan Updates',
    type: 'crypto',
    enabled: true,
    parameters: {
      module: 'gastracker',
      action: 'gasoracle',
    }
  },
  {
    id: '5',
    name: 'Federal Reserve Announcements',
    type: 'custom',
    url: 'https://www.federalreserve.gov/newsevents/pressreleases.htm',
    enabled: true
  }
];

// Initialize local storage
const initializeStorage = () => {
  const storedSources = localStorage.getItem('newsSources');
  if (!storedSources) {
    localStorage.setItem('newsSources', JSON.stringify(defaultSources));
  }
  
  const storedItems = localStorage.getItem('newsItems');
  if (!storedItems) {
    localStorage.setItem('newsItems', JSON.stringify([]));
  }
  
  const storedScans = localStorage.getItem('scanResults');
  if (!storedScans) {
    localStorage.setItem('scanResults', JSON.stringify([]));
  }
  
  const storedAnalysis = localStorage.getItem('sentimentAnalysis');
  if (!storedAnalysis) {
    localStorage.setItem('sentimentAnalysis', JSON.stringify(null));
  }
};

// Initialize on service import
initializeStorage();

// Fetch API keys from localStorage
const getApiKeys = () => {
  return {
    redditClientId: localStorage.getItem('redditClientId') || '',
    redditApiKey: localStorage.getItem('redditApiKey') || '',
    newsIoApiKey: localStorage.getItem('newsIoApiKey') || '',
    alphaVantageApiKey: localStorage.getItem('alphaVantageApiKey') || '',
    etherscanApiKey: localStorage.getItem('etherscanApiKey') || '',
  };
};

// Save API keys to localStorage
export const saveApiKeys = (keys: Record<string, string>) => {
  Object.entries(keys).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  toast.success("API keys saved successfully");
};

// Get all news sources
export const getNewsSources = (): NewsSource[] => {
  const sources = localStorage.getItem('newsSources');
  return sources ? JSON.parse(sources) : defaultSources;
};

// Add a new news source
export const addNewsSource = (source: Omit<NewsSource, 'id'>): NewsSource => {
  const sources = getNewsSources();
  const newSource = {
    ...source,
    id: Date.now().toString()
  };
  
  localStorage.setItem('newsSources', JSON.stringify([...sources, newSource]));
  toast.success(`Added source: ${source.name}`);
  return newSource;
};

// Update a news source
export const updateNewsSource = (source: NewsSource): void => {
  const sources = getNewsSources();
  const index = sources.findIndex(s => s.id === source.id);
  
  if (index !== -1) {
    sources[index] = source;
    localStorage.setItem('newsSources', JSON.stringify(sources));
    toast.success(`Updated source: ${source.name}`);
  }
};

// Delete a news source
export const deleteNewsSource = (id: string): void => {
  const sources = getNewsSources();
  const filtered = sources.filter(s => s.id !== id);
  localStorage.setItem('newsSources', JSON.stringify(filtered));
  toast.success("Source removed");
};

// Get all news items
export const getNewsItems = (): NewsItem[] => {
  const items = localStorage.getItem('newsItems');
  return items ? JSON.parse(items) : [];
};

// Get the latest scan result
export const getLatestScanResult = (): ScanResult | null => {
  const results = localStorage.getItem('scanResults');
  const parsed = results ? JSON.parse(results) : [];
  return parsed.length > 0 ? parsed[0] : null;
};

// Get sentiment analysis
export const getSentimentAnalysis = (): SentimentAnalysis | null => {
  const analysis = localStorage.getItem('sentimentAnalysis');
  return analysis ? JSON.parse(analysis) : null;
};

// Mock scanning functionality for demo
export const scanAllSources = async (): Promise<ScanResult> => {
  const sources = getNewsSources().filter(s => s.enabled);
  
  if (sources.length === 0) {
    throw new Error("No enabled sources to scan");
  }
  
  toast.info("Starting news scan...");
  
  // Simulate API calls
  try {
    const startTime = Date.now();
    
    // Mock news data - in a real implementation, this would call the actual APIs
    const mockNewsItems = generateMockNewsItems(sources);
    localStorage.setItem('newsItems', JSON.stringify(mockNewsItems));
    
    // Generate mock sentiment analysis
    const analysis = generateMockSentimentAnalysis(mockNewsItems);
    localStorage.setItem('sentimentAnalysis', JSON.stringify(analysis));
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Create scan result
    const result: ScanResult = {
      totalItems: mockNewsItems.length,
      sources: sources.map(s => s.name),
      timestamp: new Date().toISOString(),
      duration,
      status: 'completed'
    };
    
    // Store scan result
    const existingResults = localStorage.getItem('scanResults');
    const results = existingResults ? JSON.parse(existingResults) : [];
    localStorage.setItem('scanResults', JSON.stringify([result, ...results].slice(0, 10)));
    
    toast.success(`Scanned ${result.sources.length} sources, found ${result.totalItems} news items`);
    
    return result;
  } catch (error) {
    console.error("Scan error:", error);
    const errorResult: ScanResult = {
      totalItems: 0,
      sources: [],
      timestamp: new Date().toISOString(),
      duration: 0,
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
    
    toast.error(`Scan failed: ${errorResult.message}`);
    
    return errorResult;
  }
};

// Helper function to generate mock news
const generateMockNewsItems = (sources: NewsSource[]): NewsItem[] => {
  const items: NewsItem[] = [];
  
  const mockTitles = [
    'Bitcoin Surges to New All-Time High as Institutional Adoption Grows',
    'Ethereum 2.0 Upgrade Shows Promise for Scalability Solutions',
    'Federal Reserve Signals Interest Rate Hike Amid Inflation Concerns',
    'SEC Commissioner Speaks Positively About Crypto Regulation Framework',
    'New DeFi Protocol Gains Traction with Innovative Yield Strategies',
    'Crypto Exchange Reports Record Trading Volume in Q2',
    'Global Markets React to Economic Data, Crypto Remains Resilient',
    'Central Banks Exploring Digital Currency Options as Crypto Adoption Increases',
    'Analysts Predict Bull Run to Continue Through End of Year',
    'Smart Contract Vulnerability Discovered in Popular DeFi Platform'
  ];
  
  const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
  
  sources.forEach(source => {
    const count = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < count; i++) {
      const randomTitleIndex = Math.floor(Math.random() * mockTitles.length);
      const randomSentimentIndex = Math.floor(Math.random() * sentiments.length);
      
      items.push({
        id: `${source.id}-${Date.now()}-${i}`,
        source: source.name,
        title: mockTitles[randomTitleIndex],
        content: `This is a mock content summary for the article "${mockTitles[randomTitleIndex]}" from ${source.name}.`,
        url: 'https://example.com/news/article',
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        sentiment: sentiments[randomSentimentIndex],
        relevanceScore: Math.random() * 0.5 + 0.5,
        keywords: ['crypto', 'bitcoin', 'market', 'trading', 'finance'].sort(() => Math.random() - 0.5).slice(0, 3)
      });
    }
  });
  
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

// Generate mock sentiment analysis
const generateMockSentimentAnalysis = (items: NewsItem[]): SentimentAnalysis => {
  const sentiments = items.map(item => item.sentiment);
  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  const neutralCount = sentiments.filter(s => s === 'neutral').length;
  
  let overallSentiment: 'positive' | 'negative' | 'neutral';
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    overallSentiment = 'positive';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    overallSentiment = 'negative';
  } else {
    overallSentiment = 'neutral';
  }
  
  const topics = [
    {topic: 'Bitcoin', sentiment: 'positive' as const, count: Math.floor(Math.random() * 10) + 5},
    {topic: 'Ethereum', sentiment: 'positive' as const, count: Math.floor(Math.random() * 8) + 3},
    {topic: 'Regulation', sentiment: 'neutral' as const, count: Math.floor(Math.random() * 6) + 2},
    {topic: 'Federal Reserve', sentiment: 'negative' as const, count: Math.floor(Math.random() * 5) + 1},
    {topic: 'Market Volatility', sentiment: overallSentiment, count: Math.floor(Math.random() * 7) + 3}
  ];
  
  const recommendation = overallSentiment === 'positive' ? 
    'Current market sentiment is favorable. Consider increasing position in Bitcoin and Ethereum.' :
    overallSentiment === 'negative' ?
    'Market sentiment is cautious. Consider reducing exposure and setting tighter stop losses.' :
    'Market sentiment is mixed. Maintain current positions and monitor key indicators.';
  
  return {
    overallSentiment,
    confidenceScore: 0.65 + Math.random() * 0.3,
    keyTopics: topics,
    marketImpact: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    tradingRecommendation: recommendation
  };
};

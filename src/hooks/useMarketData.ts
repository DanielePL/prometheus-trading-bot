
import { useState, useEffect, useMemo } from 'react';
import { MarketData } from '@/types/market';
import { marketData as mockMarketData } from '@/data/marketData';
import { krakenMarketService } from '@/services/KrakenMarketService';
import { useToast } from '@/hooks/use-toast';

export const useMarketData = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [marketDataState, setMarketDataState] = useState<MarketData[]>(mockMarketData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Load market data on component mount
  useEffect(() => {
    fetchMarketData();
  }, []);
  
  // Function to fetch market data
  const fetchMarketData = async () => {
    setIsLoading(true);
    
    try {
      // Try to get live data from Kraken
      const liveData = await krakenMarketService.getMarketPairs();
      
      if (liveData && liveData.length > 0) {
        // Get tracked status from localStorage or existing state
        const trackedCoinsMap = new Map(
          marketDataState
            .filter(coin => coin.tracked)
            .map(coin => [coin.symbol, true])
        );
        
        // Apply tracked status to new data
        const dataWithTrackedStatus = liveData.map(coin => ({
          ...coin,
          tracked: trackedCoinsMap.has(coin.symbol)
        }));
        
        setMarketDataState(dataWithTrackedStatus);
        setIsUsingLiveData(true);
        setConnectionError(null);
        console.log('Using live market data from Kraken');
        
        // Save tracked status to localStorage
        localStorage.setItem('trackedCoins', JSON.stringify(
          dataWithTrackedStatus.filter(coin => coin.tracked).map(coin => coin.symbol)
        ));
        
        toast({
          title: "Connected to Kraken",
          description: "Displaying live market data",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setIsUsingLiveData(false);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setConnectionError(errorMessage);
      
      // Load tracked status from localStorage for mock data
      const trackedCoinsFromStorage = JSON.parse(localStorage.getItem('trackedCoins') || '[]');
      const updatedMockData = mockMarketData.map(coin => ({
        ...coin,
        tracked: trackedCoinsFromStorage.includes(coin.symbol) || coin.tracked
      }));
      
      setMarketDataState(updatedMockData);
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter market data based on search term
  const filteredMarketData = useMemo(() => {
    return searchTerm 
      ? marketDataState.filter(market => 
          market.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : marketDataState;
  }, [searchTerm, marketDataState]);
  
  // Filter for tracked coins
  const trackedCoins = useMemo(() => {
    return marketDataState.filter(market => market.tracked);
  }, [marketDataState]);
  
  // Filter for gainers
  const gainers = useMemo(() => {
    return marketDataState
      .filter(market => market.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h);
  }, [marketDataState]);
  
  // Handle track toggle
  const handleTrackToggle = (id: string) => {
    setMarketDataState(prevData => {
      const newData = prevData.map(item => 
        item.id === id ? { ...item, tracked: !item.tracked } : item
      );
      
      // Save tracked coins to localStorage
      localStorage.setItem('trackedCoins', JSON.stringify(
        newData.filter(coin => coin.tracked).map(coin => coin.symbol)
      ));
      
      return newData;
    });
  };
  
  // Force refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      if (isUsingLiveData) {
        const updatedData = await krakenMarketService.updateMarketData(marketDataState);
        setMarketDataState(updatedData);
        toast({
          title: "Data Refreshed",
          description: "Market data has been updated",
        });
      } else {
        await retryConnection();
      }
    } catch (error) {
      console.error('Error refreshing market data:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setConnectionError(errorMessage);
      toast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to retry the connection to Kraken API
  const retryConnection = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Reset connection status and try again
      const isConnected = await krakenMarketService.resetConnection();
      
      if (isConnected) {
        // If successfully connected, fetch market data
        await fetchMarketData();
        
        toast({
          title: "Connection Successful",
          description: "Now displaying live market data",
          variant: "default"
        });
      } else {
        const error = krakenMarketService.getConnectionError() || 'Failed to connect to Kraken API';
        setConnectionError(error);
        toast({
          title: "Connection Failed",
          description: error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error on retry connection:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setConnectionError(errorMessage);
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    searchTerm,
    setSearchTerm,
    filteredMarketData,
    trackedCoins,
    gainers,
    handleTrackToggle,
    isLoading,
    isUsingLiveData,
    refreshData,
    connectionError,
    retryConnection,
    fetchMarketData
  };
};

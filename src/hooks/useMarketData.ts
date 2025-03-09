
import { useState, useEffect, useMemo } from 'react';
import { MarketData } from '@/types/market';
import { marketData as mockMarketData } from '@/data/marketData';
import { krakenMarketService } from '@/services/KrakenMarketService';

export const useMarketData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketDataState, setMarketDataState] = useState<MarketData[]>(mockMarketData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Load market data on component mount
  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      
      try {
        // Try to get live data from Kraken
        const isConnected = krakenMarketService.isApiConnected();
        const error = krakenMarketService.getConnectionError();
        setConnectionError(error);
        
        if (isConnected) {
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
            console.log('Using live market data from Kraken');
            
            // Save tracked status to localStorage
            localStorage.setItem('trackedCoins', JSON.stringify(
              dataWithTrackedStatus.filter(coin => coin.tracked).map(coin => coin.symbol)
            ));
            
            // Set up refresh interval while using live data
            const intervalId = setInterval(async () => {
              const updatedData = await krakenMarketService.updateMarketData(dataWithTrackedStatus);
              setMarketDataState(updatedData);
            }, 30000); // Refresh every 30 seconds
            
            return () => clearInterval(intervalId);
          }
        }
        
        // Fall back to mock data if API not connected or no data received
        console.log('Using mock market data');
        
        // Load tracked status from localStorage
        const trackedCoinsFromStorage = JSON.parse(localStorage.getItem('trackedCoins') || '[]');
        const updatedMockData = mockMarketData.map(coin => ({
          ...coin,
          tracked: trackedCoinsFromStorage.includes(coin.symbol) || coin.tracked
        }));
        
        setMarketDataState(updatedMockData);
        setIsUsingLiveData(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setIsUsingLiveData(false);
        setConnectionError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
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
    if (!isUsingLiveData) return;
    
    setIsLoading(true);
    try {
      const updatedData = await krakenMarketService.updateMarketData(marketDataState);
      setMarketDataState(updatedData);
    } catch (error) {
      console.error('Error refreshing market data:', error);
      setConnectionError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to retry the connection to Kraken API
  const retryConnection = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Reinitialize Kraken service by reimporting it
      const { krakenMarketService: refreshedService } = await import('@/services/KrakenMarketService?refresh=' + Date.now());
      
      if (refreshedService.isApiConnected()) {
        const liveData = await refreshedService.getMarketPairs();
        
        if (liveData && liveData.length > 0) {
          // Apply tracked status to new data
          const trackedCoinsMap = new Map(
            marketDataState
              .filter(coin => coin.tracked)
              .map(coin => [coin.symbol, true])
          );
          
          const dataWithTrackedStatus = liveData.map(coin => ({
            ...coin,
            tracked: trackedCoinsMap.has(coin.symbol)
          }));
          
          setMarketDataState(dataWithTrackedStatus);
          setIsUsingLiveData(true);
          console.log('Using live market data from Kraken after retry');
        } else {
          setConnectionError('Connected to API but received no market data');
        }
      } else {
        setConnectionError(refreshedService.getConnectionError() || 'Failed to connect to Kraken API');
      }
    } catch (error) {
      console.error('Error on retry connection:', error);
      setConnectionError(error instanceof Error ? error.message : String(error));
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
    retryConnection
  };
};

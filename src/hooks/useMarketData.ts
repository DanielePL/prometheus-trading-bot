
import { useState, useMemo } from 'react';
import { MarketData } from '@/types/market';
import { marketData } from '@/data/marketData';

export const useMarketData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marketDataState, setMarketDataState] = useState<MarketData[]>(marketData);
  
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
    setMarketDataState(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, tracked: !item.tracked } : item
      )
    );
  };
  
  return {
    searchTerm,
    setSearchTerm,
    filteredMarketData,
    trackedCoins,
    gainers,
    handleTrackToggle
  };
};

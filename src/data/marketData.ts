
import { MarketData } from '@/types/market';

export const marketData: MarketData[] = [
  // Major Cryptocurrencies
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: '$45,230.50', change24h: 2.34, volume: '$28.5B', marketCap: '$856.7B', tracked: true },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: '$2,456.75', change24h: -1.21, volume: '$15.2B', marketCap: '$295.4B', tracked: true },
  { id: '3', symbol: 'BNB', name: 'BNB', price: '$312.80', change24h: 0.58, volume: '$1.2B', marketCap: '$48.3B', tracked: false },
  { id: '4', symbol: 'XRP', name: 'XRP', price: '$0.56', change24h: -0.87, volume: '$1.5B', marketCap: '$29.8B', tracked: false },
  { id: '5', symbol: 'ADA', name: 'Cardano', price: '$0.52', change24h: -2.35, volume: '$980M', marketCap: '$18.2B', tracked: false },
  { id: '6', symbol: 'DOT', name: 'Polkadot', price: '$6.78', change24h: 1.45, volume: '$420M', marketCap: '$8.5B', tracked: false },
  { id: '7', symbol: 'LTC', name: 'Litecoin', price: '$63.42', change24h: -0.23, volume: '$320M', marketCap: '$4.7B', tracked: false },
  { id: '8', symbol: 'ATOM', name: 'Cosmos', price: '$7.91', change24h: 3.12, volume: '$210M', marketCap: '$3.2B', tracked: false },
  
  // Layer 1 & 2 Solutions
  { id: '9', symbol: 'SOL', name: 'Solana', price: '$123.45', change24h: 5.67, volume: '$4.8B', marketCap: '$53.1B', tracked: true },
  { id: '10', symbol: 'AVAX', name: 'Avalanche', price: '$27.32', change24h: 4.21, volume: '$890M', marketCap: '$10.2B', tracked: false },
  { id: '11', symbol: 'MATIC', name: 'Polygon', price: '$0.57', change24h: -3.45, volume: '$410M', marketCap: '$5.3B', tracked: false },
  { id: '12', symbol: 'LINK', name: 'Chainlink', price: '$14.23', change24h: 2.87, volume: '$750M', marketCap: '$8.3B', tracked: false },
  { id: '13', symbol: 'ARB', name: 'Arbitrum', price: '$1.12', change24h: -1.54, volume: '$380M', marketCap: '$3.1B', tracked: false },
  { id: '14', symbol: 'INJ', name: 'Injective', price: '$15.87', change24h: 7.62, volume: '$310M', marketCap: '$1.4B', tracked: false },
  { id: '15', symbol: 'OP', name: 'Optimism', price: '$2.45', change24h: 3.21, volume: '$280M', marketCap: '$2.3B', tracked: false },
  { id: '16', symbol: 'NEAR', name: 'Near Protocol', price: '$3.78', change24h: 1.32, volume: '$240M', marketCap: '$3.9B', tracked: false },
  
  // Meme Coins
  { id: '17', symbol: 'DOGE', name: 'Dogecoin', price: '$0.087', change24h: 3.21, volume: '$890M', marketCap: '$12.3B', tracked: false },
  { id: '18', symbol: 'SHIB', name: 'Shiba Inu', price: '$0.000021', change24h: 4.76, volume: '$620M', marketCap: '$11.2B', tracked: false },
  { id: '19', symbol: 'PEPE', name: 'Pepe', price: '$0.000009', change24h: 8.92, volume: '$340M', marketCap: '$3.8B', tracked: false },
  { id: '20', symbol: 'FLOKI', name: 'Floki', price: '$0.0002', change24h: 6.54, volume: '$180M', marketCap: '$1.9B', tracked: false },
  { id: '21', symbol: 'BONK', name: 'Bonk', price: '$0.00001', change24h: 12.34, volume: '$150M', marketCap: '$590M', tracked: false },
  { id: '22', symbol: 'DEGEN', name: 'Degen', price: '$0.00037', change24h: -2.12, volume: '$98M', marketCap: '$420M', tracked: false },
  { id: '23', symbol: 'WIF', name: 'WIF', price: '$0.12', change24h: 15.67, volume: '$210M', marketCap: '$1.2B', tracked: false },
  { id: '24', symbol: 'BITCOIN', name: 'HarryPotterObama', price: '$0.00004', change24h: 28.94, volume: '$67M', marketCap: '$120M', tracked: false }
];


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Markets from '@/pages/Markets';
import Portfolio from '@/pages/Portfolio';
import Analytics from '@/pages/Analytics';
import Performance from '@/pages/Performance';
import Strategies from '@/pages/Strategies';
import Trades from '@/pages/Trades';
import History from '@/pages/History';
import Deposits from '@/pages/Deposits';
import Assets from '@/pages/Assets';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import TradingBot from '@/pages/TradingBot';
import AdvancedTrading from '@/pages/AdvancedTrading';
import Cloud from '@/pages/Cloud';
import NewsScanner from '@/pages/NewsScanner';

import './App.css';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/trading-bot" element={<TradingBot />} />
        <Route path="/advanced-trading" element={<AdvancedTrading />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/history" element={<History />} />
        <Route path="/deposits" element={<Deposits />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news-scanner" element={<NewsScanner />} />
        <Route path="/cloud" element={<Cloud />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

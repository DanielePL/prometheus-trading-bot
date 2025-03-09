
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import EventAnalysis from '@/pages/EventAnalysis';
import Connections from '@/pages/Connections';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthRoute } from '@/components/auth/AuthRoute';

import './App.css';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advanced-trading" element={<AdvancedTrading />} />
            <Route path="/deposits" element={<Deposits />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tradingbot" element={<TradingBot />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/event-analysis" element={<EventAnalysis />} />
            <Route path="/news-scanner" element={<NewsScanner />} />
            <Route path="/cloud" element={<Cloud />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

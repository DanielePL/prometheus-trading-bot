import unittest
from trading_bot import TradingSystem, TechnicalIndicators, MacroEconomicAnalyzer, OnChainAnalyzer, EnhancedSentimentAnalyzer
import pandas as pd
import praw
import numpy as np

class TestTradingBot(unittest.TestCase):
    def setUp(self):
        """Set up test data and objects."""
        self.config = {
            'exchanges': {'kraken': {'api_key': 'test_key', 'secret': 'test_secret'}},
            'sentiment_params': {'reddit': {'client_id': 'test_id', 'client_secret': 'test_secret', 'user_agent': 'test_agent'}},
            'risk_params': {'max_daily_trades': 5, 'max_position_size': 0.1, 'stop_loss_pct': 0.02, 'take_profit_pct': 0.05}
        }
        self.trading_system = TradingSystem(config_path="test_config.yaml")  # ✅ Use a valid test config
        self.trading_system.config = self.config

    def test_calculate_rsi(self):
        """Test RSI calculation."""
        prices = pd.Series([100, 101, 102, 101, 100, 99, 98, 97, 96, 95])
        rsi = TechnicalIndicators.calculate_rsi(prices, period=14)
        self.assertIsInstance(rsi, pd.Series)
        self.assertEqual(len(rsi), len(prices))

    def test_get_macro_score(self):
        """Test macro score calculation."""
        analyzer = MacroEconomicAnalyzer(self.config)
        score = analyzer.get_macro_score()
        self.assertIn('macro_score', score)
        self.assertGreaterEqual(score['macro_score'], 0)
        self.assertLessEqual(score['macro_score'], 1)

    def test_get_onchain_score(self):
        """Test on-chain score calculation."""
        analyzer = OnChainAnalyzer(self.config)
        score = analyzer.get_onchain_score()
        self.assertIn('onchain_score', score)
        self.assertGreaterEqual(score['onchain_score'], 0)
        self.assertLessEqual(score['onchain_score'], 1)

    def test_analyze_social_sentiment(self):
        """Test social sentiment analysis."""
        analyzer = EnhancedSentimentAnalyzer(self.config, praw.Reddit(
            client_id='test_id', client_secret='test_secret', user_agent='test_agent'
        ))
        sentiment = analyzer.analyze_social_sentiment()
        self.assertIn('sentiment_score', sentiment)
        self.assertIn('reddit_sentiment', sentiment)

    def test_generate_signal(self):
        """Test trading signal generation."""
        signal = self.trading_system.generate_signal()
        self.assertIn('action', signal)
        self.assertIn(signal['action'], ['BUY', 'SELL', 'HOLD'])
        self.assertIn('confidence', signal)

if __name__ == '__main__':
    unittest.main()
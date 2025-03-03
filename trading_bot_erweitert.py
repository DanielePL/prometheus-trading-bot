import time
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import yaml
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import krakenex
from pykrakenapi import KrakenAPI
import praw
from textblob import TextBlob
import requests
import re
import warnings

warnings.filterwarnings('ignore')

# Importiere die Funktionen aus extra_analysis.py
from extra_analysis import (
    calculate_ichimoku,
    calculate_adx,
    calculate_pivot_points,
    analyze_news_sentiment
)

# Pushover-Nachrichtenfunktion
def send_pushover_message(user_key, api_token, message, title="Trading Bot Notification"):
    url = "https://api.pushover.net/1/messages.json"
    data = {
        "token": api_token,
        "user": user_key,
        "message": message,
        "title": title
    }
    response = requests.post(url, data=data)
    return response.json()

class TechnicalIndicators:
    """Technische Indikatoren"""

    @staticmethod
    def calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / (loss + 1e-9)
        return 100 - (100 / (1 + rs))

    @staticmethod
    def calculate_macd(prices: pd.Series) -> Tuple[pd.Series, pd.Series]:
        exp1 = prices.ewm(span=12, adjust=False).mean()
        exp2 = prices.ewm(span=26, adjust=False).mean()
        macd = exp1 - exp2
        signal = macd.ewm(span=9, adjust=False).mean()
        return macd, signal

    @staticmethod
    def calculate_bollinger_bands(prices: pd.Series) -> Tuple[pd.Series, pd.Series, pd.Series]:
        sma = prices.rolling(window=20).mean()
        std = prices.rolling(window=20).std()
        upper_band = sma + (std * 2)
        lower_band = sma - (std * 2)
        return upper_band, sma, lower_band

    @staticmethod
    def calculate_momentum(prices: pd.Series, period: int = 10) -> pd.Series:
        return prices.diff(period)

    @staticmethod
    def calculate_ema(prices: pd.Series, period: int = 20) -> pd.Series:
        return prices.ewm(span=period, adjust=False).mean()

    @staticmethod
    def calculate_stochastic(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> pd.Series:
        lowest_low = low.rolling(window=period).min()
        highest_high = high.rolling(window=period).max()
        k = 100 * (close - lowest_low) / (highest_high - lowest_low)
        return k

class MacroEconomicAnalyzer:
    """Analysierer für makroökonomische Daten"""

    def __init__(self, config):
        self.config = config
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key, expiry_time):
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key, data, expiry_time):
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def get_economic_indicators(self):
        try:
            cache_key = "economic_indicators"
            cached_data = self._get_cached_data(cache_key, timedelta(days=1))
            if cached_data:
                return cached_data
            indicators = {
                'inflation': {'value': 2.5, 'change': 0.1, 'date': datetime.now().strftime('%Y-%m-%d')},
                'interest_rate': {'value': 5.0, 'change': 0.0, 'date': datetime.now().strftime('%Y-%m-%d')},
                'unemployment': {'value': 4.0, 'change': -0.2, 'date': datetime.now().strftime('%Y-%m-%d')}
            }
            self._cache_data(cache_key, indicators, timedelta(days=1))
            return indicators
        except Exception as e:
            logging.error(f"Error fetching economic indicators: {str(e)}")
            return {}

    def get_market_correlations(self):
        try:
            cache_key = "market_correlations"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=4))
            if cached_data:
                return cached_data
            correlations = {'SPX': 0.6, 'GOLD': -0.2, 'USD': 0.1}
            self._cache_data(cache_key, correlations, timedelta(hours=4))
            return correlations
        except Exception as e:
            logging.error(f"Error calculating market correlations: {str(e)}")
            return {}

    def analyze_news_sentiment(self):
        try:
            cache_key = "news_sentiment"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=2))
            if cached_data:
                return cached_data
            result = {'macro_sentiment': 0.2, 'topics': ['inflation', 'interest rates']}
            self._cache_data(cache_key, result, timedelta(hours=2))
            return result
        except Exception as e:
            logging.error(f"Error analyzing economic news: {str(e)}")
            return {'macro_sentiment': 0, 'topics': []}

    def get_macro_score(self):
        try:
            indicators = self.get_economic_indicators()
            correlations = self.get_market_correlations()
            news = self.analyze_news_sentiment()
            score = 0.5
            if 'inflation' in indicators:
                inflation_impact = -0.1 if indicators['inflation']['change'] > 0 else 0.1
                score += inflation_impact
            if 'interest_rate' in indicators:
                rate_impact = -0.15 if indicators['interest_rate']['change'] > 0 else 0.15
                score += rate_impact
            if 'SPX' in correlations:
                spx_impact = correlations['SPX'] * 0.1
                score += spx_impact
            if news.get('macro_sentiment'):
                news_impact = news['macro_sentiment'] * 0.2
                score += news_impact
            score = max(0, min(1, score))
            return {
                'macro_score': score,
                'components': {
                    'indicators': indicators,
                    'correlations': correlations,
                    'news_sentiment': news.get('macro_sentiment', 0),
                    'top_topics': news.get('topics', [])
                }
            }
        except Exception as e:
            logging.error(f"Error calculating macro score: {str(e)}")
            return {'macro_score': 0.5}

class OnChainAnalyzer:
    """Analysierer für Bitcoin On-Chain-Daten"""

    def __init__(self, config):
        self.config = config
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key, expiry_time):
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key, data, expiry_time):
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def get_blockchain_metrics(self):
        try:
            cache_key = "blockchain_metrics"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=4))
            if cached_data:
                return cached_data
            metrics = {
                'hash_rate': {'value': 150, 'change': 0.05, 'date': datetime.now().strftime('%Y-%m-%d')},
                'active_addresses': {'value': 800000, 'change': 0.02, 'date': datetime.now().strftime('%Y-%m-%d')},
                'sopr': {'value': 1.01, 'change': -0.01, 'date': datetime.now().strftime('%Y-%m-%d')}
            }
            self._cache_data(cache_key, metrics, timedelta(hours=4))
            return metrics
        except Exception as e:
            logging.error(f"Error fetching blockchain metrics: {str(e)}")
            return {}

    def analyze_exchange_flows(self):
        try:
            cache_key = "exchange_flows"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=4))
            if cached_data:
                return cached_data
            flows = {'inflow_7d': 10000, 'outflow_7d': 12000, 'net_flow_7d': 2000, 'net_flow_btc': 2000, 'is_bullish': True}
            self._cache_data(cache_key, flows, timedelta(hours=4))
            return flows
        except Exception as e:
            logging.error(f"Error analyzing exchange flows: {str(e)}")
            return {}

    def analyze_whale_activity(self):
        try:
            cache_key = "whale_activity"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=6))
            if cached_data:
                return cached_data
            whale_data = {
                'whale_count': {'value': 2000, 'change': 0.01, 'date': datetime.now().strftime('%Y-%m-%d')},
                'distribution': {
                    '0.1-1_btc': {'addresses': 500000, 'change': 0.02},
                    '1-10_btc': {'addresses': 100000, 'change': -0.01},
                    '10-100_btc': {'addresses': 10000, 'change': 0.005},
                    '100-1000_btc': {'addresses': 1000, 'change': -0.002},
                    '1000+_btc': {'addresses': 2000, 'change': 0.01}
                }
            }
            self._cache_data(cache_key, whale_data, timedelta(hours=6))
            return whale_data
        except Exception as e:
            logging.error(f"Error analyzing whale activity: {str(e)}")
            return {}

    def get_onchain_score(self):
        try:
            metrics = self.get_blockchain_metrics()
            flows = self.analyze_exchange_flows()
            whales = self.analyze_whale_activity()
            score = 0.5
            if 'hash_rate' in metrics and metrics['hash_rate']['change'] is not None:
                hash_impact = min(0.1, max(-0.1, metrics['hash_rate']['change'] * 0.5))
                score += hash_impact
            if 'active_addresses' in metrics and metrics['active_addresses']['change'] is not None:
                address_impact = min(0.1, max(-0.1, metrics['active_addresses']['change'] * 0.5))
                score += address_impact
            if 'sopr' in metrics:
                sopr_value = metrics['sopr']['value']
                if sopr_value > 1.05:
                    score += 0.1
                elif sopr_value < 0.95:
                    score -= 0.1
            if flows.get('net_flow_7d'):
                flow_impact = min(0.2, max(-0.2, flows['net_flow_7d'] * 0.0000001))
                score += flow_impact
            if 'whale_count' in whales and whales['whale_count']['change'] is not None:
                whale_impact = min(0.1, max(-0.1, whales['whale_count']['change'] * 0.5))
                score += whale_impact
            score = max(0, min(1, score))
            return {
                'onchain_score': score,
                'components': {
                    'metrics': metrics,
                    'exchange_flows': flows,
                    'whale_activity': whales
                }
            }
        except Exception as e:
            logging.error(f"Error calculating on-chain score: {str(e)}")
            return {'onchain_score': 0.5}

class EnhancedSentimentAnalyzer:
    """Erweiterter Sentiment-Analysierer mit mehreren Datenquellen (ohne Twitter)"""
    def __init__(self, config, reddit):
        self.config = config
        self.reddit = reddit
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key, expiry_time):
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key, data, expiry_time):
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def _analyze_reddit(self):
        try:
            subreddit = self.reddit.subreddit("bitcoin")
            posts = subreddit.hot(limit=10)
            sentiments = []
            for post in posts:
                text = f"{post.title} {post.selftext}"
                sentiments.append(TextBlob(text).sentiment.polarity)
            return sum(sentiments) / len(sentiments) if sentiments else 0
        except Exception as e:
            logging.error(f"Error analyzing Reddit sentiment: {str(e)}")
            return 0

    def analyze_social_sentiment(self):
        try:
            cache_key = "social_sentiment"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=1))
            if cached_data:
                return cached_data
            url = "https://api.alternative.me/fng/"
            response = requests.get(url)
            fng_data = response.json()
            if fng_data and 'data' in fng_data and len(fng_data['data']) > 0:
                fng_value = int(fng_data['data'][0]['value'])
                sentiment_score = (fng_value - 50) / 50
            else:
                sentiment_score = 0
            reddit_sentiment = self._analyze_reddit()
            combined_sentiment = {
                'sentiment_score': sentiment_score,
                'reddit_sentiment': reddit_sentiment
            }
            self._cache_data(cache_key, combined_sentiment, timedelta(hours=1))
            return combined_sentiment
        except Exception as e:
            logging.error(f"Error analyzing social sentiment: {str(e)}")
            return {'sentiment_score': 0, 'reddit_sentiment': 0}

    def get_sentiment_score(self):
        try:
            social = self.analyze_social_sentiment()
            score = social.get('sentiment_score', 0)
            return {
                'sentiment_score': score,
                'components': {'social': social}
            }
        except Exception as e:
            logging.error(f"Error calculating sentiment score: {str(e)}")
            return {'sentiment_score': 0}

    def get_fear_greed_index(self):
        try:
            cache_key = "fear_greed_index"
            if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
                return self.cache[cache_key]
            url = "https://api.alternative.me/fng/?limit=30&format=json"
            response = requests.get(url)
            data = response.json()
            if data["metadata"]["status"] != "ok":
                return {"value": 50, "classification": "Neutral", "trend": "none"}
            current = data["data"][0]
            current_value = int(current["value"])
            classification = current["value_classification"]
            week_ago_value = int(data["data"][7]["value"]) if len(data["data"]) > 7 else current_value
            trend_value = current_value - week_ago_value
            if trend_value > 10:
                trend = "rapidly_increasing"
            elif trend_value > 5:
                trend = "increasing"
            elif trend_value < -10:
                trend = "rapidly_decreasing"
            elif trend_value < -5:
                trend = "decreasing"
            else:
                trend = "stable"
            if current_value <= 20:
                signal = "bullish"
                signal_strength = (25 - current_value) / 25
            elif current_value >= 75:
                signal = "bearish"
                signal_strength = (current_value - 75) / 25
            else:
                signal = "neutral"
                signal_strength = 0.5 - abs(50 - current_value) / 100
            historical = []
            for item in data["data"]:
                historical.append({
                    "date": datetime.fromtimestamp(int(item["timestamp"])),
                    "value": int(item["value"]),
                    "classification": item["value_classification"]
                })
            result = {
                "value": current_value,
                "classification": classification,
                "trend": trend,
                "trend_value": trend_value,
                "signal": signal,
                "signal_strength": signal_strength,
                "historical": historical,
                "source": "Fear & Greed Index by alternative.me"
            }
            self._cache_data(cache_key, result, timedelta(hours=1))
            return result
        except Exception as e:
            logging.error(f"Error retrieving Fear & Greed Index: {str(e)}")
            return {"value": 50, "classification": "Neutral", "trend": "none"}

class CombinedAnalysis:
    def __init__(self, config, trading_system):
        self.config = config
        self.trading_system = trading_system
        self.macro_analyzer = MacroEconomicAnalyzer(config)
        self.onchain_analyzer = OnChainAnalyzer(config)
        self.sentiment_analyzer = EnhancedSentimentAnalyzer(config, trading_system.reddit)

    def get_combined_score(self):
        try:
            macro = self.macro_analyzer.get_macro_score()
            onchain = self.onchain_analyzer.get_onchain_score()
            sentiment = self.sentiment_analyzer.get_sentiment_score()
            historical_data = self.trading_system.get_historical_data()
            ichimoku = calculate_ichimoku(historical_data)
            adx = calculate_adx(historical_data)
            pivot, support1, resistance1, support2, resistance2 = calculate_pivot_points(historical_data)
            news_sentiment = analyze_news_sentiment(self.config['apis']['news_api_key'])
            # Twitter-Integration entfernt
            combined_score = (macro['macro_score'] * 0.2 +
                              onchain['onchain_score'] * 0.2 +
                              sentiment['sentiment_score'] * 0.2 +
                              (adx / 100) * 0.1 +
                              news_sentiment * 0.15)
            return {
                'combined_score': combined_score,
                'components': {
                    'macro': macro,
                    'onchain': onchain,
                    'sentiment': sentiment,
                    'adx': adx,
                    'news_sentiment': news_sentiment,
                    'pivot': pivot,
                    'resistance1': resistance1,
                    'support1': support1
                }
            }
        except Exception as e:
            logging.error(f"Error calculating combined score: {str(e)}")
            return {'combined_score': 0.5}

class TradingSystem:
    def __init__(self, config_path: str = 'config.yaml'):
        self.load_config(config_path)
        self.initialize_components()
        self.current_position = 0
        self.trades_today = 0
        self.last_trade_time = None
        self.indicators = TechnicalIndicators()
        self.model = None
        self.scaler = StandardScaler()
        self.features = [
            'RSI', 'MACD', 'MACD_signal',
            'price_change', 'price_volatility',
            'volume_ratio', 'trend',
            'momentum', 'ema_diff',
            'stochastic'
        ]
        # CombinedAnalysis wird hier initialisiert
        self.combined_analysis = CombinedAnalysis(self.config, self)

    def load_config(self, config_path: str = 'config.yaml') -> None:
        try:
            with open(config_path, 'r') as file:
                self.config = yaml.safe_load(file)
            logging.info("Configuration loaded successfully")
        except Exception as e:
            logging.error(f"Error loading configuration: {e}")
            raise

    def initialize_components(self) -> None:
        try:
            self.api = krakenex.API(
                key=self.config['exchanges']['kraken']['api_key'],
                secret=self.config['exchanges']['kraken']['secret']
            )
            self.kraken = KrakenAPI(self.api)
            self.reddit = praw.Reddit(
                client_id=self.config['sentiment_params']['reddit']['client_id'],
                client_secret=self.config['sentiment_params']['reddit']['client_secret'],
                user_agent=self.config['sentiment_params']['reddit']['user_agent']
            )
            logging.info("All components initialized successfully")
        except Exception as e:
            logging.error(f"Error initializing components: {str(e)}")
            raise

    def get_current_price(self) -> float:
        try:
            time.sleep(2)
            ticker = self.kraken.get_ticker_information('XXBTZUSD')
            return float(ticker['c'][0][0])
        except Exception as e:
            logging.error(f"Error getting current price: {str(e)}")
            return 0

    def get_historical_data(self) -> pd.DataFrame:
        try:
            ohlcv = self.kraken.get_ohlc_data('XXBTZUSD', interval=1)[0]
            df = pd.DataFrame(ohlcv, columns=['time', 'open', 'high', 'low', 'close', 'vwap', 'volume', 'count'])
            for col in ['open', 'high', 'low', 'close', 'volume']:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            df['time'] = pd.to_datetime(df['time'], unit='s')
            df.set_index('time', inplace=True)
            return df
        except Exception as e:
            logging.error(f"Error getting historical data: {str(e)}")
            return pd.DataFrame()

    def calculate_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        try:
            df['RSI'] = self.indicators.calculate_rsi(df['close'])
            df['MACD'], df['MACD_signal'] = self.indicators.calculate_macd(df['close'])
            df['price_change'] = df['close'].pct_change()
            df['price_volatility'] = df['close'].rolling(window=20).std()
            df['volume_ma'] = df['volume'].rolling(window=20).mean()
            df['volume_ratio'] = df['volume'] / df['volume_ma']
            df['SMA_20'] = df['close'].rolling(window=20).mean()
            df['SMA_50'] = df['close'].rolling(window=50).mean()
            df['trend'] = (df['SMA_20'] > df['SMA_50']).astype(int)
            df['momentum'] = self.indicators.calculate_momentum(df['close'])
            df['stochastic'] = self.indicators.calculate_stochastic(df['high'], df['low'], df['close'])
            df['ema_diff'] = self.indicators.calculate_ema(df['stochastic'])
            print("DataFrame after indicator calculation:")
            print(df.tail())
            print(df.columns)
            return df
        except Exception as e:
            logging.error(f"Error calculating indicators: {str(e)}")
            return df

    def get_sentiment(self) -> Dict:
        try:
            posts_data = []
            for subreddit in ['bitcoin', 'cryptocurrency', 'bitcoinmarkets']:
                subreddit_posts = self.reddit.subreddit(subreddit).hot(limit=10)
                for post in subreddit_posts:
                    sentiment = TextBlob(f"{post.title} {post.selftext}").sentiment
                    posts_data.append({
                        'score': post.score,
                        'sentiment': sentiment.polarity,
                        'subjectivity': sentiment.subjectivity
                    })
            if not posts_data:
                return {'sentiment_score': 0, 'confidence': 0}
            avg_sentiment = np.mean([post['sentiment'] for post in posts_data])
            avg_confidence = np.mean([post['subjectivity'] for post in posts_data])
            return {
                'sentiment_score': avg_sentiment,
                'confidence': avg_confidence
            }
        except Exception as e:
            logging.error(f"Error getting sentiment: {str(e)}")
            return {'sentiment_score': 0, 'confidence': 0}

    def train_model(self) -> None:
        try:
            df = self.get_historical_data()
            if df.empty:
                raise ValueError("No historical data available")
            df = self.calculate_indicators(df)
            df = df.dropna()
            print("DataFrame after dropping NaN values:")
            print(df.tail())
            print(df.columns)
            X = df[self.features]
            print("X after selecting features:")
            print(X.tail())
            print(X.columns)
            df['target'] = ((df['close'].shift(-1) > df['close']) &
                            (df['volume'].shift(-1) > df['volume'])).astype(int)
            y = df['target']
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            self.model = RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=10,
                min_samples_leaf=5,
                random_state=42,
                class_weight='balanced'
            )
            self.model.fit(X_train_scaled, y_train)
            predictions = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, predictions)
            logging.info(f"Model trained successfully. Accuracy: {accuracy:.2f}")
            importance = pd.DataFrame({
                'feature': self.features,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            logging.info("\nFeature Importance:")
            for idx, row in importance.iterrows():
                logging.info(f"{row['feature']}: {row['importance']:.3f}")
        except Exception as e:
            logging.error(f"Error training model: {str(e)}")
            raise

    def generate_signal(self) -> Dict:
        try:
            if self.model is None:
                self.train_model()
            df = self.get_historical_data()
            if df.empty:
                return {'action': 'HOLD', 'confidence': 0}
            df = self.calculate_indicators(df)
            current_data = df[self.features].iloc[-1:].dropna()
            if current_data.empty:
                return {'action': 'HOLD', 'confidence': 0}
            scaled_data = self.scaler.transform(current_data)
            prob = self.model.predict_proba(scaled_data)[0]
            sentiment = self.get_sentiment()
            trend_confirmed = df['trend'].iloc[-1] == 1
            technical_score = prob[1]
            sentiment_score = sentiment['sentiment_score']
            combined_score = (technical_score * 0.6 +
                              sentiment_score * 0.2 +
                              (1 if trend_confirmed else 0) * 0.2)
            if combined_score > 0.7 and trend_confirmed:
                action = 'BUY'
            elif combined_score < 0.3 and not trend_confirmed:
                action = 'SELL'
            else:
                action = 'HOLD'
            logging.info(f"Combined Score: {combined_score:.2f}, Trend: {trend_confirmed}, Action: {action}")
            return {
                'action': action,
                'confidence': combined_score,
                'price': self.get_current_price()
            }
        except Exception as e:
            logging.error(f"Error generating signal: {str(e)}")
            return {'action': 'HOLD', 'confidence': 0.5, 'price': None}

    def execute_trade(self, signal: Dict, current_price: float) -> bool:
        try:
            if signal['action'] not in ['BUY', 'SELL']:
                return False
            if self.trades_today >= self.config['risk_params']['max_daily_trades']:
                logging.info("Daily trade limit reached")
                return False
            position_size = min(
                self.config['risk_params']['max_position_size'],
                self.current_position if signal['action'] == 'SELL' else self.config['risk_params']['max_position_size']
            )
            stop_loss = current_price * (1 - self.config['risk_params']['stop_loss_pct'] if signal['action'] == 'BUY'
                                         else 1 + self.config['risk_params']['stop_loss_pct'])
            take_profit = current_price * (1 + self.config['risk_params']['take_profit_pct'] if signal['action'] == 'BUY'
                                           else 1 - self.config['risk_params']['take_profit_pct'])
            logging.info(f"Executing {signal['action']} order:")
            logging.info(f"Price: ${current_price:.2f}")
            logging.info(f"Size: {position_size:.4f} BTC")
            logging.info(f"Stop Loss: ${stop_loss:.2f}")
            logging.info(f"Take Profit: ${take_profit:.2f}")
            self.trades_today += 1
            self.last_trade_time = datetime.now()
            self.current_position = (position_size if signal['action'] == 'BUY'
                                     else -position_size if signal['action'] == 'SELL'
                                     else self.current_position)
            if 'pushover' in self.config:
                pushover_config = self.config['pushover']
                message = (f"Trade executed: {signal['action']}\n"
                           f"Price: ${current_price:.2f}\n"
                           f"Size: {position_size:.4f} BTC")
                send_pushover_message(
                    pushover_config['user_key'],
                    pushover_config['api_token'],
                    message,
                    title="Trading Bot Notification"
                )
            return True
        except Exception as e:
            logging.error(f"Error executing trade: {str(e)}")
            return False

    def monitor_exchange_wallets(self):
        try:
            exchange_addresses = {
                'Binance': [
                    '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
                    '38UmuUqPCrFmQo4khkomQwZ4VbY2nZMJ67'
                ],
                'Coinbase': [
                    '1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ',
                    '1FzWLkAahHooV3kzTgyx6qsswXJ6sCXkSR'
                ]
            }
            results = {}
            for exchange, addresses in exchange_addresses.items():
                try:
                    exchange_data = {'balance': 0, 'recent_movements': []}
                    for address in addresses:
                        try:
                            url = f"https://blockchain.info/address/{address}?format=json"
                            response = requests.get(url)
                            response.raise_for_status()
                            data = response.json()
                            balance_btc = data.get('final_balance', 0) / 100000000
                            exchange_data['balance'] += balance_btc
                            transactions = data.get('txs', [])[:5]
                            for tx in transactions:
                                try:
                                    inputs = [inp for inp in tx['inputs'] if inp.get('prev_out', {}).get('addr') == address]
                                    outputs = [out for out in tx['out'] if out.get('addr') == address]
                                    if inputs and not outputs:
                                        amount = sum(inp.get('prev_out', {}).get('value', 0) for inp in inputs) / 100000000
                                        exchange_data['recent_movements'].append({
                                            'type': 'outflow',
                                            'amount': amount,
                                            'time': datetime.fromtimestamp(tx['time']),
                                            'hash': tx['hash']
                                        })
                                    elif outputs and not inputs:
                                        amount = sum(out.get('value', 0) for out in outputs) / 100000000
                                        exchange_data['recent_movements'].append({
                                            'type': 'inflow',
                                            'amount': amount,
                                            'time': datetime.fromtimestamp(tx['time']),
                                            'hash': tx['hash']
                                        })
                                except Exception as tx_e:
                                    logging.warning(f"Error processing transaction {tx.get('hash', 'unknown')} for address {address}: {tx_e}")
                        except requests.exceptions.RequestException as req_e:
                            logging.warning(f"Request error for address {address}: {req_e}")
                        except (ValueError, KeyError, TypeError) as json_e:
                            logging.warning(f"JSON decoding error for address {address}: {json_e}")
                        except Exception as addr_e:
                            logging.warning(f"Error processing address {address}: {addr_e}")
                    results[exchange] = exchange_data
                except Exception as exchange_e:
                    logging.error(f"Error processing exchange {exchange}: {exchange_e}")
            return results
        except Exception as e:
            logging.error(f"Error monitoring exchange wallets: {str(e)}")
            return {}

    def monitor_corporate_treasuries(self):
        try:
            microstrategy_data = self._check_microstrategy_updates()
            corporate_holders = {
                'MicroStrategy': microstrategy_data,
                'Tesla': self._check_company_filings('TSLA'),
                'Block (Square)': self._check_company_filings('SQ')
            }
            return corporate_holders
        except Exception as e:
            logging.error(f"Error monitoring corporate treasuries: {str(e)}")
            return {}

    def _check_microstrategy_updates(self):
        try:
            twitter_bearer_token = self.config.get('apis', {}).get('twitter_bearer_token')
            if twitter_bearer_token:
                headers = {"Authorization": f"Bearer {twitter_bearer_token}"}
                query = "from:michael_saylor bitcoin OR btc OR purchased OR acquired"
                tweet_fields = "created_at,public_metrics"
                url = f"https://api.twitter.com/2/tweets/search/recent?query={query}&tweet.fields={tweet_fields}&max_results=10"
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    tweets = data.get('data', [])
                    purchases = []
                    for tweet in tweets:
                        text = tweet['text'].lower()
                        if 'purchased' in text or 'acquired' in text or 'bought' in text:
                            amount_match = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?) bitcoin', text)
                            if amount_match:
                                amount = float(amount_match.group(1).replace(',', ''))
                                purchases.append({
                                    'date': tweet['created_at'],
                                    'amount': amount,
                                    'source': 'Twitter',
                                    'url': f"https://twitter.com/michael_saylor/status/{tweet['id']}"
                                })
                    return {
                        'recent_purchases': purchases,
                        'total_holdings': 140000
                    }
            return {'total_holdings': 140000, 'recent_purchases': []}
        except Exception as e:
            logging.error(f"Error checking MicroStrategy updates: {str(e)}")
            return {'total_holdings': 140000, 'recent_purchases': []}

    def _check_company_filings(self, ticker):
        return {'total_holdings': 0, 'last_update': None}

    def scan_bitcoin_whale_news(self):
        try:
            news_api_key = self.config.get('apis', {}).get('news_api_key')
            if not news_api_key:
                return {'articles': []}
            url = f"https://newsapi.org/v2/everything?q=bitcoin AND (whale OR large OR million OR billion) AND (buy OR bought OR purchase OR acquire OR sold)&apiKey={news_api_key}&language=en&sortBy=publishedAt&pageSize=10"
            response = requests.get(url)
            if response.status_code != 200:
                return {'articles': []}
            data = response.json()
            articles = data.get('articles', [])
            relevant_articles = []
            for article in articles:
                title = article['title'].lower()
                content = (article.get('description') or '').lower()
                amount_patterns = [
                    (r'(\d+(?:,\d+)*(?:\.\d+)?) bitcoin', 'BTC'),
                    (r'\$(\d+(?:,\d+)*(?:\.\d+)?) million', 'USD_millions'),
                    (r'\$(\d+(?:,\d+)*(?:\.\d+)?) billion', 'USD_billions')
                ]
                found_amounts = []
                for pattern, unit in amount_patterns:
                    matches = re.finditer(pattern, title + ' ' + content)
                    for match in matches:
                        amount = float(match.group(1).replace(',', ''))
                        if unit == 'USD_millions':
                            amount *= 1000000
                        elif unit == 'USD_billions':
                            amount *= 1000000000
                        found_amounts.append({'amount': amount, 'unit': unit})
                if found_amounts:
                    text = title + ' ' + content
                    sentiment = TextBlob(text).sentiment.polarity
                    action = 'unknown'
                    if re.search(r'buy|bought|purchase|acquire|acquired', text):
                        action = 'buy'
                    elif re.search(r'sell|sold|dump', text):
                        action = 'sell'
                    relevant_articles.append({
                        'title': article['title'],
                        'url': article['url'],
                        'published': article['publishedAt'],
                        'amounts': found_amounts,
                        'sentiment': sentiment,
                        'action': action
                    })
            return {'articles': relevant_articles}
        except Exception as e:
            print(f"An error occurred: {e}")
            return {'articles': []}

    def calculate_whale_activity_score(self):
        try:
            exchange_data = self.monitor_exchange_wallets()
            corporate_data = self.monitor_corporate_treasuries()
            news_data = self.scan_bitcoin_whale_news()
            score = 0.5
            net_exchange_flow = 0
            for exchange, data in exchange_data.items():
                for movement in data.get('recent_movements', []):
                    if movement['type'] == 'outflow':
                        net_exchange_flow -= movement['amount']
                    else:
                        net_exchange_flow += movement['amount']
            exchange_impact = -0.1 * (net_exchange_flow / 1000)
            score += min(0.2, max(-0.2, exchange_impact))
            recent_corporate_buying = 0
            for company, data in corporate_data.items():
                for purchase in data.get('recent_purchases', []):
                    if isinstance(purchase['date'], datetime):
                        purchase_date = purchase['date']
                    else:
                        purchase_date = datetime.strptime(purchase['date'], "%Y-%m-%d")
                    if purchase_date > datetime.now() - timedelta(days=7):
                        recent_corporate_buying += purchase['amount']
            corporate_impact = 0.05 * (recent_corporate_buying / 1000)
            score += min(0.2, max(0, corporate_impact))
            news_sentiment = 0
            for article in news_data.get('articles', []):
                if article['action'] == 'buy':
                    news_sentiment += article['sentiment']
                elif article['action'] == 'sell':
                    news_sentiment -= article['sentiment']
            news_impact = 0.05 * news_sentiment
            score += min(0.1, max(-0.1, news_impact))
            score = max(0, min(1, score))
            return {
                'whale_score': score,
                'interpretation': 'bullish' if score > 0.6 else 'bearish' if score < 0.4 else 'neutral',
                'components': {
                    'exchange_flow': net_exchange_flow,
                    'corporate_buying': recent_corporate_buying,
                    'news_sentiment': news_sentiment
                }
            }
        except Exception as e:
            logging.error(f"Error calculating whale activity score: {str(e)}")
            return {'whale_score': 0.5, 'interpretation': 'neutral'}

    def make_trade_decision(self):
        try:
            combined_analysis_result = self.combined_analysis.get_combined_score()
            combined_score = combined_analysis_result['combined_score']
            whale_activity_result = self.calculate_whale_activity_score()
            whale_score = whale_activity_result['whale_score']
            current_price = self.get_current_price()
            logging.info(f"Current BTC Price: ${current_price:.2f}")
            buy_threshold = 0.7
            sell_threshold = 0.3
            if combined_score > buy_threshold and whale_score > 0.4:
                action = 'BUY'
                confidence = combined_score
            elif combined_score < sell_threshold and whale_score < 0.6:
                action = 'SELL'
                confidence = 1 - combined_score
            else:
                action = 'HOLD'
                confidence = 0.5
            logging.info(f"Combined Score: {combined_score:.2f}, Whale Score: {whale_score:.2f}, Action: {action}, Confidence: {confidence:.2f}")
            return {
                'action': action,
                'confidence': confidence,
                'price': current_price
            }
        except Exception as e:
            logging.error(f"Error making trading decision: {str(e)}")
            return {'action': 'HOLD', 'confidence': 0.5, 'price': None}

def main():
    try:
        trader = TradingSystem()
        while True:
            if trader.last_trade_time and (datetime.now() - trader.last_trade_time).days >= 1:
                trader.trades_today = 0
            trading_decision = trader.make_trade_decision()
            if trading_decision['action'] != 'HOLD' and trading_decision['confidence'] > 0.7:
                success = trader.execute_trade(trading_decision, trading_decision['price'])
                if success:
                    logging.info(f"Trade executed successfully: {trading_decision['action']}")
            time.sleep(60)
    except KeyboardInterrupt:
        logging.info("Trading bot stopped by user")
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}")
        raise

if __name__ == "__main__":
    main()

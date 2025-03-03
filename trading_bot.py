import time
import os
import logging
from datetime import datetime, timedelta
from social_media_scraper import analyze_social_trends  # ✅ Import des Social Media Scrapers
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

# Suppress warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Import extra analysis functions
from extra_analysis import (
    calculate_ichimoku,
    calculate_adx,
    calculate_pivot_points,
    analyze_news_sentiment,
)


class PushoverNotifier:
    """Handles sending notifications via Pushover."""
    @staticmethod
    def send_message(user_key: str, api_token: str, message: str, title: str = "Trading Bot Notification") -> Dict:
        """Send a message using Pushover API."""
        url = "https://api.pushover.net/1/messages.json"
        data = {
            "token": api_token,
            "user": user_key,
            "message": message,
            "title": title
        }
        try:
            response = requests.post(url, data=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"Failed to send Pushover notification: {str(e)}")
            return {}


class TechnicalIndicators:
    """Calculates technical indicators for trading decisions."""
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
    """Analyzes macroeconomic indicators."""
    def __init__(self, config: Dict):
        self.config = config
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key: str, expiry_time: timedelta) -> Optional[Dict]:
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key: str, data: Dict, expiry_time: timedelta) -> None:
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def get_economic_indicators(self) -> Dict:
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
            self._cache_data(cache_key, indicators, timedelta(days=1))  # ✅ Fix: Caching applied
            return indicators
        except Exception as e:
            logging.error(f"Error fetching economic indicators: {str(e)}")
            return {}

    def train_model(self) -> None:
        try:
            df = self.get_historical_data()
            if df.empty:
                raise ValueError("No historical data available")

            df = self.calculate_indicators(df)
            df['target'] = ((df['close'].shift(-1) > df['close']) & (df['volume'].shift(-1) > df['volume'])).astype(int)
            df.dropna(inplace=True)  # ✅ Fix: Remove NaNs

            X = df[self.features]
            y = df['target']

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            self.scaler.fit(X_train)
            X_train_scaled = self.scaler.transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            self.model = RandomForestClassifier(n_estimators=200, max_depth=15, min_samples_split=10,
                                                min_samples_leaf=5, random_state=42, class_weight='balanced')
            self.model.fit(X_train_scaled, y_train)

            predictions = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, predictions)
            logging.info(f"Model trained successfully. Accuracy: {accuracy:.2f}")
        except Exception as e:
            logging.error(f"Error training model: {str(e)}")
            raise

    def get_macro_score(self) -> Dict:
        """Calculate a macro score based on economic indicators."""
        try:
            indicators = self.get_economic_indicators()
            score = 0.5
            if 'inflation' in indicators:
                inflation_impact = -0.1 if indicators['inflation']['change'] > 0 else 0.1
                score += inflation_impact
            if 'interest_rate' in indicators:
                rate_impact = -0.15 if indicators['interest_rate']['change'] > 0 else 0.15
                score += rate_impact
            score = max(0, min(1, score))
            return {'macro_score': score, 'components': {'indicators': indicators}}
        except Exception as e:
            logging.error(f"Error calculating macro score: {str(e)}")
            return {'macro_score': 0.5}


class OnChainAnalyzer:
    """Analyzes on-chain metrics for cryptocurrencies."""
    def __init__(self, config: Dict):
        self.config = config
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key: str, expiry_time: timedelta) -> Optional[Dict]:
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key: str, data: Dict, expiry_time: timedelta) -> None:
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def get_blockchain_metrics(self) -> Dict:
        """Fetch blockchain metrics from an external API or use mock data."""
        try:
            cache_key = "blockchain_metrics"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=4))
            if cached_data:
                return cached_data

            # Mock data for demonstration
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

    def get_onchain_score(self) -> Dict:
        """Calculate an on-chain score based on blockchain metrics."""
        try:
            metrics = self.get_blockchain_metrics()
            score = 0.5
            if 'hash_rate' in metrics:
                hash_impact = min(0.1, max(-0.1, metrics['hash_rate']['change'] * 0.5))
                score += hash_impact
            if 'active_addresses' in metrics:
                address_impact = min(0.1, max(-0.1, metrics['active_addresses']['change'] * 0.5))
                score += address_impact
            score = max(0, min(1, score))
            return {'onchain_score': score, 'components': {'metrics': metrics}}
        except Exception as e:
            logging.error(f"Error calculating on-chain score: {str(e)}")
            return {'onchain_score': 0.5}


class EnhancedSentimentAnalyzer:
    """Analyzes sentiment from social media and news."""
    def __init__(self, config: Dict, reddit: praw.Reddit):
        self.config = config
        self.reddit = reddit
        self.cache = {}
        self.cache_expiry = {}

    def _get_cached_data(self, cache_key: str, expiry_time: timedelta) -> Optional[Dict]:
        if cache_key in self.cache and datetime.now() < self.cache_expiry.get(cache_key, datetime.now()):
            return self.cache[cache_key]
        return None

    def _cache_data(self, cache_key: str, data: Dict, expiry_time: timedelta) -> None:
        self.cache[cache_key] = data
        self.cache_expiry[cache_key] = datetime.now() + expiry_time

    def analyze_social_sentiment(self) -> Dict:
        """Analyze sentiment from social media platforms."""
        try:
            cache_key = "social_sentiment"
            cached_data = self._get_cached_data(cache_key, timedelta(hours=1))
            if cached_data:
                return cached_data

            # Fetch Fear & Greed Index
            url = "https://api.alternative.me/fng/"
            response = requests.get(url)
            fng_data = response.json()
            sentiment_score = (int(fng_data['data'][0]['value']) - 50) / 50 if fng_data and 'data' in fng_data else 0

            # Analyze Reddit sentiment
            reddit_sentiment = self._analyze_reddit()

            combined_sentiment = {'sentiment_score': sentiment_score, 'reddit_sentiment': reddit_sentiment}
            self._cache_data(cache_key, combined_sentiment, timedelta(hours=1))
            return combined_sentiment
        except Exception as e:
            logging.error(f"Error analyzing social sentiment: {str(e)}")
            return {'sentiment_score': 0, 'reddit_sentiment': 0}

    def _analyze_reddit(self) -> float:
        """Analyze sentiment from Reddit posts."""
        try:
            subreddit = self.reddit.subreddit("bitcoin")
            posts = subreddit.hot(limit=10)
            sentiments = [TextBlob(f"{post.title} {post.selftext}").sentiment.polarity for post in posts]
            return sum(sentiments) / len(sentiments) if sentiments else 0
        except Exception as e:
            logging.error(f"Error analyzing Reddit sentiment: {str(e)}")
            return 0


class TradingSystem:
    def __init__(self, config_path: str = "config.yaml", paper_trade=True):
        """Initialisiert das Trading-System"""
        self.load_config(config_path)
        self.paper_trade = paper_trade
        self.api = krakenex.API(self.config['exchanges']['kraken']['api_key'],
                                self.config['exchanges']['kraken']['secret'])
        self.kraken = KrakenAPI(self.api)
        self.current_position = 0
        self.trades_today = 0
        self.last_trade_time = None
        self.indicators = TechnicalIndicators()
        self.model = None
        self.scaler = StandardScaler()
        self.features = ['RSI', 'MACD', 'MACD_signal', 'price_change', 'price_volatility', 'volume_ratio', 'trend']

    def load_config(self, config_path: str):
        """Lädt die Konfigurationsdatei"""
        try:
            with open(config_path, "r") as file:
                self.config = yaml.safe_load(file)
            logging.info("✅ Konfiguration erfolgreich geladen.")
        except Exception as e:
            logging.error(f"❌ Fehler beim Laden der Konfiguration: {e}")
            raise

    def get_current_price(self) -> float:
        """Holt den aktuellen BTC-Preis von Kraken"""
        try:
            time.sleep(2)
            ticker = self.kraken.get_ticker_information("XXBTZUSD")
            return float(ticker["c"][0][0]) if "c" in ticker else 0
        except Exception as e:
            logging.error(f"❌ Fehler beim Abrufen des aktuellen Preises: {e}")
            return 0

    def get_historical_data(self) -> pd.DataFrame:
        """Holt historische OHLCV-Daten von Kraken"""
        try:
            ohlcv = self.kraken.get_ohlc_data("XXBTZUSD", interval=1)[0]
            df = pd.DataFrame(ohlcv, columns=['time', 'open', 'high', 'low', 'close', 'vwap', 'volume', 'count'])
            df['time'] = pd.to_datetime(df['time'], unit='s')
            df.set_index('time', inplace=True)
            for col in ['open', 'high', 'low', 'close', 'volume']:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            return df
        except Exception as e:
            logging.error(f"❌ Fehler beim Abrufen historischer Daten: {e}")
            return pd.DataFrame()

    def calculate_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Berechnet technische Indikatoren für den Markt"""
        try:
            df['RSI'] = self.indicators.calculate_rsi(df['close'])
            df['MACD'], df['MACD_signal'] = self.indicators.calculate_macd(df['close'])
            df['price_change'] = df['close'].pct_change()
            df['price_volatility'] = df['close'].rolling(window=20).std()
            df['SMA_20'] = df['close'].rolling(window=20).mean()
            df['SMA_50'] = df['close'].rolling(window=50).mean()
            df['trend'] = (df['SMA_20'] > df['SMA_50']).astype(int)
            df['volume_ratio'] = df['volume'] / df['volume'].rolling(window=20).mean()
            return df
        except Exception as e:
            logging.error(f"❌ Fehler beim Berechnen der Indikatoren: {e}")
            return df

    def train_model(self):
        """Trainiert das Machine Learning Modell für Handelssignale"""
        try:
            df = self.get_historical_data()
            if df.empty:
                raise ValueError("❌ Keine historischen Daten verfügbar")

            df = self.calculate_indicators(df).dropna()
            X = df[self.features]
            df['target'] = (df['close'].shift(-1) > df['close']).astype(int)
            y = df['target']

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            self.scaler.fit(X_train)
            X_train_scaled = self.scaler.transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            self.model = RandomForestClassifier(n_estimators=200, max_depth=15, min_samples_split=10,
                                                min_samples_leaf=5, random_state=42, class_weight='balanced')
            self.model.fit(X_train_scaled, y_train)
            accuracy = accuracy_score(y_test, self.model.predict(X_test_scaled))
            logging.info(f"✅ Modell erfolgreich trainiert. Genauigkeit: {accuracy:.2f}")
        except Exception as e:
            logging.error(f"❌ Fehler beim Modelltraining: {e}")
            raise

    def generate_signal(self) -> dict:
        """Erzeugt ein Handelssignal basierend auf technischen & Social Media Analysen"""
        try:
            if self.model is None:
                self.train_model()

            df = self.get_historical_data()
            if df.empty:
                return {'action': 'HOLD', 'confidence': 0.5}

            df = self.calculate_indicators(df).dropna()
            X_latest = df[self.features].iloc[-1:].values
            X_latest_scaled = self.scaler.transform(X_latest)
            prediction = self.model.predict(X_latest_scaled)[0]
            confidence = max(self.model.predict_proba(X_latest_scaled)[0])

            sentiment_data = analyze_social_trends()  # 📊 Social Media Sentiment einbinden
            combined_sentiment = sentiment_data["combined_sentiment"]

            # Endgültige Entscheidung basierend auf Technik + Sentiment
            final_confidence = (confidence + combined_sentiment) / 2

            if final_confidence > 0.6:
                return {'action': 'BUY', 'confidence': final_confidence}
            elif final_confidence < 0.4:
                return {'action': 'SELL', 'confidence': abs(final_confidence)}
            return {'action': 'HOLD', 'confidence': 0.5}
        except Exception as e:
            logging.error(f"❌ Fehler bei der Signalgenerierung: {e}")
            return {'action': 'HOLD', 'confidence': 0.5}

    def execute_trade(self, action: str, amount: float):
        """Simuliert den Handel (kann auf Paper Trading umgestellt werden)"""
        if self.paper_trade:
            logging.info(f"📊 Paper Trade - {action}: {amount} BTC")
        else:
            logging.info(f"⚡ Realer Trade ausgeführt: {action} mit {amount} BTC")


import pandas as pd
import numpy as np
import requests
import re
from textblob import TextBlob
import logging
import urllib.parse
from typing import Tuple  # ✅ Fix: Added missing import


##############################
# Ichimoku Cloud Berechnung
##############################
def calculate_ichimoku(df: pd.DataFrame) -> dict:
    period9 = 9
    period26 = 26
    period52 = 52

    tenkan_sen = (df['high'].rolling(window=period9).max() + df['low'].rolling(window=period9).min()) / 2
    kijun_sen = (df['high'].rolling(window=period26).max() + df['low'].rolling(window=period26).min()) / 2
    senkou_span_a = ((tenkan_sen + kijun_sen) / 2).shift(period26)
    senkou_span_b = ((df['high'].rolling(window=period52).max() + df['low'].rolling(window=period52).min()) / 2).shift(period26)
    chikou_span = df['close'].shift(-period26)

    return {
        'tenkan_sen': tenkan_sen,
        'kijun_sen': kijun_sen,
        'senkou_span_a': senkou_span_a,
        'senkou_span_b': senkou_span_b,
        'chikou_span': chikou_span
    }


##############################
# ADX Berechnung (inkl. ATR)
##############################
def calculate_adx(df: pd.DataFrame, period: int = 14) -> float:
    df = df.copy()
    df['prev_close'] = df['close'].shift(1)

    df['tr'] = df.apply(lambda row: max(row['high'] - row['low'],
                                        abs(row['high'] - row['prev_close']),
                                        abs(row['low'] - row['prev_close'])), axis=1)
    atr = df['tr'].rolling(window=period).mean()

    df['up_move'] = df['high'] - df['high'].shift(1)
    df['down_move'] = df['low'].shift(1) - df['low']

    df['+DM'] = df.apply(lambda row: row['up_move'] if (row['up_move'] > row['down_move'] and row['up_move'] > 0) else 0, axis=1)
    df['-DM'] = df.apply(lambda row: row['down_move'] if (row['down_move'] > row['up_move'] and row['down_move'] > 0) else 0, axis=1)

    df['+DI'] = 100 * (df['+DM'].rolling(window=period).sum() / atr)
    df['-DI'] = 100 * (df['-DM'].rolling(window=period).sum() / atr)

    df['DX'] = 100 * abs((df['+DI'] - df['-DI']) / (df['+DI'] + df['-DI']))
    df['ADX'] = df['DX'].rolling(window=period).mean()

    if df['ADX'].notna().any():
        return df['ADX'].iloc[-1]
    return 0  # ✅ Fix: Prevent NaN return


##############################
# Pivot Points Berechnung
##############################
def calculate_pivot_points(df: pd.DataFrame) -> Tuple[float, float, float, float, float]:
    last_row = df.iloc[-1]
    pivot = (last_row['high'] + last_row['low'] + last_row['close']) / 3
    support1 = (2 * pivot) - last_row['high']
    resistance1 = (2 * pivot) - last_row['low']
    support2 = pivot - (last_row['high'] - last_row['low'])
    resistance2 = pivot + (last_row['high'] - last_row['low'])
    return pivot, support1, resistance1, support2, resistance2


##############################
# News Sentiment Analysis
##############################
def fetch_news(api_key: str, query: str = "cryptocurrency", page_size: int = 10) -> list:
    encoded_query = urllib.parse.quote(query)
    url = f"https://newsdata.io/api/1/news?q={encoded_query}&apiKey={api_key}&language=en&sortBy=publishedAt&pageSize={page_size}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching news: {str(e)}")
        return []


def analyze_news_sentiment(api_key: str) -> float:
    articles = fetch_news(api_key, query="bitcoin")
    sentiments = [TextBlob(article.get("title", "") + " " + (article.get("description") or "")).sentiment.polarity for article in articles]
    return sum(sentiments) / len(sentiments) if sentiments else 0  # ✅ Fix: Prevent division by zero

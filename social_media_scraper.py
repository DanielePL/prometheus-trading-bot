import requests
from bs4 import BeautifulSoup
from textblob import TextBlob
import praw
import logging

# 🔑 Reddit API Zugangsdaten (ersetze mit deinen echten Werten!)
reddit = praw.Reddit(
    client_id="DEIN_CLIENT_ID",
    client_secret="DEIN_CLIENT_SECRET",
    user_agent="DEIN_USER_AGENT"
)

# Wichtige Keywords für die Analyse
KEYWORDS = ["BTC", "Bitcoin", "BlackRock", "Binance", "Scam", "Wirtschaft", "Krieg"]


def scrape_google_news():
    """Scraped Google News nach aktuellen Bitcoin-Artikeln."""
    url = "https://news.google.com/search?q=Bitcoin+OR+BTC+OR+Binance+OR+BlackRock&hl=de&gl=DE&ceid=DE:de"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        logging.error(f"Fehler beim Laden von Google News: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    articles = soup.find_all("article")

    news_list = []
    for article in articles[:10]:
        title = article.find("a").text if article.find("a") else "Kein Titel"
        link = "https://news.google.com" + article.find("a")["href"] if article.find("a") else ""

        for keyword in KEYWORDS:
            if keyword.lower() in title.lower():
                news_list.append({"title": title, "link": link})
                break

    return news_list


def analyze_reddit_sentiment(subreddit_name="Bitcoin", post_limit=10):
    """Analysiert Sentiment von Reddit-Posts zu Bitcoin & Krypto."""
    print(f"\n🔍 Analysiere Reddit-Trends für: r/{subreddit_name}...")

    subreddit = reddit.subreddit(subreddit_name)
    posts = subreddit.search(" OR ".join(KEYWORDS), limit=post_limit, sort="new")

    sentiments = []
    for post in posts:
        text = f"{post.title} {post.selftext}"
        sentiment_score = TextBlob(text).sentiment.polarity
        sentiments.append(sentiment_score)

    avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0
    return avg_sentiment


def analyze_social_trends():
    """Kombiniert Google News & Reddit für einen Gesamt-Sentiment-Score."""
    google_news = scrape_google_news()
    google_sentiment = analyze_reddit_sentiment()  # Reddit-Sentiment analysieren

    news_titles = [news["title"] for news in google_news]
    google_news_sentiment = sum([TextBlob(title).sentiment.polarity for title in news_titles]) / len(
        news_titles) if news_titles else 0

    combined_sentiment = (google_news_sentiment + google_sentiment) / 2 if google_news or google_sentiment else 0

    return {
        "reddit_sentiment": google_sentiment,
        "google_sentiment": google_news_sentiment,
        "combined_sentiment": combined_sentiment
    }

import yaml
import krakenex
from pykrakenapi import KrakenAPI
import praw


def test_connections():
    print("Testing trading bot connections...\n")

    # Load config
    try:
        with open('config.yaml', 'r') as file:
            config = yaml.safe_load(file)
        print("✓ Config file loaded successfully")
    except Exception as e:
        print(f"✗ Error loading config: {str(e)}")
        return

    # Test Kraken connection
    try:
        api = krakenex.API(
            key=config['exchanges']['kraken']['api_key'],
            secret=config['exchanges']['kraken']['secret']
        )
        kraken = KrakenAPI(api)

        # Get BTC price
        ticker = kraken.get_ticker_information('XXBTZUSD')
        price = float(ticker['c'][0][0])
        print(f"✓ Kraken connection successful - BTC Price: ${price:,.2f}")
    except Exception as e:
        print(f"✗ Error connecting to Kraken: {str(e)}")

    # Test Reddit connection
    try:
        reddit = praw.Reddit(
            client_id=config['sentiment_params']['reddit']['client_id'],
            client_secret=config['sentiment_params']['reddit']['client_secret'],
            user_agent=config['sentiment_params']['reddit']['user_agent']
        )

        # Test subreddit access
        subreddit = reddit.subreddit('bitcoin')
        post = next(subreddit.hot(limit=1))
        print(f"✓ Reddit connection successful - Retrieved post: {post.title[:50]}...")
    except Exception as e:
        print(f"✗ Error connecting to Reddit: {str(e)}")


if __name__ == "__main__":
    test_connections()

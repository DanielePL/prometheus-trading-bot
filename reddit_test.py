import praw


def test_reddit():
    print("Testing Reddit connection...")
    try:
        # Initialize Reddit API
        reddit = praw.Reddit(
            client_id='RbCqjOq25eY7oRFprkXd8g',
            client_secret='4SHq2fG_nbq0VLjSQwFBpLN7RhoAPA',
            user_agent='script:crypto_trading_bot:v1.0 (by /u/MasterpieceWaste2470)'
        )

        # Test connection by getting a post from r/bitcoin
        bitcoin_subreddit = reddit.subreddit('bitcoin')
        print("\nLatest post from r/bitcoin:")
        for post in bitcoin_subreddit.hot(limit=1):
            print(f"Title: {post.title}")
            print(f"Score: {post.score}")

        print("\n✓ Reddit connection successful!")

    except Exception as e:
        print(f"\n✗ Error: {str(e)}")


if __name__ == "__main__":
    test_reddit()
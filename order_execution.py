import yaml
import krakenex
from pykrakenapi import KrakenAPI
import praw
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('trading_system.log'),
        logging.StreamHandler()
    ]
)


def execute_trade(config, action, volume):
    """
    Executes a trade on Kraken.

    Args:
        config (dict): Configuration dictionary.
        action (str): 'buy' or 'sell'.
        volume (float): Volume of the asset to trade.
    """
    try:
        api = krakenex.API(
            key=config['exchanges']['kraken']['api_key'],
            secret=config['exchanges']['kraken']['secret']
        )
        kraken = KrakenAPI(api)

        # Define pair and type
        pair = 'XXBTZUSD'  # Bitcoin/USD
        type = action  # 'buy' or 'sell'
        ordertype = 'market'  # Use market order for simplicity

        # Place order
        response = api.query_private(
            'AddOrder',
            {
                'pair': pair,
                'type': type,
                'ordertype': ordertype,
                'volume': volume,
            }
        )

        if response['error']:
            logging.error(f"Order failed: {response['error']}")
            return False

        logging.info(f"Order successful: {response['result']}")
        return True

    except Exception as e:
        logging.error(f"Error executing trade: {str(e)}")
        return False


def get_account_balance(config):
    """
    Retrieves the account balance from Kraken.

    Args:
        config (dict): Configuration dictionary.

    Returns:
        float: Account balance in USD, or None if an error occurred.
    """
    try:
        api = krakenex.API(
            key=config['exchanges']['kraken']['api_key'],
            secret=config['exchanges']['kraken']['secret']
        )
        kraken = KrakenAPI(api)

        # Get account balance
        balance = api.query_private('Balance')

        if balance['error']:
            logging.error(f"Failed to get balance: {balance['error']}")
            return None

        # Extract USD balance
        usd_balance = float(balance['result']['ZUSD'])
        logging.info(f"Account balance: ${usd_balance:.2f}")
        return usd_balance

    except Exception as e:
        logging.error(f"Error getting account balance: {str(e)}")
        return None


def calculate_order_size(balance, risk_pct=0.01, btc_price=None):
    """
    Calculates the order size based on account balance and risk percentage.

    Args:
        balance (float): Account balance in USD.
        risk_pct (float): Percentage of balance to risk on each trade.
        btc_price (float): Current BTC price in USD.

    Returns:
        float: Order size in BTC, or None if BTC price is not provided.
    """
    if btc_price is None:
        logging.error("BTC price is required to calculate order size.")
        return None

    risk_amount = balance * risk_pct
    order_size = risk_amount / btc_price
    logging.info(f"Calculated order size: {order_size:.8f} BTC")
    return order_size


if __name__ == "__main__":
    # Load config
    try:
        with open('config.yaml', 'r') as file:
            config = yaml.safe_load(file)
        print("✓ Config file loaded successfully")
    except Exception as e:
        print(f"✗ Error loading config: {str(e)}")
        exit()

    # Example usage
    account_balance = get_account_balance(config)
    if account_balance is not None:
        # Replace with your actual trading signal logic
        trading_signal = {'action': 'buy', 'confidence': 0.8}
        btc_price = 95000  # Replace with your actual BTC price retrieval method

        if trading_signal['action'] in ['buy', 'sell'] and trading_signal['confidence'] > 0.7:
            order_size = calculate_order_size(account_balance, btc_price=btc_price)
            if order_size is not None:
                success = execute_trade(config, trading_signal['action'], order_size)
                if success:
                    logging.info(f"Trade executed successfully: {trading_signal['action']}")
                else:
                    logging.error("Trade execution failed.")
        else:
            logging.info("No trade signal or confidence too low.")

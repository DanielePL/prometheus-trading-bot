import time
import logging
from datetime import datetime, timedelta
import requests
from trading_bot import TradingSystem


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


class PaperTrader:
    def __init__(self, config_path="test_config.yaml", initial_usd=10000.0, initial_btc=0.01, initial_avg_price=None):
        self.trading_system = TradingSystem(config_path=config_path)
        self.usd_balance = initial_usd
        self.btc_balance = initial_btc
        self.trades = []
        self.total_profit = 0.0
        self.fee_percentage = 0.005  # 0.5% Fee
        self.min_trade_interval = 300  # 5 Minuten
        self.last_trade_time = None
        self.last_trade_price = None
        self.last_buy_price = None
        self.average_buy_price = initial_avg_price or 86000.0 if initial_btc > 0 else None

    def get_dynamic_trade_signal(self):
        """Ermittelt das Handelssignal basierend auf kombinierter Analyse."""
        if hasattr(self.trading_system, "combined_analysis"):
            combined = self.trading_system.combined_analysis.get_combined_score()
        else:
            combined = {'combined_score': 0.5}  # Standardwert für Paper Trading

        combined_score = combined['combined_score']
        if self.usd_balance > 0 and self.btc_balance <= 0:
            return {'action': 'BUY', 'confidence': combined_score}
        if combined_score > 0.7:
            return {'action': 'BUY', 'confidence': combined_score}
        elif combined_score < 0.3:
            return {'action': 'SELL', 'confidence': 1 - combined_score}
        return {'action': 'HOLD', 'confidence': combined_score}

    def execute_paper_trade(self, signal, current_price):
        """Führt einen simulierten Trade aus."""
        try:
            if self.last_trade_time:
                elapsed = (datetime.now() - self.last_trade_time).total_seconds()
                if elapsed < self.min_trade_interval:
                    print(f"Wartezeit nicht erreicht ({elapsed:.0f}s). Trade übersprungen.")
                    return False

            if current_price is None or current_price <= 0:
                print("Ungültiger Preis erhalten, Trade wird übersprungen.")
                return False

            trade_details = {}

            if signal['action'] == 'BUY' and self.usd_balance > 0:
                trade_amount_usd = min(self.usd_balance, self.usd_balance * 0.05)
                trade_amount_btc = trade_amount_usd / current_price
                fee = trade_amount_usd * self.fee_percentage

                if self.usd_balance < trade_amount_usd + fee:
                    print("Nicht genügend USD für Kauf.")
                    return False

                self.btc_balance += trade_amount_btc
                self.usd_balance -= (trade_amount_usd + fee)
                self.average_buy_price = (
                                                     self.average_buy_price + current_price) / 2 if self.average_buy_price else current_price
                self.last_buy_price = current_price
                print(f"✓ BUY {trade_amount_btc:.6f} BTC at ${current_price:,.2f}")

            elif signal['action'] == 'SELL' and self.btc_balance > 0:
                trade_amount_btc = self.btc_balance
                revenue = trade_amount_btc * current_price
                fee = revenue * self.fee_percentage
                net_revenue = revenue - fee

                self.usd_balance += net_revenue
                self.btc_balance = 0.0
                profit = (current_price - self.average_buy_price) * trade_amount_btc - fee
                self.total_profit += profit

                print(f"✓ SELL {trade_amount_btc:.6f} BTC at ${current_price:,.2f}, Profit: ${profit:,.2f}")

            self.last_trade_time = datetime.now()
            self.last_trade_price = current_price
            return True

        except Exception as e:
            print(f"Error in paper trade: {str(e)}")
            return False


def run_simulated_trades(num_trades=10, sleep_interval=30):
    """Führt simulierte Trades aus."""
    print("\nStarting Simulated Trades...\n" + "=" * 50)
    paper_trader = PaperTrader()

    for i in range(num_trades):
        print(f"\n--- Trade {i + 1} ---")
        current_price = paper_trader.trading_system.get_current_price()

        if paper_trader.last_trade_price:
            price_change_pct = abs(
                (current_price - paper_trader.last_trade_price) / paper_trader.last_trade_price) * 100
        else:
            price_change_pct = 100  # Erzwinge den ersten Trade

        if price_change_pct < 0.1:
            print(f"Preisänderung zu gering ({price_change_pct:.2f}%), Trade übersprungen.")
            time.sleep(sleep_interval)
            continue

        signal = paper_trader.get_dynamic_trade_signal()
        if signal['confidence'] > 0.4:
            paper_trader.execute_paper_trade(signal, current_price)
        else:
            print("Signal Confidence zu niedrig, Trade wird übersprungen.")

        time.sleep(sleep_interval)


if __name__ == "__main__":
    run_simulated_trades()

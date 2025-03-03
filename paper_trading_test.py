import os
import sys
import time
import logging
from datetime import datetime, timedelta
from trading_bot import TradingSystem
import requests

# Beispiel-Funktion zum Senden von Pushover Push-Nachrichten
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

# Beispiel-Aufruf:
if __name__ == "__main__":
    user_key = "DEIN_USER_KEY"
    api_token = "DEIN_API_TOKEN"
    message = "Trade executed: BUY 0.005 BTC at $90,000"
    result = send_pushover_message(user_key, api_token, message)
    print(result)

class PaperTrader:
    def __init__(self):
        self.trading_system = TradingSystem()
        self.initial_balance = 10000  # Startkapital in USD
        self.btc_balance = 0.0
        self.usd_balance = self.initial_balance
        self.trades = []
        self.total_profit = 0.0
        self.fee_percentage = 0.005  # 0.5% Gebühr

    def execute_paper_trade(self, signal, current_price):
        """Führt einen simulierten Trade aus – inkl. Checks und Portfolio-Updates"""
        try:
            # 1. Prüfen, ob Signal BUY oder SELL ist
            if signal['action'] not in ['BUY', 'SELL']:
                print("Kein gültiges Signal, Trade wird übersprungen.")
                return False

            # Für SELL: Falls keine BTC im Portfolio vorhanden sind, überspringen (Short Selling nicht erlaubt)
            if signal['action'] == 'SELL' and self.btc_balance <= 0:
                print("Kein BTC-Bestand zum Verkaufen vorhanden. SELL-Trade wird übersprungen.")
                return False

            # 2. Portfolio-Update & Berechnung der Ordergröße
            if signal['action'] == 'BUY':
                # Beispiel: Kaufe max. 5% des initialen Portfolios in USD
                max_trade_fraction = 0.05
                trade_amount_usd = min(self.usd_balance, self.initial_balance * max_trade_fraction)
                trade_amount_btc = trade_amount_usd / current_price

                # Berechne die Gebühr (0.5% des Handelsbetrags)
                fee = trade_amount_usd * self.fee_percentage

                if self.usd_balance < trade_amount_usd + fee:
                    print("Nicht genügend USD vorhanden, um Trade und Gebühren zu decken.")
                    return False

                # Portfolio-Update: Erhöhe BTC-Bestand, ziehe USD (und Gebühr) ab
                self.btc_balance += trade_amount_btc
                self.usd_balance -= (trade_amount_usd + fee)

                trade_details = {
                    'time': datetime.now(),
                    'action': 'BUY',
                    'price': current_price,
                    'amount_btc': trade_amount_btc,
                    'amount_usd': trade_amount_usd,
                    'fee': fee,
                    'balance_btc': self.btc_balance,
                    'balance_usd': self.usd_balance
                }
                self.trades.append(trade_details)
                print(f"\n✓ Paper Trade: BUY {trade_amount_btc:.6f} BTC at ${current_price:,.2f}")
                print(f"  Cost: ${trade_amount_usd:,.2f}, Fee: ${fee:,.2f}")

            elif signal['action'] == 'SELL':
                # 1. Falls Short Selling nicht erlaubt ist, verkaufen wir nur den vorhandenen BTC-Bestand
                trade_amount_btc = self.btc_balance
                revenue = trade_amount_btc * current_price

                fee = revenue * self.fee_percentage
                net_revenue = revenue - fee

                self.usd_balance += net_revenue
                self.btc_balance = 0.0

                # Berechnung des Gewinns aus dem Trade
                # Hier wird angenommen, dass der Kaufpreis im Trade-Record hinterlegt ist;
                # für eine realistischere Simulation müsste man den durchschnittlichen Kaufpreis tracken.
                profit = net_revenue  # Platzhalter – ggf. anpassen
                self.total_profit += profit

                trade_details = {
                    'time': datetime.now(),
                    'action': 'SELL',
                    'price': current_price,
                    'amount_btc': trade_amount_btc,
                    'amount_usd': revenue,
                    'fee': fee,
                    'balance_btc': self.btc_balance,
                    'balance_usd': self.usd_balance,
                    'profit': profit
                }
                self.trades.append(trade_details)
                print(f"\n✓ Paper Trade: SELL {trade_amount_btc:.6f} BTC at ${current_price:,.2f}")
                print(f"  Revenue: ${revenue:,.2f}, Fee: ${fee:,.2f}")
                print(f"  Profit: ${profit:,.2f}")

            # 3. Portfolio-Status aktualisieren und ausgeben
            portfolio_value = self.usd_balance + (self.btc_balance * current_price)
            profit_loss = portfolio_value - self.initial_balance

            print(f"\nPortfolio Status:")
            print(f"BTC Balance: {self.btc_balance:.6f} BTC")
            print(f"USD Balance: ${self.usd_balance:,.2f}")
            print(f"Total Value: ${portfolio_value:,.2f}")
            print(f"Total Profit/Loss: ${profit_loss:,.2f}")
            print(f"Return: {(profit_loss / self.initial_balance * 100):.2f}%")

            # Optionale Push-Benachrichtigung via Pushover senden:
            if 'pushover' in self.trading_system.config:
                pushover_config = self.trading_system.config['pushover']
                message = "\n".join([
                    f"Trade executed: {signal['action']}",
                    f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                    f"Price: ${current_price:,.2f}",
                    f"New USD Balance: ${self.usd_balance:,.2f}",
                    f"New BTC Balance: {self.btc_balance:.6f}"
                ])
                pushover_result = send_pushover_message(
                    pushover_config['user_key'],
                    pushover_config['api_token'],
                    message,
                    title="Trading Bot Notification"
                )
                logging.info(f"Pushover response: {pushover_result}")

            return True
        except Exception as e:
            print(f"Error in paper trade: {str(e)}")
            return False


def run_paper_trading_test(duration_minutes=180):
    """Führt einen Paper Trading Test durch"""
    print("\nStarting Paper Trading Test...")
    print("=" * 50)

    paper_trader = PaperTrader()
    # Testdauer in Sekunden (hier: duration_minutes * 60)
    end_time = time.time() + (duration_minutes * 60)

    try:
        while time.time() < end_time:
            current_price = paper_trader.trading_system.get_current_price()
            print(f"\nCurrent BTC Price: ${current_price:,.2f}")

            trading_decision = paper_trader.trading_system.make_trade_decision()
            print(f"Signal: {trading_decision['action']} (Confidence: {trading_decision['confidence']:.2f})")

            # Führe Trade aus, wenn Signal stark genug ist
            if trading_decision['action'] != 'HOLD' and trading_decision['confidence'] > 0.4:
                paper_trader.execute_paper_trade(trading_decision, current_price)

            time.sleep(30)

    except KeyboardInterrupt:
        print("\nPaper trading test stopped by user")

    print("\nPaper Trading Test Results")
    print("=" * 50)
    final_value = paper_trader.usd_balance + (paper_trader.btc_balance * current_price)
    print(f"Total Trades: {len(paper_trader.trades)}")
    print(f"Final Portfolio Value: ${final_value:,.2f}")
    print(f"Total Profit/Loss: ${paper_trader.total_profit:,.2f}")
    print(f"Return: {((final_value - paper_trader.initial_balance) / paper_trader.initial_balance * 100):.2f}%")


if __name__ == "__main__":
    # Beispiel: Test für 180 Minuten (3 Stunden)
    run_paper_trading_test(180)

import time
import logging
from datetime import datetime, timedelta
import random
import requests
import pandas as pd

# Importiere dein TradingSystem aus trading_bot.py (Stelle sicher, dass die Datei im Pfad liegt)
from trading_bot import TradingSystem

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


class PaperTrader:
    def __init__(self, initial_usd=10000.0, initial_btc=0.01):
        self.trading_system = TradingSystem()
        self.initial_balance = initial_usd  # Startkapital in USD
        self.btc_balance = initial_btc      # Starte z.B. mit 0.01 BTC, wenn gewünscht
        self.usd_balance = self.initial_balance
        self.trades = []
        self.total_profit = 0.0
        self.fee_percentage = 0.005  # 0.5% Gebühr
        self.min_trade_interval = 300  # Mindestwartezeit: 300 Sekunden (5 Minuten)
        self.last_trade_time = None
        self.last_trade_price = None  # Preis des letzten Trades (für Mindestpreisänderung)
        self.last_buy_price = None    # Preis, zu dem zuletzt gekauft wurde
  # Preis, zu dem zuletzt gekauft wurde

    def get_dynamic_trade_signal(self):
        """
        Holt den kombinierten Score aus der kombinierten Analyse und gibt ein Handelssignal zurück.
        Wenn der Score > 0.7, dann BUY, wenn < 0.3, dann SELL, sonst HOLD.
        """
        combined = self.trading_system.combined_analysis.get_combined_score()
        combined_score = combined['combined_score']
        if combined_score > 0.7:
            return {'action': 'BUY', 'confidence': combined_score}
        elif combined_score < 0.3:
            return {'action': 'SELL', 'confidence': 1 - combined_score}
        else:
            return {'action': 'HOLD', 'confidence': combined_score}


    def execute_paper_trade(self, signal, current_price):
        """Führt einen simulierten Trade aus – inkl. Prüfung, Portfolio-Updates und Pushover-Nachricht."""
        try:
            # Mindestwartezeit prüfen
            if self.last_trade_time is not None:
                elapsed = (datetime.now() - self.last_trade_time).total_seconds()
                if elapsed < self.min_trade_interval:
                    print(f"Wartezeit nicht erreicht (vergangene Sekunden: {elapsed:.0f}). Trade wird übersprungen.")
                    return False

            # Mindestpreisänderung seit letztem Trade prüfen
            if self.last_trade_price is not None:
                price_change_pct = abs((current_price - self.last_trade_price) / self.last_trade_price) * 100
                min_price_change_pct = 0.1  # 0.1% Mindeständerung
                if price_change_pct < min_price_change_pct:
                    print(f"Preisänderung zu gering ({price_change_pct:.2f}%), Trade wird übersprungen.")
                    time.sleep(1)
                    return False

            # Signal prüfen: Nur BUY oder SELL zulassen
            if signal['action'] not in ['BUY', 'SELL']:
                print("Kein gültiges Signal, Trade wird übersprungen.")
                return False

            # Wenn SELL-Signal und kein BTC vorhanden, überspringen (Short Selling nicht erlaubt)
            if signal['action'] == 'SELL' and self.btc_balance <= 0:
                print("Kein BTC-Bestand zum Verkaufen vorhanden. SELL-Trade wird übersprungen.")
                return False

            trade_details = {}

            if signal['action'] == 'BUY':
                max_trade_fraction = 0.05  # Investiere maximal 5% des initialen Kapitals in USD
                trade_amount_usd = min(self.usd_balance, self.initial_balance * max_trade_fraction)
                trade_amount_btc = trade_amount_usd / current_price
                fee = trade_amount_usd * self.fee_percentage

                if self.usd_balance < trade_amount_usd + fee:
                    print("Nicht genügend USD vorhanden, um Trade und Gebühren zu decken.")
                    return False

                self.btc_balance += trade_amount_btc
                self.usd_balance -= (trade_amount_usd + fee)
                self.last_buy_price = current_price  # Speichere Kaufpreis

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
                print(f"\n✓ Paper Trade: BUY {trade_amount_btc:.6f} BTC at ${current_price:,.2f}")
                print(f"  Cost: ${trade_amount_usd:,.2f}, Fee: ${fee:,.2f}")

            elif signal['action'] == 'SELL':
                # Dynamisches Gewinnziel: Nur verkaufen, wenn aktueller Preis mindestens 3% über letztem Kaufpreis liegt,
                # ggf. dynamisch angepasst an die Volatilität.
                if self.last_buy_price is not None:
                    dynamic_target = 0.03  # Basisziel: 3%
                    # Hier könntest du den dynamic_target weiter anpassen – z. B. abhängig von ATR
                    target_price = self.last_buy_price * (1 + dynamic_target)
                    if current_price < target_price:
                        print(f"Gewinnziel noch nicht erreicht (Ziel: ${target_price:,.2f}, aktueller Preis: ${current_price:,.2f}). SELL wird übersprungen.")
                        return False

                trade_amount_btc = self.btc_balance
                revenue = trade_amount_btc * current_price
                fee = revenue * self.fee_percentage
                net_revenue = revenue - fee

                self.usd_balance += net_revenue
                self.btc_balance = 0.0

                profit = net_revenue  # Platzhalter für Gewinnberechnung
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
                print(f"\n✓ Paper Trade: SELL {trade_amount_btc:.6f} BTC at ${current_price:,.2f}")
                print(f"  Revenue: ${revenue:,.2f}, Fee: ${fee:,.2f}")
                print(f"  Profit: ${profit:,.2f}")

            # Aktualisiere letzten Trade-Zeitpunkt und Preis
            self.last_trade_time = datetime.now()
            self.last_trade_price = current_price

            # Portfolio-Status ausgeben
            portfolio_value = self.usd_balance + (self.btc_balance * current_price)
            profit_loss = portfolio_value - self.initial_balance
            print(f"\nPortfolio Status:")
            print(f"BTC Balance: {self.btc_balance:.6f} BTC")
            print(f"USD Balance: ${self.usd_balance:,.2f}")
            print(f"Total Value: ${portfolio_value:,.2f}")
            print(f"Total Profit/Loss: ${profit_loss:,.2f}")
            print(f"Return: {(profit_loss / self.initial_balance * 100):.2f}%")

            # Pushover Benachrichtigung senden: Alle Details melden
            if 'pushover' in self.trading_system.config:
                pushover_config = self.trading_system.config['pushover']
                msg_lines = [
                    f"Trade executed: {signal['action']}",
                    f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                    f"Price: ${current_price:,.2f}"
                ]
                if signal['action'] == 'BUY':
                    msg_lines.extend([
                        f"BTC bought: {trade_details['amount_btc']:.6f}",
                        f"USD spent: ${trade_details['amount_usd']:,.2f}",
                        f"Fee: ${trade_details['fee']:,.2f}"
                    ])
                elif signal['action'] == 'SELL':
                    msg_lines.extend([
                        f"BTC sold: {trade_details['amount_btc']:.6f}",
                        f"Revenue: ${trade_details['amount_usd']:,.2f}",
                        f"Fee: ${trade_details['fee']:,.2f}",
                        f"Profit: ${trade_details.get('profit', 0):,.2f}"
                    ])
                msg_lines.extend([
                    f"New USD Balance: ${self.usd_balance:,.2f}",
                    f"New BTC Balance: {self.btc_balance:.6f}"
                ])
                pushover_message = "\n".join(msg_lines)
                pushover_result = send_pushover_message(
                    pushover_config['user_key'],
                    pushover_config['api_token'],
                    pushover_message,
                    title="Trading Bot Notification"
                )
                logging.info(f"Pushover response: {pushover_result}")

            return True

        except Exception as e:
            print(f"Error in paper trade: {str(e)}")
            return False

def run_simulated_trades(num_trades=10, sleep_interval=30):
    print("\nStarting Simulated Trades...")
    print("=" * 50)

    paper_trader = PaperTrader()

    for i in range(num_trades):
        print(f"\n--- Trade {i+1} ---")
        current_price = paper_trader.trading_system.get_current_price()
        print(f"Current BTC Price: ${current_price:,.2f}")

        # Optional: Mindestpreisänderung prüfen...
        if paper_trader.last_trade_price is not None:
            price_change_pct = abs((current_price - paper_trader.last_trade_price) / paper_trader.last_trade_price) * 100
            if price_change_pct < 0.1:
                print(f"Preisänderung zu gering ({price_change_pct:.2f}%), Trade wird übersprungen.")
                time.sleep(sleep_interval)
                continue

        # Verwende die dynamische Signalgenerierung
        signal = paper_trader.get_dynamic_trade_signal()
        print(f"Signal: {signal['action']} (Confidence: {signal['confidence']:.2f})")
        if signal['confidence'] > 0.4:
            paper_trader.execute_paper_trade(signal, current_price)
        else:
            print("Signal Confidence zu niedrig, Trade wird übersprungen.")

        time.sleep(sleep_interval)


    final_value = paper_trader.usd_balance + (paper_trader.btc_balance * current_price)
    print("\nSimulated Trades Test Results")
    print("=" * 50)
    print(f"Total Trades Executed: {len(paper_trader.trades)}")
    print(f"Final Portfolio Value: ${final_value:,.2f}")
    print(f"Total Profit/Loss: ${paper_trader.total_profit:,.2f}")
    print(f"Return: {((final_value - paper_trader.initial_balance) / paper_trader.initial_balance * 100):.2f}%")

if __name__ == "__main__":
    # Starte PaperTrader mit einem initialen BTC-Bestand (z. B. 0.01 BTC)
    paper_trader = PaperTrader(initial_usd=10000.0, initial_btc=0.01)
    run_simulated_trades(num_trades=10, sleep_interval=30)

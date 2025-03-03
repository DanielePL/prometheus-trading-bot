import requests
import yaml


def load_config(config_path='config.yaml'):
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)


def test_alphavantage_connection(api_key):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": "IBM",
        "interval": "5min",
        "apikey": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if "Error Message" in data:
            print("Alphavantage: Fehlerhafte Anfrage:", data["Error Message"])
        else:
            print("Alphavantage Verbindung erfolgreich!")
            print("Antwort Keys:", list(data.keys()))
    else:
        print("Alphavantage Verbindung fehlgeschlagen, Status Code:", response.status_code)


def test_etherscan_connection(api_key):
    url = "https://api.etherscan.io/api"
    params = {
        "module": "proxy",
        "action": "eth_blockNumber",
        "apikey": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data.get("result"):
            print("Etherscan Verbindung erfolgreich!")
            print("Aktuelle Blocknummer:", data["result"])
        else:
            print("Etherscan: Fehlerhafte Antwort:", data)
    else:
        print("Etherscan Verbindung fehlgeschlagen, Status Code:", response.status_code)


def test_newsapi_connection(api_key):
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "country": "us",
        "apiKey": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "ok":
            print("NewsAPI Verbindung erfolgreich!")
            print("Anzahl Artikel:", len(data.get("articles", [])))
        else:
            print("NewsAPI: Fehlerhafte Antwort:", data)
    else:
        print("NewsAPI Verbindung fehlgeschlagen, Status Code:", response.status_code)


if __name__ == "__main__":
    config = load_config()
    # Zugriff über die konfigurierten Schlüssel:
    news_api_key = config['apis']['news_api_key']
    alphavantage_key = config['apis']['alphavantage']['api_key']
    etherscan_key = config['apis']['etherscan']['api_key']

    print("Teste Alphavantage Verbindung:")
    test_alphavantage_connection(alphavantage_key)

    print("\nTeste Etherscan Verbindung:")
    test_etherscan_connection(etherscan_key)

    print("\nTeste NewsAPI Verbindung:")
    test_newsapi_connection(news_api_key)

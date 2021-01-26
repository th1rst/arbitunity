export const getExchangeURL = (coinName, exchangeName) => {
  let marketURL;

  switch (exchangeName) {
    case "Binance":
      marketURL = `https://www.binance.com/en/trade/${coinName}_BTC`;
      break;
    case "Bitfinex":
      marketURL = `https://trading.bitfinex.com/t/${coinName}:BTC`;
      break;
    case "Bittrex":
      marketURL = `https://global.bittrex.com/Market/Index?MarketName=BTC-${coinName}`;
      break;
    case "CoinEx":
      marketURL = `https://www.coinex.com/exchange?currency=BTC&dest=${coinName}`;
      break;
    case "GateIO":
      marketURL = `https://www.gate.io/trade/${coinName}_btc`;
      break;
    case "Huobi":
      marketURL = `https://www.huobi.com/en-us/exchange/${coinName.toLowerCase()}_btc/`;
      break;
    case "Kucoin":
      marketURL = `https://www.kucoin.com/trade/${coinName}-BTC`;
      break;
    case "OKex":
      marketURL = `https://www.okex.com/spot/trade/${coinName}-btc`;
      break;
    case "Poloniex":
      marketURL = `https://poloniex.com/exchange/BTC_${coinName}`;
      break;
    default:
      break;
  }
  return marketURL;
};

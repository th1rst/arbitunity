export const getExchangeURL = (coinName, exchangeName) => {
  let marketURL;

  switch (exchangeName) {
    case "Binance":
      marketURL = `https://www.binance.com/en/trade/${coinName}_BTC`;
      break;
    default:
      break;
  }
  return marketURL;
};

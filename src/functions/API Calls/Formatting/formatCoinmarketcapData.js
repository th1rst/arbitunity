export const formatCoinmarketcapData = (input) => {
  const coinSymbols = [];

  // get all the tickers (i.e. "BTC, ETH, XMR" ) and push to array
  input.data.map((coin) => coinSymbols.push(coin.symbol));

  //set array of symbols/tickers in state
  return coinSymbols;
};

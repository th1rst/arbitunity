export const formatCoinmarketcapData = (input) => {
  // get all the tickers (i.e. "BTC, ETH, XMR" ) and push to array
  const coinSymbols = input.data.map((coin) => ({
    symbol: coin.symbol,
    id: coin.id,
  }));
  //set array of symbols/tickers in state
  return coinSymbols;
};

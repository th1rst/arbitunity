export const formatBittrexData = (APIdata, topCryptoTickers) => {
  const relevantBittrexCoins = [];

  APIdata.forEach((coin) => {
    // Bittrex seperates trading pairs by dash, so remove it
    // then remove "BTC" from it to get the actual coin name
    const name = coin.symbol
      .split("-")
      .join("")
      .substring(0, coin.symbol.length - 4);
    const price = coin.lastTradeRate;
    const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    if (lastThreeChars === "BTC") {
      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantBittrexCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantBittrexCoins;
};

export const formatHuobiData = (APIdata, topCryptoTickers) => {
  const relevantHuobiCoins = [];

  APIdata.forEach((coin) => {
    const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);
    // check if it's a BTC trading pair (i.e. "ethbtc")
    if (lastThreeChars === "btc") {
      const name = coin.symbol
        .substring(0, coin.symbol.length - 3)
        .toUpperCase();

      // for the time being, calculate the median price between bid and ask.
      // will get replaced by a more accurate one in the future
      const medianPrice = ((coin.bid + coin.ask) / 2).toFixed(8);
      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantHuobiCoins.push({ name: name, price: medianPrice });
        }
      });
    }
  });
  return relevantHuobiCoins;
};

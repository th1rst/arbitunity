export const formatBinanceData = (APIdata, topCryptoTickers) => {
  const relevantBinanceCoins = [];

  APIdata.forEach((coin) => {
    const name = coin.symbol.substring(0, coin.symbol.length - 3);
    const price = coin.price;
    const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    if (lastThreeChars === "BTC") {
      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantBinanceCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantBinanceCoins;
};

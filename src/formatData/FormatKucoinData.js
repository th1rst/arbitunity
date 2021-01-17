export const formatKucoinData = (APIdata, topCryptoTickers) => {
  const relevantKucoinCoins = [];

  APIdata.forEach((coin) => {
    const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    if (lastThreeChars === "BTC") {
      // trading pairs are separated by dash, so remove 4 instead of 3
      const name = coin.symbol.substring(0, coin.symbol.length - 4);
      const price = coin.averagePrice;
      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantKucoinCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantKucoinCoins;
};

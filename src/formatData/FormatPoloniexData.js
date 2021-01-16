export const formatPoloniexData = (APIdata, topCryptoTickers) => {
  const relevantPoloniexCoins = [];

  Object.entries(APIdata).forEach((coin) => {
    // Poloniex displays trading pairs like this ("BTC_ETH")
    const firstThreeChars = coin[0].substring(0, 3);

    // check if it's a BTC trading pair
    if (firstThreeChars === "BTC") {
      //then remove "BTC_" from it to get the actual coin name
      const name = coin[0].substring(4, coin[0].length);
      const price = coin[1].last;

      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantPoloniexCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantPoloniexCoins;
};

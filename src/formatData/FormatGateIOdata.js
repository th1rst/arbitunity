export const formatGateIOdata = (APIdata, topCryptoTickers) => {
  const relevantGateIOcoins = [];

  APIdata.forEach((coin) => {
    const lastThreeChars = coin.currency_pair.substring(
      coin.currency_pair.length - 3
    );

    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    if (lastThreeChars === "BTC") {
      const price = coin.last;
      const name = coin.currency_pair.substring(
        0,
        coin.currency_pair.length - 4
      );

      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantGateIOcoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantGateIOcoins;
};

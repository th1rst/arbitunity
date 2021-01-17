export const formatOkexdata = (APIdata, topCryptoTickers) => {
  const relevantOkexCoins = [];

  APIdata.forEach((coin) => {
    const lastThreeChars = coin.instrument_id.substring(
      coin.instrument_id.length - 3
    );

    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    if (lastThreeChars === "BTC") {
      const price = coin.last;
      const name = coin.instrument_id.substring(
        0,
        coin.instrument_id.length - 4
      );

      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantOkexCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantOkexCoins;
};

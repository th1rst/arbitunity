// Bitfinex API is very "special", so a lot of filtering has to be done
export const formatBitfinexData = (APIdata, topCryptoTickers) => {
  const relevantBitfinexCoins = [];

  APIdata.forEach((coin) => {
    // Bitfinex API puts a "t" in front of every trading pair,
    // so remove it from first position and "BTC" from the end
    const name = coin[0].substring(1, coin[0].length - 3);
    const price = coin[1];
    const lastThreeChars = coin[0].substring(coin[0].length - 3);

    // cancel out weird, unheard of trading pairs
    // with a ":" in between or "TEST" or
    // pairs that are not pairs (i.e. BTCBTC or fBTC)
    if (name.length === 4 || name.includes(":") || name.includes("TEST")) {
      return;
    }
    // check if it's a BTC trading pair (i.e. "ETH-BTC")
    else if (lastThreeChars === "BTC") {
      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantBitfinexCoins.push({
            name: name,
            price: price,
          });
        }
      });
    }
  });
  return relevantBitfinexCoins;
};

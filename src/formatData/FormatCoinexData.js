export const formatCoinexData = (APIdata, topCryptoTickers) => {
  const relevantCoinexCoins = [];
  const dataArray = Array.from(Object.entries(APIdata));

  dataArray.forEach((coin) => {
    const lastThreeChars = coin[0].substring(coin[0].length - 3);

    // check if it's a BTC trading pair
    if (lastThreeChars === "BTC") {
      //then remove "BTC_" from it to get the actual coin name
      const name = coin[0].substring(0, coin[0].length - 3);
      const price = coin[1].last;

      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (name === topCrypto) {
          //if it's in topX, push to array
          relevantCoinexCoins.push({ name: name, price: price });
        }
      });
    }
  });
  return relevantCoinexCoins;
};

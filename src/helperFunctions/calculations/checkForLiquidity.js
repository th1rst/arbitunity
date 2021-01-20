export const checkForLiquidity = (uniqueCoins) => {
    let liquidCoins = [];
    // check if there are less than two prices available
    // (need at least two for doing arbitrage)
    // if not, remove it from the array
    uniqueCoins.forEach((coin) => {
      if (coin.priceList.length >= 2) {
        liquidCoins.push(coin);
      }
    });
    return liquidCoins;
  };
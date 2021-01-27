// take raw data (APIdata), eliminate all non-BTC trading pairs,
// cross-check it against the topX (default: top500) cryptos (topCryptoTickers),
// return relevant trading pairs from ${exchangeName}

// of course every API is differently formatted,
// hence the different functions

// select function on switch/case at the bottom

export const formatExchangeData = (APIdata, topCryptoTickers, exchangeName) => {
  let formatted = [];

  const formatBinanceData = (APIdata, topCryptoTickers) => {
    const relevantBinanceCoins = [];

    APIdata.forEach((coin) => {
      const name = coin.symbol.substring(0, coin.symbol.length - 3);
      const price = coin.price;
      const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

      // check if it's a BTC trading pair (i.e. "ETH-BTC")
      if (lastThreeChars === "BTC") {
        //check if it's in the topX (default: top500)
        topCryptoTickers.forEach((topCrypto) => {
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantBinanceCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantBinanceCoins;
  };

  const formatBittrexData = (APIdata, topCryptoTickers) => {
    const relevantBittrexCoins = [];

    APIdata.forEach((coin) => {
      const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

      // check if it's a BTC trading pair (i.e. "ETH-BTC")
      if (lastThreeChars === "BTC") {
        // trading pairs are separated by dash, so remove 4 instead of 3
        const name = coin.symbol.substring(0, coin.symbol.length - 4);
        const price = coin.lastTradeRate;
        //check if it's in the topX (default: top500)
        topCryptoTickers.forEach((topCrypto) => {
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantBittrexCoins.push({
              name: name,
              price: price,
              id: topCrypto.id, // ID is getting used to fetch the image from CMC
            });
          }
        });
      }
    });
    formatted = relevantBittrexCoins;
  };

  // Bitfinex API is very "special", so a lot of filtering has to be done
  const formatBitfinexData = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantBitfinexCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantBitfinexCoins;
  };

  const formatCoinexData = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantCoinexCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantCoinexCoins;
  };

  const formatGateIOdata = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantGateIOcoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantGateIOcoins;
  };

  const formatHuobiData = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantHuobiCoins.push({
              name: name,
              price: medianPrice,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantHuobiCoins;
  };

  const formatPoloniexData = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantPoloniexCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantPoloniexCoins;
  };

  const formatOkexdata = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantOkexCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantOkexCoins;
  };

  const formatKucoinData = (APIdata, topCryptoTickers) => {
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
          if (name === topCrypto.symbol) {
            //if it's in topX, push to array
            relevantKucoinCoins.push({
              name: name,
              price: price,
              id: topCrypto.id,
            });
          }
        });
      }
    });
    formatted = relevantKucoinCoins;
  };

  switch (exchangeName) {
    case "Binance":
      formatBinanceData(APIdata, topCryptoTickers);
      break;
    case "Bittrex":
      formatBittrexData(APIdata, topCryptoTickers);
      break;
    case "Bitfinex":
      formatBitfinexData(APIdata, topCryptoTickers);
      break;
    case "Kucoin":
      formatKucoinData(APIdata, topCryptoTickers);
      break;
    case "Poloniex":
      formatPoloniexData(APIdata, topCryptoTickers);
      break;
    case "Huobi":
      formatHuobiData(APIdata, topCryptoTickers);
      break;
    case "GateIO":
      formatGateIOdata(APIdata, topCryptoTickers);
      break;
    case "OKex":
      formatOkexdata(APIdata, topCryptoTickers);
      break;
    case "CoinEx":
      formatCoinexData(APIdata, topCryptoTickers);
      break;
    default:
      break;
  }

  return formatted;
};

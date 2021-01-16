import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

//temporary import of CMC top500 to not hit API call limit      +++++++++++++++++++++++++++++++++++
import { topCryptosImport } from "./topCryptoTickers";

const App = () => {
  const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;

  const [topX, setTopX] = useState(500);

  //temp disabled to not make too many API calls            +++++++++++++++++++++++++++++++++++
  // const [topCryptoTickers, setTopCryptoTickers] = useState(topCryptosImport);       +++++++++++++++++++++++++++++++++++

  const topCryptoTickers = topCryptosImport;
  const [exchanges, setExchanges] = useState([
    { name: "Binance", enabled: true },
    { name: "Bittrex", enabled: true },
    { name: "Bitfinex", enabled: false },
    { name: "Kucoin", enabled: false },
  ]);
  const [binancePairs, setBinancePairs] = useState([]);
  const [bittrexPairs, setBittrexPairs] = useState([]);
  const [bitfinexPairs, setBitfinexPairs] = useState([]);
  const [kucoinPairs, setKucoinPairs] = useState([]);
  const [poloniexPairs, setPoloniexPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //getCMCdata();                 +++++++++++++++++++++++++++++++++++
    getExchangeData();
  }, []);

  //get the Top X (default: 500) cryptos from CoinMarketCap
  async function getCMCdata() {
    const queryString = `?start=1&limit=${topX}&convert=USD`;
    try {
      let res = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest" +
          queryString,
        {
          headers: {
            "X-CMC_PRO_API_KEY": `${CMC_API_KEY}`,
          },
        }
      );
      formatCMCData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const formatCMCData = (input) => {
    //declare empty array
    const coinSymbols = [];

    //get all the symbols (i.e. "BTC" for Bitcoin) and push to array
    input.data.map((coin) => coinSymbols.push(coin.symbol));

    //set array of symbols/tickers in state

    //temp disabled to not make too many API calls +++++++++++++++++++++++++++++++++++
    //setTopCryptoTickers(coinSymbols);             +++++++++++++++++++++++++++++++++++
  };

  const getExchangeData = () => {
    getBinanceData();
    getBittrexData();
    getBitfinexData();
    getKucoinData();
    getPoloniexData();
  };

  const getBinanceData = async () => {
    try {
      //gets EVERY trading pair and its price from Binance
      let res = await axios.get("https://www.binance.com/api/v3/ticker/price");
      formatBinanceData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatBinanceData = (input) => {
    const relevantBinanceCoins = [];

    input.forEach((coin) => {
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

    setBinancePairs(relevantBinanceCoins);
    setLoading(false);
  };

  const getBittrexData = async () => {
    try {
      //gets EVERY trading pair and its price from Bittrex
      let res = await axios.get("https://api.bittrex.com/v3/markets/tickers");
      formatBittrexData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatBittrexData = (input) => {
    const relevantBittrexCoins = [];

    input.forEach((coin) => {
      // Bittrex seperates trading pairs by dash, so remove it
      // then remove "BTC" from it to get the actual coin name
      const name = coin.symbol
        .split("-")
        .join("")
        .substring(0, coin.symbol.length - 4);
      const price = coin.lastTradeRate;
      const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

      // check if it's a BTC trading pair (i.e. "ETH-BTC")
      if (lastThreeChars === "BTC") {
        //check if it's in the topX (default: top500)
        topCryptoTickers.forEach((topCrypto) => {
          if (name === topCrypto) {
            //if it's in topX, push to array
            relevantBittrexCoins.push({ name: name, price: price });
          }
        });
      }
    });
    setBittrexPairs(relevantBittrexCoins);
    setLoading(false);
  };

  const getBitfinexData = async () => {
    try {
      //gets EVERY trading pair and its price from Bitfinex
      let res = await axios.get(
        "https://api-pub.bitfinex.com/v2/tickers?symbols=ALL"
      );
      formatBitfinexData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Bitfinex API is very "special", so a lot of filtering has to be done
  const formatBitfinexData = (input) => {
    const relevantBitfinexCoins = [];

    input.forEach((coin) => {
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
    setBitfinexPairs(relevantBitfinexCoins);
  };

  const getKucoinData = async () => {
    try {
      //gets EVERY trading pair and its price from KuCoin
      let res = await axios.get(
        "https://api.kucoin.com/api/v1/market/allTickers"
      );
      formatKucoinData(res.data.data.ticker);
    } catch (error) {
      console.log(error);
    }
  };

  const formatKucoinData = (input) => {
    const relevantKucoinCoins = [];

    input.forEach((coin) => {
      // Kucoin seperates trading pairs by dash, so remove it
      // then remove "BTC" from it to get the actual coin name
      const name = coin.symbol
        .split("-")
        .join("")
        .substring(0, coin.symbol.length - 4);
      const price = coin.averagePrice;
      const lastThreeChars = coin.symbol.substring(coin.symbol.length - 3);

      // check if it's a BTC trading pair (i.e. "ETH-BTC")
      if (lastThreeChars === "BTC") {
        //check if it's in the topX (default: top500)
        topCryptoTickers.forEach((topCrypto) => {
          if (name === topCrypto) {
            //if it's in topX, push to array
            relevantKucoinCoins.push({ name: name, price: price });
          }
        });
      }
    });
    setKucoinPairs(relevantKucoinCoins);
  };

  const getPoloniexData = async () => {
    try {
      //gets EVERY trading pair and its price from KuCoin
      let res = await axios.get(
        "https://poloniex.com/public?command=returnTicker"
      );
      formatPoloniexData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatPoloniexData = (input) => {
    const relevantPoloniexCoins = [];

    Object.entries(input).forEach((coin) => {
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
    setPoloniexPairs(relevantPoloniexCoins);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="my-4 text-2xl font-semibold uppercase">Arbitunity</h1>
        <div className="w-full flex flex-row justify-center">
          {loading ? <h1>LOADING!</h1> : <h1>API HAS RESPONDED!</h1>}
        </div>
        {loading ? (
          <h1>LOADING!</h1>
        ) : (
          <div className="flex flex-row space-around">
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{binancePairs.length} relevant Binance Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {binancePairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>

            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{bittrexPairs.length} relevant Bittrex Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {bittrexPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>

            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{bitfinexPairs.length} relevant Bitfinex Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {bitfinexPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{kucoinPairs.length} relevant Kucoin Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {kucoinPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{poloniexPairs.length} relevant Poloniex Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {poloniexPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;

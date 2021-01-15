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
    { name: "Coinbase", enabled: true },
    { name: "Bittrex", enabled: true },
    { name: "Bitfinex", enabled: false },
    { name: "KuCoin", enabled: false },
    { name: "Poloniex", enabled: false },
  ]);
  const [binancePairs, setBinancePairs] = useState([]);
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
    getCoinbaseData();
    getBittrexData();
  };

  async function getBinanceData() {
    try {
      //gets EVERY trading pair and its price from Binance
      let res = await axios.get("https://www.binance.com/api/v3/ticker/price");
      formatBinanceData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const formatBinanceData = (input) => {
    // since I only want BTC trading pairs, check if
    // last 3 characters of symbol match (i.e. "ETHBTC")
    const binanceBTCTradingPairs = [];
    const relevantBinancePairs = [];

    input.forEach((coin) => {
      if (coin.symbol.substring(coin.symbol.length - 3) === "BTC") {
        binanceBTCTradingPairs.push({ name: coin.symbol, price: coin.price });
      }
    });

    //then cross-check with the topX (or default: top500) coins from CMC
    binanceBTCTradingPairs.forEach((coin) => {
      //remove the "BTC" again from the Trading pair name to get the coin name
      const cointicker = coin.name.substring(0, coin.name.length - 3);

      //check if it's in the topX (default: top500)
      topCryptoTickers.forEach((topCrypto) => {
        if (cointicker === topCrypto) {
          //if it's in topX, push to array
          relevantBinancePairs.push({ name: topCrypto, price: coin.price });
        }
      });
    });
    setBinancePairs(relevantBinancePairs);
    setLoading(false);
  };

  const getCoinbaseData = () => {
    console.log("Getting Coinbase Data");
  };

  const getBittrexData = () => {
    console.log("Getting Bittrex Data");
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="my-4 text-2xl font-semibold uppercas">Arbitunity</h1>
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
                  <h3>{crypto.name}</h3>
                ))}
              </div>
            </div>

            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>XXX relevant Bittrex Pairs:</h1>
              </div>
              {/* BITTREX PAIRS */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;

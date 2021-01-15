import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;

  const [topX, setTopX] = useState(500);
  const [topCryptoTickers, setTopCryptoTickers] = useState([]);
  const [exchanges, setExchanges] = useState([
    { name: "Binance", enabled: true },
    { name: "Coinbase", enabled: true },
    { name: "Bittrex", enabled: true },
    { name: "Bitfinex", enabled: false },
    { name: "KuCoin", enabled: false },
    { name: "Poloniex", enabled: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCMCdata().then(() => getExchangeData());
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
    setTopCryptoTickers(coinSymbols);
    setLoading(false);
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

    input.forEach((coin) => {
      if (coin.symbol.substring(coin.symbol.length - 3) === "BTC") {
        binanceBTCTradingPairs.push({ name: coin.symbol, price: coin.price });
      }
    });

    console.log(binanceBTCTradingPairs);

    //then cross-check with the topX (or default: top500) coins from CMC
    binanceBTCTradingPairs.map((coin) => {
      //remove the "BTC" again from the Trading pair name to get the coin name
      const cointicker = coin.name.substring(0, coin.name.length - 3);

      //check if it's in the topX (default: top500)
      topCryptoTickers.map((topCrypto) => {
        if (cointicker === topCrypto) {
          console.log("Found top500 coin on Binance: " + topCrypto)
        }
      })
    });
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
        <h1 className="my-4">HELLO THERE!</h1>
        <div className="w-full flex flex-row justify-center">
          {loading ? <h1>LOADING!</h1> : <h1>API HAS RESPONDED!</h1>}
        </div>

        {topCryptoTickers.map((crypto) => (
          <h3>{crypto}</h3>
        ))}
      </div>
    </>
  );
};

export default App;

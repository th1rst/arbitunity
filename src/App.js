import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

//temporary import of CMC top500 to not hit API call limit      +++++++++++++++++++++++++++++++++++
import { topCryptosImport } from "./topCryptoTickers";

// formatting functions
import { formatPoloniexData } from "./formatData/FormatPoloniexData";
import { formatBinanceData } from "./formatData/FormatBinanceData";
import { formatBittrexData } from "./formatData/FormatBittrexData";
import { formatBitfinexData } from "./formatData/FormatBitfinexData";
import { formatKucoinData } from "./formatData/FormatKucoinData";
import { formatHuobiData } from "./formatData/FormatHuobiData";
import { formatGateIOdata } from "./formatData/FormatGateIOdata";
import { formatOkexdata } from "./formatData/FormatOkexData";
import { formatCoinexData } from "./formatData/FormatCoinexData";

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
  const [huobiPairs, setHuobiPairs] = useState([]);
  const [gateIOpairs, setGateIOpairs] = useState([]);
  const [okexPairs, setOkexPairs] = useState([]);
  const [coinexPairs, setCoinexPairs] = useState([]);
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
    getHuobiData();
    getGateIOdata();
    getOkexData();
    getCoinexData();
  };

  const getBinanceData = async () => {
    try {
      //gets EVERY trading pair and its price from Binance
      let res = await axios.get("https://www.binance.com/api/v3/ticker/price");
      setBinancePairs(formatBinanceData(res.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getBittrexData = async () => {
    try {
      //gets EVERY trading pair and its price from Bittrex
      let res = await axios.get("https://api.bittrex.com/v3/markets/tickers");
      setBittrexPairs(formatBittrexData(res.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getBitfinexData = async () => {
    try {
      //gets EVERY trading pair and its price from Bitfinex
      let res = await axios.get(
        "https://api-pub.bitfinex.com/v2/tickers?symbols=ALL"
      );
      setBitfinexPairs(formatBitfinexData(res.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getKucoinData = async () => {
    try {
      //gets EVERY trading pair and its price from KuCoin
      let res = await axios.get(
        "https://api.kucoin.com/api/v1/market/allTickers"
      );
      setKucoinPairs(formatKucoinData(res.data.data.ticker, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getPoloniexData = async () => {
    try {
      //gets EVERY trading pair and its price from Poloniex
      let res = await axios.get(
        "https://poloniex.com/public?command=returnTicker"
      );
      setPoloniexPairs(formatPoloniexData(res.data, topCryptosImport));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getHuobiData = async () => {
    try {
      //gets EVERY trading pair and its price from Huobi
      let res = await axios.get("https://api.huobi.pro/market/tickers");
      setHuobiPairs(formatHuobiData(res.data.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getGateIOdata = async () => {
    try {
      //gets EVERY trading pair and its price from Huobi
      let res = await axios.get("https://api.gateio.ws/api/v4/spot/tickers");
      setGateIOpairs(formatGateIOdata(res.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getOkexData = async () => {
    try {
      //gets EVERY trading pair and its price from OKex
      let res = await axios.get(
        "https://www.okex.com/api/spot/v3/instruments/ticker"
      );
      setOkexPairs(formatOkexdata(res.data, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
  };

  const getCoinexData = async () => {
    try {
      //gets EVERY trading pair and its price from CoinEx
      let res = await axios.get("https://api.coinex.com/v1/market/ticker/all");
      setCoinexPairs(formatCoinexData(res.data.data.ticker, topCryptosImport));
    } catch (error) {
      console.log(error);
    }
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
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{huobiPairs.length} relevant Huobi Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {huobiPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{gateIOpairs.length} relevant Gate.io Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {gateIOpairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{okexPairs.length} relevant OKex Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {okexPairs.map((crypto) => (
                  <h3>
                    {crypto.name}: {crypto.price}
                  </h3>
                ))}
              </div>
            </div>
            <div className="mx-4 border-2 border-blue-500">
              <div>
                <h1>{coinexPairs.length} relevant Coinex Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {coinexPairs.map((crypto) => (
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

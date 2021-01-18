import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { getExchangeData } from "./helperFunctions/APIcalls";

const App = () => {
  const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;

  const [topX, setTopX] = useState(500);

  //temp disabled to not make too many API calls            +++++++++++++++++++++++++++++++++++
  // const [topCryptoTickers, setTopCryptoTickers] = useState(topCryptosImport);       +++++++++++++++++++++++++++++++++++
  const exchangeList = [
    "Binance",
    "Bittrex",
    "Bitfinex",
    "Kucoin",
    "Poloniex",
    "Huobi",
    "GateIO",
    "OKex",
    "CoinEx",
  ];

  const [binancePairs, setBinancePairs] = useState([]);
  const [bittrexPairs, setBittrexPairs] = useState([]);
  const [bitfinexPairs, setBitfinexPairs] = useState([]);
  const [kucoinPairs, setKucoinPairs] = useState([]);
  const [poloniexPairs, setPoloniexPairs] = useState([]);
  const [huobiPairs, setHuobiPairs] = useState([]);
  const [gateIOPairs, setGateIOPairs] = useState([]);
  const [okexPairs, setOkexPairs] = useState([]);
  const [coinexPairs, setCoinexPairs] = useState([]);
  const [exchangePairs, setExchangePairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //getCMCdata();                 +++++++++++++++++++++++++++++++++++
    getAPIData();
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

  const getAPIData = async () => {
    exchangeList.forEach(async (exchange) => {
      // make API call for each exchange
      // incl. formatting and filtering (separate helperFunctions)
      const relevantData = await getExchangeData(exchange);
      console.log(relevantData);
    });
  };

  const calculateArbitrageOpportunities = () => {
    const allCoinsArray = [];

    binancePairs.forEach((coin) => {
      // map over already processed coins (allCoinsArray)
      // check if entry of said coin already exists
      const found = allCoinsArray.some((item) => item.name === coin.name);

      // if not found, push a new object (inluding coin name) to array
      if (!found) {
        allCoinsArray.push({
          name: coin.name,
          prices: [
            {
              exchange: "Binance",
              price: coin.price,
            },
          ],
        });
      }
      // if found, update only the price (add to price list)
      // at the given index
      else {
        const index = allCoinsArray
          .map((element) => element.name)
          .indexOf(coin.name);

        allCoinsArray[index].prices.push({
          exchange: "Binance",
          price: coin.price,
        });
      }
    });

    bittrexPairs.forEach((coin) => {
      // map over already processed coins
      // check if entry of said coin already exists
      const found = allCoinsArray.some((item) => item.name === coin.name);

      // if not found, push a new object (inluding coin name) to array
      if (!found) {
        allCoinsArray.push({
          name: coin.name,
          prices: [
            {
              exchange: "Bittrex",
              price: coin.price,
            },
          ],
        });
      }
      // if found, update only the price (add to price list)
      // at the given index
      else {
        const index = allCoinsArray
          .map((element) => element.name)
          .indexOf(coin.name);

        allCoinsArray[index].prices.push({
          exchange: "Bittrex",
          price: coin.price,
        });
      }
    });

    bitfinexPairs.forEach((coin) => {
      // map over already processed coins
      // check if entry of said coin already exists
      const found = allCoinsArray.some((item) => item.name === coin.name);

      // if not found, push a new object (inluding coin name) to array
      if (!found) {
        allCoinsArray.push({
          name: coin.name,
          prices: [
            {
              exchange: "Bitfinex",
              price: coin.price,
            },
          ],
        });
      }
      // if found, update only the price (add to price list)
      // at the given index
      else {
        const index = allCoinsArray
          .map((element) => element.name)
          .indexOf(coin.name);

        allCoinsArray[index].prices.push({
          exchange: "Bitfinex",
          price: coin.price,
        });
      }
    });

    kucoinPairs.forEach((coin) => {
      // map over already processed coins
      // check if entry of said coin already exists
      const found = allCoinsArray.some((item) => item.name === coin.name);

      // if not found, push a new object (inluding coin name) to array
      if (!found) {
        allCoinsArray.push({
          name: coin.name,
          prices: [
            {
              exchange: "Kucoin",
              price: coin.price,
            },
          ],
        });
      }
      // if found, update only the price (add to price list)
      // at the given index
      else {
        const index = allCoinsArray
          .map((element) => element.name)
          .indexOf(coin.name);

        allCoinsArray[index].prices.push({
          exchange: "Kucoin",
          price: coin.price,
        });
      }
    });
    console.log(allCoinsArray);
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
                <h1>{gateIOPairs.length} relevant Gate.io Pairs:</h1>
              </div>
              <div className="flex flex-col items-center">
                {gateIOPairs.map((crypto) => (
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

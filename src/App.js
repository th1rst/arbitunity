import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { getExchangeData } from "./helperFunctions/APIcalls";

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

const App = () => {
  const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;

  //temp disabled to not make too many API calls            +++++++++++++++++++++++++++++++++++
  // const [topCryptoTickers, setTopCryptoTickers] = useState(topCryptosImport);       +++++++++++++++++++++++++++++++++++

  const [topX, setTopX] = useState(500);
  const [rawData, setRawData] = useState([]);
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
    const exchangeData = [];

    exchangeList.map(async (exchange) => {
      // make API call for each exchange
      // incl. formatting and filtering (separate helperFunctions)
      const pairs = await getExchangeData(exchange);
      // push everything to array
      exchangeData.push({
        name: exchange,
        pairs,
      });
    });
    // set in state when .map is done (for optional displaying the raw data)
    setRawData(exchangeData);
    //
    getUniqueCoinsAndPrices(rawData);
  };

  const getUniqueCoinsAndPrices = (dataset) => {
    const uniqueCoinsAndPrices = [];

    // iterate over every exchange
    dataset.forEach((exchange) => {
      // then iterate over every coin
      exchange.pairs.forEach((coin) => {
        // map over already processed coins (uniqueCoinsAndPrices)
        // check if entry of said coin already exists
        const found = uniqueCoinsAndPrices.some(
          (item) => item.name === coin.name
        );

        // if not found, push a new object (inluding coin name) to array
        if (!found) {
          uniqueCoinsAndPrices.push({
            name: coin.name,
            prices: [
              {
                exchange: `${exchange.name}`,
                price: coin.price,
              },
            ],
          });
        }

        // if found -> check at which index,
        // update only the price (add price @ ExchangeXYZ to list)
        else {
          const index = uniqueCoinsAndPrices
            .map((element) => element.name)
            .indexOf(coin.name);

          uniqueCoinsAndPrices[index].prices.push({
            exchange: `${exchange.name}`,
            price: coin.price,
          });
        }
      });
    });

    checkForLiquidity(uniqueCoinsAndPrices)
  };

  const checkForLiquidity = () => {
    // check if there are less than two prices available
    // (need at least two for doing arbitrage)
    // if not, remove it from the array

  }

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
          <div className="flex flex-row space-around"></div>
        )}
      </div>
    </>
  );
};

export default App;

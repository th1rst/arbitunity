import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// helper functions
import { getExchangeData } from "./helperFunctions/APIcalls";
import { checkForLiquidity } from "./helperFunctions/calculations/checkForLiquidity";
import { getUniqueCoinsAndPrices } from "./helperFunctions/calculations/getUniqueCoinsAndPrices";
import { calculateArbitrageOpportunities } from "./helperFunctions/calculations/calculateArbitrageOpportunities";

// components
import { LoadingPage } from "./Components/LoadingPage";

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
  const [ready, setReady] = useState(false);
  const [loadedList, setLoadedList] = useState(
    { Binance: { loaded: false } },
    { Bittrex: { loaded: false } },
    { Bitfinex: { loaded: false } },
    { Kucoin: { loaded: false } },
    { Poloniex: { loaded: false } },
    { Huobi: { loaded: false } },
    { GateIO: { loaded: false } },
    { OKex: { loaded: false } },
    { CoinEx: { loaded: false } }
  );

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
    const coinSymbols = [];

    //get all the tickers (i.e. "BTC, ETH, XMR" ) and push to array
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
      // set loaded flag on every iteration and re-render (wanted behavior!)
      // set checkmark on <LoadingPage /> for every API that has responed incl. ping
      setLoadedList((prevState) => {
        return {
          ...prevState,
          [exchange]: { loaded: true },
        };
      });
    });

    setRawData(exchangeData); // set in state for optional display of raw data
    sortAndCalculate(rawData); // sort and calculate
  };

  const sortAndCalculate = () => {
    const uniques = getUniqueCoinsAndPrices(rawData);
    const liquidUniques = checkForLiquidity(uniques);
    const result = calculateArbitrageOpportunities(liquidUniques);
    console.log(result);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-row justify-center">
          <h1 className="my-4 text-3xl font-semibold uppercase">
            Ar<span className="text-4xl text-yellow-500">₿</span>itunity
          </h1>
        </div>

        <div className="w-full flex flex-row justify-center">
          {!ready ? (
            <LoadingPage exchangeList={exchangeList} loadedList={loadedList} />
          ) : (
            <h1>API HAS RESPONDED!</h1>
          )}
        </div>
        {!ready ? (
          <h1>LOADING!</h1>
        ) : (
          <div className="flex flex-row space-around"></div>
        )}
      </div>
    </>
  );
};

export default App;

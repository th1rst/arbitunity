import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Skeleton from "@material-ui/lab/Skeleton";
import Slider from "@material-ui/core/Slider";
// helper functions
import { getExchangeData } from "./helperFunctions/APIcalls";
import { checkForLiquidity } from "./helperFunctions/calculations/checkForLiquidity";
import { getUniqueCoinsAndPrices } from "./helperFunctions/calculations/getUniqueCoinsAndPrices";
import { calculateArbitrageOpportunities } from "./helperFunctions/calculations/calculateArbitrageOpportunities";
import { getExchangeURL } from "./helperFunctions/getExchangeURL";

// components
import { LoadingModal } from "./Components/LoadingModal";

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
  const [arbitragePairs, setArbitragePairs] = useState([]);
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
    getAPIData().then(() => {
      sortAndCalculate(rawData); // sort and calculate
    });
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
      // set loaded flag on every iteration and re-render (wanted behavior! user will
      // see when each exchange loaded and how long it took for it to respond on <LoadingPage />)
      setLoadedList((prevState) => {
        return {
          ...prevState,
          [exchange]: { loaded: true, responseTime: pairs.responseTime },
        };
      });
    });
    setRawData(exchangeData); // set in state for optional display of raw data
  };

  const sortAndCalculate = () => {
    const uniques = getUniqueCoinsAndPrices(rawData);
    const liquidUniques = checkForLiquidity(uniques);
    const result = calculateArbitrageOpportunities(liquidUniques);
    setArbitragePairs(result);
  };

  function displayTopCryptoLimit(value) {
    return `${value}`;
  }

  const handleSliderChange = (event, newValue) => {
    setTopX(newValue);
  };

  return (
    <>
      <LoadingModal exchangeList={exchangeList} loadedList={loadedList} />
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-row justify-center">
          <h1 className="my-4 text-4xl font-semibold uppercase">
            Ar<span className="text-5xl text-yellow-500">₿</span>itunity
          </h1>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <h1 className="font-semibold mb-8">
            Filter Top {`${topX}`} Cryptos from CoinMarketCap
          </h1>
          <Slider
            width="50%"
            defaultValue={topX}
            onChange={handleSliderChange}
            getAriaValueText={displayTopCryptoLimit}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            min={10}
            max={1000}
          />
        </div>
        <div className="w-full my-4 flex flex-row justify-around border-b">
          <p>Buy:</p>
          <p>Percentage gain:</p>
          <p>Sell:</p>
        </div>
        {arbitragePairs.map((pair) => (
          <>
            <div className="w-full my-4 flex flex-row justify-evenly">
              <div className="w-1/5 p-8 border-2 border-gray-300 rounded-xl bg-green-300 shadow-xl">
                <p className="text-4xl mb-2 font-bold text-green-800">
                  {pair.name}
                </p>
                <div className="flex flex-row justify-between">
                  Buy price:
                  <span className="font-semibold">
                    {pair.lowPrice.toFixed(8)}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  from:
                  <span className="font-semibold">{pair.buyExchange} </span>
                </div>
                <a
                  className="mt-2 text-center underline"
                  href={`${getExchangeURL(pair.name, pair.buyExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {pair.buyExchange}
                </a>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className="text-xl font-semibold">
                  + {pair.percentageGain}%
                </p>
              </div>

              <div className="w-1/5 p-8 border-2 border-gray-300 rounded-xl bg-red-300 shadow-xl">
                <p className="text-4xl mb-2 font-bold text-red-800">
                  {pair.name}
                </p>
                <div className="flex flex-row justify-between">
                  Sell price:
                  <span className="font-semibold">
                    {pair.highPrice.toFixed(8)}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  At:
                  <span className="font-semibold">{pair.sellExchange} </span>
                </div>
                <a
                  className="mt-2 text-center underline"
                  href={`${getExchangeURL(pair.name, pair.sellExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {pair.sellExchange}
                </a>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default App;

/*
 <Skeleton variant="text" className="m-2" width="50%" height={30} />
            <Skeleton variant="rect" className="m-2" width="50%" height={150} />
*/

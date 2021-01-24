import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Skeleton from "@material-ui/lab/Skeleton";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";

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

  const [topX, setTopX] = useState(500);
  const [topCryptoTickers, setTopCryptoTickers] = useState([]);
  const [minGain, setMinGain] = useState(5);
  const [maxGain, setMaxGain] = useState(50);
  const [gainTip, setGainTip] = useState(false);
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
    getCMCdata();
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
    setTopCryptoTickers(coinSymbols);
  };

  const getAPIData = async () => {
    const exchangeData = [];

    exchangeList.map(async (exchange) => {
      // make API call for each exchange
      // incl. formatting and filtering (separate helperFunctions)
      const pairs = await getExchangeData(exchange, topCryptoTickers);
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
    const result = calculateArbitrageOpportunities(
      liquidUniques,
      minGain,
      maxGain
    );
    setArbitragePairs(result);
  };

  const displayTopCryptoLimit = (value) => {
    return `${value}`;
  };

  const displayMinGain = (value) => {
    return `${value}`;
  };

  const displayMaxGain = (value) => {
    return `${value}`;
  };

  return (
    <>
      <LoadingModal exchangeList={exchangeList} loadedList={loadedList} />
      <div>
        <div className="py-2 w-full shadow-xl border-b text-center">
          <h1 className="text-4xl font-semibold uppercase">
            Ar<span className="text-5xl text-yellow-500">₿</span>itunity
          </h1>
          <h2 className="font-semibold">a Crptocurrency arbitrage calulator</h2>
        </div>

        <div className="mt-4 flex flex-row justify-around text-center">
          <div className="w-1/4">
            <h1 className="mb-8">
              Filter Top <span className="font-bold">{`${topX}`}</span> Cryptos
              from CoinMarketCap
            </h1>
            <Slider
              width="50%"
              defaultValue={topX}
              onChange={(event, newValue) => {
                setTopX(newValue);
              }}
              getAriaValueText={displayTopCryptoLimit}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={10}
              min={10}
              max={1000}
            />
          </div>
          <div className="w-1/4">
            <h1 className="mb-8">Minimum gain: {minGain}%</h1>
            <Slider
              width="50%"
              defaultValue={minGain}
              onChange={(event, newValue) => {
                setMinGain(newValue);
                setGainTip(true);
              }}
              getAriaValueText={displayMinGain}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              min={5}
              max={50}
            />
          </div>
          <div className="w-1/4">
            <h1 className="mb-8">Maximum gain: {maxGain}%</h1>
            <Slider
              width="50%"
              defaultValue={maxGain}
              onChange={(event, newValue) => {
                setMaxGain(newValue);
                setGainTip(true);
              }}
              getAriaValueText={displayMaxGain}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              min={10}
              max={500}
            />
          </div>
        </div>
        {gainTip ? (
          <div className="w-full text-center">
            <div className="mt-6 mb-8 mx-auto w-1/2 text-justify italic">
              <b>Note:</b>
              <br />
              Absurdly high potential gains are usually because of delisting,
              maintenance or no/low volume on the respective exchange.
              Generally, this is expected since most API's also output delisted
              coins - but this results in dead links and, quite frankly, a waste
              of time. Best results are achieved when staying in a reasonable
              range, i.e. between 5 and 50 percent.
            </div>
            <div className="mb-8">
              <Button variant="contained" color="primary" onClick={sortAndCalculate}>
                Update
              </Button>
            </div>
          </div>
        ) : null}

        <div className="w-full my-4 text-2xl font-bold flex flex-row justify-evenly border-b">
          <p className="mb-2 ">Buy:</p>
          <p className="mb-2">Percentage gain:</p>
          <p className="mb-2">Sell:</p>
        </div>
        {arbitragePairs.map((pair) => (
          <>
            <div className="w-full my-4 flex flex-row justify-evenly items-center">
              <div className="w-1/5 px-8 py-4 border-2 border-gray-300 rounded-xl bg-green-300 shadow-xl">
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-green-800 flex flex-col items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {pair.name[0]}
                    </span>
                  </div>
                  <p className="text-4xl mb-2 font-bold text-green-800">
                    {pair.name}
                  </p>
                </div>

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
                <div className="flex flex-row justify-center">
                  <a
                    className="mt-2 text-center text-blue-600 underline"
                    href={`${getExchangeURL(pair.name, pair.buyExchange)}`}
                    target="_blank noopener noreferrer"
                  >
                    view on {pair.buyExchange}
                  </a>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center">
                <p className="text-xl font-semibold">
                  + {pair.percentageGain}%
                </p>
              </div>

              <div className="w-1/5 px-8 py-4 border-2 border-gray-300 rounded-xl bg-red-300 shadow-xl">
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-red-800 flex flex-col items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {pair.name[0]}
                    </span>
                  </div>
                  <p className="text-4xl mb-2 font-bold text-red-800">
                    {pair.name}
                  </p>
                </div>
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
                <div className="flex flex-row justify-center">
                  <a
                    className="mt-2 text-center text-blue-600 underline"
                    href={`${getExchangeURL(pair.name, pair.sellExchange)}`}
                    target="_blank noopener noreferrer"
                  >
                    view on {pair.sellExchange}
                  </a>
                </div>
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

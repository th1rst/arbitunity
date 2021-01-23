import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// helper functions
import { getExchangeData } from "./helperFunctions/APIcalls";
import { checkForLiquidity } from "./helperFunctions/calculations/checkForLiquidity";
import { getUniqueCoinsAndPrices } from "./helperFunctions/calculations/getUniqueCoinsAndPrices";
import { calculateArbitrageOpportunities } from "./helperFunctions/calculations/calculateArbitrageOpportunities";

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

  return (
    <>
      <LoadingModal exchangeList={exchangeList} loadedList={loadedList} />
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-row justify-center">
          <h1 className="my-4 text-3xl font-semibold uppercase">
            Ar<span className="text-4xl text-yellow-500">₿</span>itunity
          </h1>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          {arbitragePairs.map((pair) => (
            <div className="m-4">
              <p>Coin: {pair.name}</p>
              <p>
                buy @ {pair.lowPrice} from {pair.buyExchange}
              </p>
              <p>
                sell @ {pair.highPrice} from {pair.sellExchange}
              </p>
              <p>Possible percentage gain: {pair.percentageGain}%</p>
            </div>
          ))}
        </div>

        <div className="flex flex-row space-around"></div>
      </div>
    </>
  );
};

export default App;

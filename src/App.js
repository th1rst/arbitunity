import React, { useState, useEffect } from "react";

// MaterialUI
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";
import Skeleton from "@material-ui/lab/Skeleton";

// functions
import { getCoinmarketcapData } from "./functions/API Calls/getCoinmarketcapData";
import { getExchangeData } from "./functions/API Calls/getExchangeData";
import { checkForLiquidity } from "./functions/calculations/checkForLiquidity";
import { getUniqueCoinsAndPrices } from "./functions/calculations/getUniqueCoinsAndPrices";
import { calculateArbitrageOpportunities } from "./functions/calculations/calculateArbitrageOpportunities";

// components
import { LoadingModal } from "./Components/LoadingModal";
import { ArbitrageCoinRow } from "./Components/ArbitrageCoinRow";
import { SkeletonRow } from "./Components/SkeletonRow";

// data
import { defaultLoadedList } from "./data/defaultLoadedList";
import { exchangeList } from "./data/exchangeList";
import { topCryptosImport } from "./topCryptoTickers";

const App = () => {
  const [topX, setTopX] = useState(500);
  const [topCryptoTickers, setTopCryptoTickers] = useState([]);
  const [minGain, setMinGain] = useState(5);
  const [maxGain, setMaxGain] = useState(25);
  const [gainTip, setGainTip] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [arbitragePairs, setArbitragePairs] = useState([]);
  const [loadedList, setLoadedList] = useState(defaultLoadedList);
  const exchangeListLength = exchangeList.length;
  const loadedListLength = Object.entries(loadedList).length;

  useEffect(() => {
    // first, get Top X (default: top500) Cryptos from CoinmarketCap,
    // then, pass on the topX to Exchange API calls (for cross-checking)
    const getData = async () => {
      await getCoinmarketcapData(topX).then((res) => {
        getDataFromExchanges(res);
        setTopCryptoTickers(res);
      });
    };
    getData();
  }, []);

  const getDataFromExchanges = async (topCryptos) => {
    const exchangeData = [];

    // make API call for each exchange
    // incl. formatting and filtering
    // on "getExchangeData" (separate helperFunctions)
    const promiseListData = exchangeList.map(async (exchange) => {
      const pairs = await getExchangeData(exchange, topCryptos);

      // Set loaded flag on every iteration and re-render.
      // This is wanted behavior! User will see when each
      // exchange loaded and how long it took for it to
      // respond on <LoadingPage /> Component
      setLoadedList((prevState) => {
        return {
          ...prevState,
          [exchange]: { loaded: true, responseTime: pairs.responseTime },
        };
      });
      return { name: exchange, pairs };
    });

    // wait for everything to resolve
    await Promise.all(promiseListData).then((resolveData) => {
      resolveData.map((exchangeObject) => exchangeData.push(exchangeObject));
    });
    setRawData(exchangeData); // set in state for optional display of raw data
    sortAndCalculate(exchangeData); // pass on for calculations and final render
  };

  const sortAndCalculate = (data) => {
    const uniques = getUniqueCoinsAndPrices(data);
    const liquidUniques = checkForLiquidity(uniques);
    const result = calculateArbitrageOpportunities(
      liquidUniques,
      minGain,
      maxGain
    );
    // final render pairs that get mapped over and displayed
    setArbitragePairs(result);
  };

  const updateUI = async () => {
    // if user input is more than data available,
    // make new API call to get more data
    if (topX !== topCryptoTickers.length) {
      setLoadedList(defaultLoadedList);

      await getCoinmarketcapData(topX).then((res) => {
        getDataFromExchanges(res);
        setTopCryptoTickers(res);
      });
    } else {
      // if not, just re-sort
      sortAndCalculate(rawData);
    }
  };

  return (
    <div style={{ backgroundColor: "#19354a" }} className="border-b">
      <div className="py-2 w-full shadow-xl border-b text-center bg-gray-100">
        <h1 className="text-4xl font-semibold uppercase">
          Ar<span className="text-5xl text-yellow-500">₿</span>itunity
        </h1>
        <h2 className="font-semibold">a Crptocurrency arbitrage calculator</h2>
      </div>

      <div className="w-full mt-8 flex flex-row justify-content text-white">
        <div className="mx-auto">
          <h1 className="mb-8">
            Filter Top <span className="font-bold">{`${topX}`}</span> Cryptos
            from CoinMarketCap
          </h1>
          <Slider
            defaultValue={topX}
            onChange={(event, newValue) => {
              setTopX(newValue);
            }}
            getAriaValueText={(value) => `${value}`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            min={10}
            max={1000}
          />
        </div>
      </div>
      <div className="mt-8 flex flex-row justify-center text-white">
        <div className="mx-12 min-w-1/4">
          <h1 className="mb-8">Minimum gain: {minGain}%</h1>
          <Slider
            width="50%"
            defaultValue={minGain}
            onChange={(event, newValue) => {
              setMinGain(newValue);
              setGainTip(true);
            }}
            getAriaValueText={(value) => `${value}`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={5}
            max={50}
          />
        </div>
        <div className="mx-12 min-w-1/4 text-white">
          <h1 className="mb-8">Maximum gain: {maxGain}%</h1>
          <Slider
            width="50%"
            defaultValue={maxGain}
            onChange={(event, newValue) => {
              setMaxGain(newValue);
              setGainTip(true);
            }}
            getAriaValueText={(value) => `${value}`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={10}
            max={500}
          />
        </div>
      </div>

      {gainTip ? (
        <Grow in={gainTip}>
          <div className="w-full text-center">
            <div className="mt-6 mb-8 mx-auto w-3/4 md:w-1/2 text-justify italic text-white">
              <b>Note:</b>
              <br />
              Absurdly high potential gains are usually because of delisting,
              maintenance or no/low volume on the respective exchange.
              Generally, this is expected since most API's also output delisted
              coins - but this results in dead links and, quite frankly, a waste
              of time. Best results are achieved when staying within a
              reasonable range, i.e. between 5 and 25 percent.
            </div>
          </div>
        </Grow>
      ) : null}
      <div className="mt-4 mb-8 text-center">
        <Button variant="contained" color="primary" onClick={updateUI}>
          {gainTip ? "To the moon!" : "Update"}
        </Button>
      </div>

      <div className="hidden lg:flex w-full my-4 text-2xl font-bold flex-row justify-evenly border-b text-white">
        <p className="mb-2">Buy:</p>
        <p className="mb-2">Percentage gain:</p>
        <p className="mb-2">Sell:</p>
      </div>
      {loadedListLength < exchangeListLength ? (
        <>
          <div className="hidden lg:block">
            <LoadingModal exchangeList={exchangeList} loadedList={loadedList} />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
          <div className="w-full h-screen block lg:hidden">
            <Skeleton className="mx-12 my-8" variant="rect" height={400} />
            <Skeleton className="mx-12 my-8" variant="rect" height={400} />
          </div>
        </>
      ) : (
        arbitragePairs.map((pair, index) => (
          <>
            <ArbitrageCoinRow
              loaded={loadedListLength === exchangeListLength}
              id={pair.id}
              index={index}
              name={pair.name}
              lowPrice={pair.lowPrice.toFixed(8)}
              buyExchange={pair.buyExchange}
              percentageGain={pair.percentageGain}
              highPrice={pair.highPrice.toFixed(8)}
              sellExchange={pair.sellExchange}
            />
          </>
        ))
      )}
    </div>
  );
};

export default App;

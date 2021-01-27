import React from "react";
import Slide from "@material-ui/core/Slide";
import { getExchangeURL } from "../functions/API Calls/getExchangeURL";

export const ArbitrageCoinRow = (props) => {
  const {
    loaded,
    firstLetter,
    name,
    lowPrice,
    buyExchange,
    percentageGain,
    highPrice,
    sellExchange,
  } = props;

  return (
    <div className="w-full my-8 flex flex-row justify-evenly items-center">
      {/* ---------- BUY CARD ---------- */}
      <Slide direction="right" in={loaded} mountOnEnter unmountOnExit>
        <div className="w-1/5 px-8 py-4 border-2 border-gray-300 rounded-xl bg-green-400 shadow-xl">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-green-800 flex flex-col items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {firstLetter}
              </span>
            </div>
            <p className="text-4xl mb-2 font-bold text-green-800">{name}</p>
          </div>

          <div className="flex flex-row justify-between">
            Buy price:
            <span className="font-semibold">{lowPrice}</span>
          </div>
          <div className="flex flex-row justify-between">
            from:
            <span className="font-semibold">{buyExchange} </span>
          </div>
          <div className="flex flex-row justify-center">
            <a
              className="mt-2 text-center text-blue-600 underline"
              href={`${getExchangeURL(name, buyExchange)}`}
              target="_blank noopener noreferrer"
            >
              view on {buyExchange}
            </a>
          </div>
        </div>
      </Slide>

      {/* ---------- PERCENTAGE GAIN ---------- */}
      <div className="flex flex-row justify-center items-center">
        <Slide direction="up" in={loaded} mountOnEnter unmountOnExit>
          <p className="text-xl font-semibold">+ {percentageGain}%</p>
        </Slide>
      </div>

      {/* ---------- SELL CARD ---------- */}
      <Slide direction="left" in={loaded} mountOnEnter unmountOnExit>
        <div className="w-1/5 px-8 py-4 border-2 border-gray-300 rounded-xl bg-red-400 shadow-xl">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-red-800 flex flex-col items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {firstLetter}
              </span>
            </div>
            <p className="text-4xl mb-2 font-bold text-red-800">{name}</p>
          </div>
          <div className="flex flex-row justify-between">
            Sell price:
            <span className="font-semibold">{highPrice}</span>
          </div>
          <div className="flex flex-row justify-between">
            At:
            <span className="font-semibold">{sellExchange}</span>
          </div>
          <div className="flex flex-row justify-center">
            <a
              className="mt-2 text-center text-blue-600 underline"
              href={`${getExchangeURL(name, sellExchange)}`}
              target="_blank noopener noreferrer"
            >
              view on {sellExchange}
            </a>
          </div>
        </div>
      </Slide>
    </div>
  );
};

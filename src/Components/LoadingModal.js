/* 
  this entire Component isn't really necessary but while coding, 
  I saw that some exchanges (depending on peak hour load) take up to 
  3000ms to respond. 
  Since API load times are out of my control, I wanted to implement 
  a feature that lets the user know why he has to wait.
*/

import React from "react";
import { CircularProgress } from "@material-ui/core";
import DnsIcon from "@material-ui/icons/Dns";
import { checkResponseTime } from "../functions/calculations/loadingPage/checkResponseTime";
import { checkIfLoaded } from "../functions/calculations/loadingPage/checkIfLoaded";

export const LoadingModal = (props) => {
  const exchangeListLength = props.exchangeList.length;
  const loadedListLength = Object.entries(props.loadedList).length;

  if (loadedListLength < exchangeListLength) {
    return (
      <div
        className="absolute z-50 top-0 w-screen h-screen"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <div className="w-full h-full flex flex-row items-center justify-center">
          <div className="w-full mx-4 lg:w-1/2 flex flex-col items-center border-2 border-gray-400 rounded-lg shadow-xl bg-white">
            <div className="flex flex-row justify-center items-center">
              <DnsIcon className="mx-4 text-green-500" />
              <h1 className="py-4 text-2xl text-center font-semibold">
                Getting Exchange Data...
              </h1>
            </div>

            <div className="p-2 border-t w-full flex flex-col items-center">
              {props.exchangeList.map((exchange) => (
                <>
                  <div className="flex flex-row items-center text-left">
                    <h1 className="m-2">Getting {exchange} data...</h1>
                    {checkIfLoaded(exchange, props.loadedList) ? (
                      <>
                        <span className="text-2xl text-green-600">✓</span>
                        <span className="text-xs">
                          ({checkResponseTime(exchange, props.loadedList)} ms)
                        </span>
                      </>
                    ) : (
                      <CircularProgress size={16} />
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

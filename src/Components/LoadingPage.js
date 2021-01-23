/* 
  this entire Component isn't really necessary but while coding, 
  I saw that some exchanges (depending on peak hour load) take up to 
  3000ms to respond. 
  Since API load times are out of my control, I wanted to implement 
  a feature that lets the user know why he has to wait.
*/

import React from "react";
import { CircularProgress } from "@material-ui/core";
import { checkResponseTime } from "../helperFunctions/calculations/loadingPage/checkResponseTime";
import { checkIfLoaded } from "../helperFunctions/calculations/loadingPage/checkIfLoaded";

export const LoadingPage = (props) => {
  return (
    <div className="absolute top-0 w-screen h-screen">
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="w-1/2 flex flex-col items-center border-2 border-blue-500">
          <div className="p-8 flex flex-row justify-center items-center"></div>
          <div className="flex flex-row justify-center items-center">
            <h1 className="text-2xl font-semibold">Getting Exchange Data</h1>
          </div>
          <div className="w-full flex flex-col items-center border-2 border-red-500">
            {props.exchangeList.map((exchange) => (
              <>
                <div className="flex flex-row items-center justify-evenly">
                  <h1 className="m-2">Getting {exchange} data...</h1>
                  {checkIfLoaded(exchange, props.loadedList) ? (
                    <>
                      <span className="text-2xl text-green-600">✓</span>
                      <span className="text-xs">
                        ({checkResponseTime(exchange, props.loadedList)} ms)
                      </span>
                    </>
                  ) : (
                    <CircularProgress size={12} />
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

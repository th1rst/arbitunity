import React from "react";
import { CircularProgress } from "@material-ui/core";

export const LoadingPage = (props) => {
  return (
    <div className="absolute top-0 w-screen h-screen">
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="w-1/2 flex flex-col items-center border-2 border-blue-500">
          <div className="p-8 flex flex-row justify-center items-center">
            <CircularProgress size={64} />
          </div>
          <div className="flex flex-row justify-center items-center">
            <h1 className="text-2xl text-blue-800 uppercase font-semibold">
              {console.log(props.loadedList)}
              Getting Exchange Data
            </h1>
          </div>
          <div className="w-full flex flex-col items-center border-2 border-red-500">
            {props.exchangeList.map((exchange) => (
              <>
                <h1 className="my-2">Getting {exchange} data... </h1>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

export const SkeletonRow = () => {
  return (
    <div className="w-full my-8 flex flex-row justify-evenly items-center">
      <Skeleton variant="rect" className="w-1/5 mx-12" height={190} />
      <Skeleton variant="text" className="m-2" width="5%" height={30} />
      <Skeleton variant="rect" className="w-1/5 mx-12" height={190} />
    </div>
  );
};

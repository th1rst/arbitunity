export const calculatePercentageGain = (lowerNum, higherNum) => {
    // calculate potential percentage gain by buying low, selling high
    const percentageDiff = Math.round(
      ((higherNum - lowerNum) / lowerNum) * 100
    );
    return percentageDiff;
  };
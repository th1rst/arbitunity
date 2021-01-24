export const filterOutMismatches = (gain, minGain, maxGain) => {
  // filters out small gains or extremely large gains up to infinity
  // (happens when coin is at price 0 on exchangeA (delisting, no volume)
  // and any price at exchange B)
  if (gain <= minGain || gain >= maxGain || gain === Infinity) {
    return;
  } else {
    return true;
  }
};

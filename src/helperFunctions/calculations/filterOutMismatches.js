export const filterOutMismatches = (gain) => {
    // filters out small gains or extremely large gains up to infinity
    // (happens when coin is at price 0 on exchangeA (delisting, no volume) 
    // and any price at exchange B)
    if (gain <= 15 || gain >= 350 || gain === Infinity) {
      return;
    } else {
      return true
    }
  };

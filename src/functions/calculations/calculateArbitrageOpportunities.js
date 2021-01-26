import { filterOutMismatches } from "./filterOutMismatches";
import { calculatePercentageGain } from "./calculatePercentageGain";

export const calculateArbitrageOpportunities = (data, minGain, maxGain) => {
  const finalArray = [];
  // iterate over every coin
  data.forEach((coin) => {
    // then iterate over price list of coin and sort from low to high
    let sortedArray = coin.priceList.sort((a, b) => a.price - b.price);

    // get cheapest + highest price and their respective exchanges
    const lowest = {
      price: parseFloat(sortedArray[0].price),
      exchange: sortedArray[0].exchange,
    };
    const highest = {
      price: parseFloat(sortedArray[sortedArray.length - 1].price),
      exchange: sortedArray[sortedArray.length - 1].exchange,
    };

    // create temporary final object that needs to pass filter function below
    const tempCoin = {
      name: coin.name,
      lowPrice: lowest.price,
      highPrice: highest.price,
      percentageGain: calculatePercentageGain(lowest.price, highest.price),
      buyExchange: lowest.exchange,
      sellExchange: highest.exchange,
    };

    // filter out mismatches (unrealistic gains mostly resulting by
    // delisting or having low or no trading volume at all)
    if (filterOutMismatches(tempCoin.percentageGain, minGain, maxGain)) {
      finalArray.push(tempCoin);
    } else {
      return;
    }
  });

  // sort array from highest percentage gain to lowest
  finalArray.sort((a, b) => b.percentageGain - a.percentageGain);

  return finalArray;
};

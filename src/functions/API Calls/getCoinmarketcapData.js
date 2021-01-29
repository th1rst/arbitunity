import axios from "axios";
import { formatCoinmarketcapData } from "./Formatting/formatCoinmarketcapData";

//get the Top X (default: 500) cryptos from CoinMarketCap
export const getCoinmarketcapData = async (topX) => {
  try {
    let res = await axios.get(`https://arbitunity-proxy.kochannek.com/cmc`, {
      headers: { amount: topX },
    });
    return formatCoinmarketcapData(res.data);
  } catch (error) {
    console.log(error);
  }
};

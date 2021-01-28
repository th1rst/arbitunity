import axios from "axios";
import { formatCoinmarketcapData } from "./Formatting/formatCoinmarketcapData";

//get the Top X (default: 500) cryptos from CoinMarketCap
export const getCoinmarketcapData = async (topX) => {
  const VPS_IP = process.env.REACT_APP_VPS_IP;

  try {
    let res = await axios.get(`http://${VPS_IP}/cmc`, {
      headers: { amount: topX },
    });
    return formatCoinmarketcapData(res.data);
  } catch (error) {
    console.log(error);
  }
};

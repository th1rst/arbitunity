import axios from "axios";
import { formatCoinmarketcapData } from "./Formatting/formatCoinmarketcapData";

//get the Top X (default: 500) cryptos from CoinMarketCap
export const getCoinmarketcapData = async (topX) => {
  const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;
  const queryString = `?start=1&limit=${topX}&convert=USD`;
  
  try {
    
    let res = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest" +
        queryString,
      {
        headers: {
          "X-CMC_PRO_API_KEY": `${CMC_API_KEY}`,
        },
      }
    );
    formatCoinmarketcapData(res.data);
  } catch (error) {
    console.log(error);
  }
};

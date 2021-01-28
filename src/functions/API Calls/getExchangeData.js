import axios from "axios";
import { formatExchangeData } from "./Formatting/formatExchangeData";

export const getExchangeData = async (exchangeName, topCryptoTickers) => {
  const VPS_IP = process.env.REACT_APP_VPS_IP;
  const time = new Date();

  let responseTime;
  let formatted;

  try {
    // gets EVERY trading pair and its price from Binance
    let res = await axios.get(`http://${VPS_IP}/${exchangeName}`);

    // calculate response time for displaying
    responseTime = new Date() - time;

    // call formatting function to get relevant trading pairs
    formatted = formatExchangeData(res.data, topCryptoTickers, exchangeName);
  } catch (error) {
    console.log(error);
  }
  return { formatted, responseTime: responseTime };
};

import axios from "axios";
import { formatExchangeData } from "./Formatting/formatExchangeData";

export const getExchangeData = async (exchangeName, topCryptoTickers) => {
  const time = new Date();

  let responseTime;
  let formatted;

  try {
    // gets EVERY trading pair and its price from ${exchangeName}
    let res = await axios.get(
      `https://arbitunity-proxy.kochannek.com/${exchangeName}`
    );

    // calculate response time for displaying
    responseTime = new Date() - time;

    // call formatting function to get relevant trading pairs
    formatted = formatExchangeData(res.data, topCryptoTickers, exchangeName);
  } catch (error) {
    console.log(error);
  }
  return { formatted, responseTime: responseTime };
};

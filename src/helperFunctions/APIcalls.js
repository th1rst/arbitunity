import axios from "axios";
import { topCryptosImport } from "../topCryptoTickers";
import { formatAPIdata } from "./FormatAPIdata";

// different query strings and data formats for every exchange.
// handled by switch/case at the bottom.
// once recieved, data gets sent to formatting function
export const getExchangeData = async (exchangeName) => {
  let payload = [];

  const getBinanceData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Binance
      let res = await axios.get("https://www.binance.com/api/v3/ticker/price");

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "Binance");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getBittrexData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Bittrex
      let res = await axios.get("https://api.bittrex.com/v3/markets/tickers");

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "Bittrex");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getBitfinexData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Bitfinex
      let res = await axios.get(
        "https://api-pub.bitfinex.com/v2/tickers?symbols=ALL"
      );

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "Bitfinex");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getKucoinData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from KuCoin
      let res = await axios.get(
        "https://api.kucoin.com/api/v1/market/allTickers"
      );

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(
        res.data.data.ticker,
        topCryptosImport,
        "Kucoin"
      );
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getPoloniexData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Poloniex
      let res = await axios.get(
        "https://poloniex.com/public?command=returnTicker"
      );

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "Poloniex");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getHuobiData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Huobi
      let res = await axios.get("https://api.huobi.pro/market/tickers");

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data.data, topCryptosImport, "Huobi");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getGateIOdata = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from Huobi
      let res = await axios.get("https://api.gateio.ws/api/v4/spot/tickers");

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "GateIO");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getOkexData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from OKex
      let res = await axios.get(
        "https://www.okex.com/api/spot/v3/instruments/ticker"
      );

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(res.data, topCryptosImport, "OKex");
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  const getCoinexData = async () => {
    let formatted;
    const time = new Date();
    let responseTime;

    try {
      // gets EVERY trading pair and its price from CoinEx
      let res = await axios.get("https://api.coinex.com/v1/market/ticker/all");

      // calculate response time for displaying
      responseTime = new Date() - time;

      // call formatting function to get relevant trading pairs
      formatted = formatAPIdata(
        res.data.data.ticker,
        topCryptosImport,
        "CoinEx"
      );
    } catch (error) {
      console.log(error);
    }
    return { formatted, responseTime: responseTime };
  };

  switch (exchangeName) {
    case "Binance":
      payload = await getBinanceData();
      break;
    case "Bittrex":
      payload = await getBittrexData();
      break;
    case "Bitfinex":
      payload = await getBitfinexData();
      break;
    case "Kucoin":
      payload = await getKucoinData();
      break;
    case "Poloniex":
      payload = await getPoloniexData();
      break;
    case "Huobi":
      payload = await getHuobiData();
      break;
    case "GateIO":
      payload = await getGateIOdata();
      break;
    case "OKex":
      payload = await getOkexData();
      break;
    case "CoinEx":
      payload = await getCoinexData();
      break;
    default:
      break;
  }

  return payload;
};

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const fs = require("fs");
const https = require("https");

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/arbitunity-proxy.kochannek.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/arbitunity-proxy.kochannek.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/arbitunity-proxy.kochannek.com/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

require("dotenv").config();

const app = express();
const httpsServer = https.createServer(credentials, app);

app.use(morgan("tiny"));
app.use(cors());

app.get("/cmc", cors(), (req, res) => {
  const amount = req.headers.amount;
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${amount}`;

  axios
    .get(url, { headers: { "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY } })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      //res.send(err.response.data);
      res.send(err);
    });
});

app.get("/Bittrex", cors(), (req, res) => {
  axios
    .get("https://api.bittrex.com/v3/markets/tickers")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/Binance", cors(), (req, res) => {
  axios
    .get("https://www.binance.com/api/v3/ticker/price")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/Bitfinex", cors(), (req, res) => {
  axios
    .get("https://api-pub.bitfinex.com/v2/tickers?symbols=ALL")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/Kucoin", cors(), (req, res) => {
  axios
    .get("https://api.kucoin.com/api/v1/market/allTickers")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data.data.ticker);
      res.send(err.response.data);
    });
});

app.get("/Poloniex", cors(), (req, res) => {
  axios
    .get("https://poloniex.com/public?command=returnTicker")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/Huobi", cors(), (req, res) => {
  axios
    .get("https://api.huobi.pro/market/tickers")
    .then((response) => {
      res.send(response.data.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/GateIO", cors(), (req, res) => {
  axios
    .get("https://api.gateio.ws/api/v4/spot/tickers")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/OKex", cors(), (req, res) => {
  axios
    .get("https://www.okex.com/api/spot/v3/instruments/ticker")
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

app.get("/CoinEx", cors(), (req, res) => {
  axios
    .get("https://api.coinex.com/v1/market/ticker/all")
    .then((response) => {
      res.send(response.data.data.ticker);
    })
    .catch((err) => {
      console.log(err.response.data);
      res.send(err.response.data);
    });
});

httpsServer.listen(443, () => {
  console.log("Listening on port 443");
});

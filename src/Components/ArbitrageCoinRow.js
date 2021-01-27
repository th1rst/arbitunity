import React from "react";
import Slide from "@material-ui/core/Slide";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getExchangeURL } from "../functions/API Calls/getExchangeURL";

export const ArbitrageCoinRow = (props) => {
  // let cards slide in from left and right depending on
  // even/odd numbers (only on breakpoint < lg)
  const checkEvenOddsForAnimation = (index) => {
    // since original data comes from an array, exclude 0 (so index+1)
    if ((index + 1) % 2 === 0) {
      return "right";
    } else {
      return "left";
    }
  };

  const {
    loaded,
    name,
    lowPrice,
    buyExchange,
    percentageGain,
    highPrice,
    sellExchange,
    id,
    index,
  } = props;

  return (
    <>
      {/* ----- Breakpoint > lg ----- */}
      <div className="hidden lg:flex flex-row justify-evenly items-center w-full my-8 ">
        {/* ---------- BUY CARD ---------- */}
        <Slide direction="right" in={loaded} mountOnEnter unmountOnExit>
          <Card className="w-1/4 border border-green-500">
            <div className="flex flex-row justify-between items-center">
              <img
                className="mt-2 ml-8 w-20 h-20 rounded-full"
                src={`https://s2.coinmarketcap.com/static/img/coins/128x128/${id}.png`}
                alt="coin logo"
              />
              <Typography className="pt-4 pr-8" variant="h3" component="h3">
                {name}
              </Typography>
            </div>
            <CardContent>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  Buy Price:
                </Typography>
                <Typography variant="h5" component="h5">
                  {lowPrice}
                </Typography>
              </div>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  From:
                </Typography>
                <Typography variant="h5" component="h5">
                  {buyExchange}
                </Typography>
              </div>
            </CardContent>
            <CardActions className="border-t">
              <Button size="medium" color="primary">
                <a
                  className="mt-2 text-center"
                  href={`${getExchangeURL(name, buyExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {buyExchange}
                </a>
              </Button>
            </CardActions>
          </Card>
        </Slide>

        {/* ---------- PERCENTAGE GAIN ---------- */}
        <div className="flex flex-row justify-center items-center">
          <Slide direction="up" in={loaded} mountOnEnter unmountOnExit>
            <div>
              <p className="text-xl text-white font-semibold">
                + {percentageGain}%
              </p>
            </div>
          </Slide>
        </div>

        {/* ---------- SELL CARD ---------- */}
        <Slide direction="left" in={loaded} mountOnEnter unmountOnExit>
          <Card className="w-1/4 border border-red-500 shadow-xl">
            <div className="flex flex-row justify-between items-center">
              <img
                className="mt-2 ml-8 w-20 h-20 rounded-full"
                src={`https://s2.coinmarketcap.com/static/img/coins/128x128/${id}.png`}
                alt="coin logo"
              />
              <Typography className="pt-4 pr-8" variant="h3" component="h3">
                {name}
              </Typography>
            </div>
            <CardContent>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  Sell Price:
                </Typography>
                <Typography variant="h5" component="h5">
                  {highPrice}
                </Typography>
              </div>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  At:
                </Typography>
                <Typography variant="h5" component="h5">
                  {sellExchange}
                </Typography>
              </div>
            </CardContent>
            <CardActions>
              <Button size="medium" color="primary">
                <a
                  className="mt-2 text-center"
                  href={`${getExchangeURL(name, sellExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {sellExchange}
                </a>
              </Button>
            </CardActions>
          </Card>
        </Slide>
      </div>

      {/* ----- Breakpoint < lg ----- */}
      <div className="flex lg:hidden flex-row justify-evenly items-center w-full my-8 ">
        {/* ---------- BUY CARD ---------- */}

        <Slide
          direction={checkEvenOddsForAnimation(index)}
          in={loaded}
          mountOnEnter
          unmountOnExit
        >
          <Card className="w-3/4 border border-green-500">
            <div className="flex flex-row justify-between items-center">
              <img
                className="mt-2 ml-8 w-20 h-20 rounded-full"
                src={`https://s2.coinmarketcap.com/static/img/coins/128x128/${id}.png`}
                alt="coin logo"
              />
              <Typography className="pt-4 pr-8" variant="h3" component="h3">
                {name}
              </Typography>
            </div>
            <CardContent>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  Buy Price:
                </Typography>
                <Typography variant="h5" component="h5">
                  {lowPrice}
                </Typography>
              </div>
              <div className="flex flex-row justify-around items-center mb-4">
                <Typography variant="p" component="p">
                  From:
                </Typography>
                <Typography variant="h5" component="h5">
                  {buyExchange}
                </Typography>
              </div>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  Sell Price:
                </Typography>
                <Typography variant="h5" component="h5">
                  {highPrice}
                </Typography>
              </div>
              <div className="flex flex-row justify-around items-center">
                <Typography variant="p" component="p">
                  At:
                </Typography>
                <Typography variant="h5" component="h5">
                  {sellExchange}
                </Typography>
              </div>
              <div className="mt-4 flex flex-col justify-center items-center">
                <Typography variant="p" component="p">
                  Possible Gain:
                </Typography>
                <Typography variant="h5" component="h5">
                  + {percentageGain}%
                </Typography>
              </div>
            </CardContent>
            <CardActions className="border-t">
              <Button size="medium" color="primary">
                <a
                  className="mt-2 text-center"
                  href={`${getExchangeURL(name, buyExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {buyExchange}
                </a>
              </Button>
              <Button size="medium" color="primary">
                <a
                  className="mt-2 text-center"
                  href={`${getExchangeURL(name, sellExchange)}`}
                  target="_blank noopener noreferrer"
                >
                  view on {sellExchange}
                </a>
              </Button>
            </CardActions>
          </Card>
        </Slide>
      </div>
    </>
  );
};

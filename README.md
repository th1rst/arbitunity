# Arbitunity

### A Cryptocurrency Arbitrage Calculator

## Built with React, TailwindCSS, NodeJS and Express


![overview](https://kochannek.com/portfolio/arbitunity/arbitunity.gif)

[Live Version](https://kochannek.com/portfolio/arbitunity)

### Functionality

**What it does:**
- Get Top 500 (default, can be edited) Coins from Coinmarketcap
- Await promise.all(Get ALL trading pairs from 9 Exchanges)
- Format them so only the BTC trading pairs that are liquid (not a price of 0) are left
- Cross-check the ones that are left against the Top 500 coins
- Return a new Object with (minPrice) at (buyExchange) and (maxPrice) at (sellExchange)
- Calculate the possible percentage gain and render onto UI

**What it does NOT:**
- Differentiate between bid/ask prizes (not enough of a difference to be considered imho)
- Check the trading volume of coins (this would result in too many API calls for the free tier)

### About 
Originally, this wasn’t intended to be a (sort of) Full Stack and more of a fun project because I love Crypto ever since I got into it in early 2017.

Early in the development process, I enabled the “Cors Everywhere” Browser Extension because my local NPM Server kept stressing me. The problem was: I forgot that I had enabled it and finished the Frontend, deployed it to my Webserver and then I couldn’t escape the CORS error messages anymore. So I was left with two choices: don’t showcase the project and use it for myself or stick with it and push myself through building a NodeJS + Express Backend to proxy the calls (for the Coinmarketcap API this actually is the ONLY way to use it). Luckily, I had a spare VPS “lying around” that I had no use for at the moment, so I went for it.
After about a day of reading through Documentation and watching Videos about Node and Express, the (very small) Backend was finished, running and working. 'Finally', I thought, and deployed my Frontend… but then Firefox gave me the “Blocked Mixed Content” error because my Frontend was on HTTPS and my Backend on HTTP. After finding out the hard way that I couldn’t get an SSL certificate to work on a “bare IP” VPS (except for self-signed ones), I actually went with a solution of creating a Subdomain, adding DNS/A entries an let Certbot do its magic on my VPS.

One feature that I’d like to add in the future is checking the trading volume of coins that show up in the results. Right now, that has to be done manually and that’s a tedious process. Doing so with Frontend code would result in too many API calls for the free tier, so I’m thinking about setting up a MongoDB and caching the trading volumes in intervals.

It certainly is a less UI-focused project than my previous ones, and more heavy on sorting, filtering and calculating, but its practical use-case is awesome for everyone who is into Cryptocurrency trading.

Note: the Proxy Server is running on a cheap 1-Core Linux VPS located in St. Petersburg, Russia, so load times are increased roughtly about +800ms per API call.

## Technologies used

**Frontend / UI:**

- React 17 including Hooks
- Tailwind CSS 2.0
- Material UI Components

**Animations:**

- Material UI Transitions

**Backend:**
- NodeJS
- Express.js


## Features

- Hooks
- Material UI
- Filtering hundreds of Cryptos across 9 Exchanges
- HTTPS enabled Proxy Server on a VPS
- Visual representation of API response times
- Adjust min+max gain to personal needs
- Fully responsive (obviously)
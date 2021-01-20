export const getUniqueCoinsAndPrices = (dataset) => {
    const uniqueCoinsAndPrices = [];

    // iterate over every exchange
    dataset.forEach((exchange) => {
      // then iterate over every coin
      exchange.pairs.forEach((coin) => {
        // map over already processed coins (uniqueCoinsAndPrices)
        // check if entry of said coin already exists
        const found = uniqueCoinsAndPrices.some(
          (item) => item.name === coin.name
        );

        // if not found, push a new object (inluding coin name) to array
        if (!found) {
          uniqueCoinsAndPrices.push({
            name: coin.name,
            priceList: [
              {
                exchange: `${exchange.name}`,
                price: coin.price,
              },
            ],
          });
        }

        // if found -> check at which index,
        // update only the price (add price @ ExchangeXYZ to list)
        else {
          const index = uniqueCoinsAndPrices
            .map((element) => element.name)
            .indexOf(coin.name);

          uniqueCoinsAndPrices[index].priceList.push({
            exchange: `${exchange.name}`,
            price: coin.price,
          });
        }
      });
    });

    return uniqueCoinsAndPrices;
  };
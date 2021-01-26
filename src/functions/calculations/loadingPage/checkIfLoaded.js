export const checkIfLoaded = (exchangeName, loadedList) => {
  // check if exchange is loaded (given via props and then from render),
  // return isLoaded flag to conditionally render green checkmark and
  // response time for each exchange
  const loadedExchanges = Object.entries(loadedList);
  let isLoaded = false;

  loadedExchanges.forEach((exchange) => {
    if (exchange[0] === exchangeName && exchange[1].loaded) {
      isLoaded = true;
    }
  });
  return isLoaded;
};

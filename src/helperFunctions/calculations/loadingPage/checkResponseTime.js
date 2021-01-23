export const checkResponseTime = (exchangeName, loadedList) => {
  const loadedExchanges = Object.entries(loadedList);
  let responseTime;

  loadedExchanges.forEach((exchange) => {
    if (exchange[0] === exchangeName && exchange[1].loaded) {
      responseTime = exchange[1].responseTime;
    }
  });
  return responseTime;
};

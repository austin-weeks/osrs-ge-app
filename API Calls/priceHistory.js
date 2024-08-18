
export default async function loadPriceHistory(itemId, setPriceHistory) {
  try {
    const resp = await fetch(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=24h&id=${itemId}`);
    const data = await resp.json();
    let previousEntry = null;
    const history = data.data.map(entry => {
      const item = {
        Date: new Date(entry.timestamp * 1000),
        High: entry.avgHighPrice,
        Low: entry.avgLowPrice,
        averagePrice: ((entry.avgHighPrice + entry.avgLowPrice) / 2),
        previousPrice: previousEntry ? 
          ((previousEntry.avgHighPrice + previousEntry.avgLowPrice) / 2)
          : ((entry.avgHighPrice + entry.avgLowPrice) / 2),
        "High Price Volume": entry.highPriceVolume,
        "Low Price Volume": entry.lowPriceVolume
      }
      previousEntry = entry;
      return item;
    });
    setPriceHistory(history);
  } catch (e) {
    console.log(e);
    return {error: 'could not fetch price history'};
  }

  // const resp = await fetch(`https://austinweeks.dev/api/ge-tracker/item/${itemId}`);
  // const data = await resp.json();
  // let volume;
  // try {
  //   const resp = await fetch(`https://api.weirdgloop.org/exchange/history/osrs/last90d?id=${itemId}`);
  //   const data = await resp.json();
  //   volume = data[itemId.toString()]
  // } catch (e) {
  //   volume = { error: 'could not load volume history' }
  // }
  // let prevDaily;
  // //Date and Price/Volume are capitalized in order to display correct legends on the graphs.
  // const history = {
  //   daily: Object.entries(data.daily).map(data => {
  //     const entry = {
  //       Date: new Date(parseInt(data[0])),
  //       Price: data[1],
  //       prev: prevDaily || data[1]
  //     };
  //     prevDaily = data[1];
  //     return entry;
  //   }),
  //   volume: volume.map(data => ({
  //     Date: new Date(data.timestamp),
  //     Volume: data.volume
  //   }))
  // };

  // setPriceHistory(history);
}

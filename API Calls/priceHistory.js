import { getAveragePrice, LATEST_BULK_DATA_TIMESTAMP } from "./fetchItems";

//Used by the graph to get price history for an item
export default async function loadPriceHistory(itemId, utilizedTimeSeriesSearch, setPriceHistory) {
  try {
    const resp = await fetch(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=24h&id=${itemId}`);
    const data = await resp.json();
    let previousEntry = null;
    const history = data.data.map(entry => {
      const averagePrice = getAveragePrice(entry);
      const item = {
        timestamp: entry.timestamp,
        Date: new Date(entry.timestamp * 1000),

        //Fixing weirdness with API
        High: entry.avgHighPrice > entry.avgLowPrice ? entry.avgHighPrice : entry.avgLowPrice,
        Low: entry.avgLowPrice < entry.avgHighPrice ? entry.avgLowPrice : entry.avgHighPrice,

        averagePrice: averagePrice,
        previousPrice: previousEntry ? getAveragePrice(previousEntry) : averagePrice,
        highPriceVolume: entry.highPriceVolume,
        lowPriceVolume: entry.lowPriceVolume,
        totalVolume: entry.highPriceVolume + entry.lowPriceVolume
      }
      previousEntry = entry;
      return item;
    });

    if (!utilizedTimeSeriesSearch) {
      if (!LATEST_BULK_DATA_TIMESTAMP) console.error(LATEST_BULK_DATA_TIMESTAMP, 'latest bulk data timestamp is not defined')
      if (history[history.length - 1].timestamp > LATEST_BULK_DATA_TIMESTAMP) {
        history.pop();
      }
    }

    setPriceHistory(history);
  } catch (e) {
    console.log(e);
    return {error: 'could not fetch price history'};
  }

}


let baseData = null;

export let LATEST_BULK_DATA_TIMESTAMP;

export async function initializeData(callback) {
  await getBase();
  callback();
}

export default async function getBase() {
  if (baseData != null) return baseData.slice();
  try {
    //Grabbing list of all items & their info
    const respItems = await fetch('https://prices.runescape.wiki/api/v1/osrs/mapping');
    const itemDetails = await respItems.json();
    itemDetails.sort((a, b) => a.id - b.id)
    //Grabbing latest price of all items.
    const respLastRecordedPrices = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
    const jsonLastRecordedPrices = await respLastRecordedPrices.json();
    const recordedPrices = Object.entries(jsonLastRecordedPrices.data);


    //Fetching Last Week of Prices
    const timestampDayOffset = 86400;
    const maxFetches = 7;
    let dailyPrices = [];
    let lastTimestamp = null;
    for (let i = 0; i < maxFetches; i++) {
      const data = await fetch24HourPrices(lastTimestamp);
      dailyPrices.push(data.prices);
      if (i === 0) LATEST_BULK_DATA_TIMESTAMP = data.timestamp;
      lastTimestamp = data.timestamp - timestampDayOffset;
    }


    //Creating a list of items that includes only those that have ever had a price recorded
    //This removes any items in which there is not trade data.
    let items = [];
    for (const item of itemDetails) {
      //Check to make sure that item has ever been logged in RuneLite Price Database
      const entryInRecordedPrices = recordedPrices.find(price => parseInt(price[0]) === item.id);
      if (!entryInRecordedPrices) {
        continue;
      }

      //Finding Current and Last Prices
      let currentPriceData = null;
      let previousPriceData = null;
      let currentFoundAtIndex;
      let utilizedTimeSeriesSearch = false;
      //Finding Current Price
      for (let i = 0; i < dailyPrices.length; i++) {
        const match = dailyPrices[i].find(price => parseInt(price[0]) === item.id);
        if (match) {
          //YOU NEED TO JUST ACCEPT THE DATA POINT IF EITHER A HIGH OR LOW IS NOT NULL
          if (match[1].avgHighPrice == null && match[1].avgLowPrice == null) continue;
          currentFoundAtIndex = i;
          currentPriceData = match[1];
          break;
        }
      }
      //Finding Last Price
      //This should only be performed if a current price was found,
      //otherwise we make a call to lookup the item's trade history directly
      if (currentPriceData != null) {
        for (let i = currentFoundAtIndex + 1; i < dailyPrices.length; i++) {
          const match = dailyPrices[i].find(price => parseInt(price[0]) === item.id);
          if (match) {
            //YOU NEED TO JUST ACCEPT THE DATA POINT IF EITHER A HIGH OR LOW IS NOT NULL
            if (match[1].avgHighPrice == null && match[1].avgLowPrice == null) continue;
            previousPriceData = match[1];
            break;
          }
        }
      }
      if (!currentPriceData || !previousPriceData) {
        utilizedTimeSeriesSearch = true;
        const {current, previous} = await fetchItemCurrentAndPrevious(item.id);
        if (!current || !previous) {
          continue;
        }
        currentPriceData = current;
        previousPriceData = previous;
      }

      //Defining price averages and changes
      const currentPrice = getAveragePrice(currentPriceData);
      const previousPrice = getAveragePrice(previousPriceData);
      const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

      //Adding item info and prices to items array
      items.push({
        priceChange,
        id: item.id,
        name: item.name,
        examine: item.examine,
        members: item.members,
        icon: item.icon.replaceAll(' ', '_'),
        wikiLink: item.icon.replaceAll(' ', '_').slice(0, item.icon.length - 4),
        highAlch: item.highalch,
        buyLimit: item.limit,
        utilizedTimeSeriesSearch,
        latestPrice: currentPrice,
        yesterdayPrice: previousPrice,
        latestVolumeTraded: currentPriceData.highPriceVolume + currentPriceData.lowPriceVolume,
        previousVolumeTraded: previousPriceData.highPriceVolume + previousPriceData.lowPriceVolume
      });
    }

    baseData = items;
    return baseData.slice();

  } catch (e) {
    console.error(e)
    return { error: e }
  }
}

async function fetch24HourPrices(timestamp) {
  const resp = await fetch(`https://prices.runescape.wiki/api/v1/osrs/24h${timestamp ? `?timestamp=${timestamp}` : ''}`);
  const data = await resp.json();
  const prices = Object.entries(data.data);
  prices.sort((a, b) => a[0] - b[0]);
  return {
    prices,
    timestamp: data.timestamp
  };
}

async function fetchItemCurrentAndPrevious(itemId) {
  const resp = await fetch(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=24h&id=${itemId}`);
  const data = await resp.json();
  const priceHistory = data.data;
  let latestPriceData;
  let previousPriceData;
  let latestFoundAtIndex;
  //Grab the first valid entry
  for (let i = priceHistory.length - 1; i >= 0; i--) {
    //YOU NEED TO JUST ACCEPT THE DATA POINT IF EITHER A HIGH OR LOW IS NOT NULL
    if (priceHistory[i].avgHighPrice != null || priceHistory[i].avgLowPrice != null) {
      latestPriceData = priceHistory[i];
      latestFoundAtIndex = i;
      break;
    }
  }
  //Grab the next valid entry
  for (let i = latestFoundAtIndex - 1; i >= 0; i--) {
    //YOU NEED TO JUST ACCEPT THE DATA POINT IF EITHER A HIGH OR LOW IS NOT NULL
    if (priceHistory[i].avgHighPrice != null || priceHistory[i].avgLowPrice != null) {
      previousPriceData = priceHistory[i];
      break;
    }
  }

  return {
    current: latestPriceData,
    previous: previousPriceData
  }
}

export function getAveragePrice(priceData) {
  let average;
  const {avgHighPrice, avgLowPrice, lowPriceVolume, highPriceVolume} = priceData;
  if (avgHighPrice == null || avgLowPrice == null) {
    average = avgHighPrice + avgLowPrice;
  } else {
    const highSales = highPriceVolume * avgHighPrice;
    const lowSales = lowPriceVolume * avgLowPrice;
    const totalVolume = lowPriceVolume + highPriceVolume;
    average = (highSales + lowSales) / totalVolume;
  }
  return Math.round(average);
}

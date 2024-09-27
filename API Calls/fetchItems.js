
let baseData = null;

export let LATEST_BULK_DATA_TIMESTAMP;

export async function initializeData(callback) {
  await getBase();
  callback();
}

export default async function getBase() {
  if (baseData != null) return baseData.slice();
  try {
    //Timing
    const start = Date.now();

    //Grabbing list of all items & their info
    const respItems = await fetch('https://prices.runescape.wiki/api/v1/osrs/mapping');
    const itemDetails = await respItems.json();

    //Grabbing latest price of all items.
    const respLastRecordedPrices = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
    const jsonLastRecordedPrices = await respLastRecordedPrices.json();
    //Recorded prices is sorted inc by ID, can binary search
    const recordedPrices = Object.entries(jsonLastRecordedPrices.data);
    

    //Fetching Last Week of Prices
    const timestampDayOffset = 86400;
    const maxFetches = 5;
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
    let fetchPromises = [];
    let itemsCurPrevPrice = [];
    for (const item of itemDetails) {
      const itemData = {
        item,
        current: null,
        previous: null,
        utilizedTimeSeriesSearch: false
      }
      //Check to make sure that item has ever been logged in RuneLite Price Database
      if (!binSearchID(recordedPrices, item.id)) continue;

      //Finding Current and Last Prices
      let currentPriceData = null;
      let previousPriceData = null;
      let currentFoundAtIndex;
      //Finding Current Price
      for (let i = 0; i < dailyPrices.length; i++) {
        const match = binSearchID(dailyPrices[i], item.id);
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
          const match = binSearchID(dailyPrices[i], item.id);
          if (match) {
            //YOU NEED TO JUST ACCEPT THE DATA POINT IF EITHER A HIGH OR LOW IS NOT NULL
            if (match[1].avgHighPrice == null && match[1].avgLowPrice == null) continue;
            previousPriceData = match[1];
            break;
          }
        }
      }
      //Current and last price was not found in last week's prices
      //Need to create a promise and append to promise list
      if (!currentPriceData || !previousPriceData) {
        fetchPromises.push(fetchItemCurrentAndPrevious(item.id).then((({current, previous}) => {
          if (!current || !previous) return;
          itemData.utilizedTimeSeriesSearch = true;
          itemData.current = current;
          itemData.previous = previous;
          itemsCurPrevPrice.push(itemData);
        })));
      }
      //All is well, no need to work with fetching or promises
      else {
        itemData.current = currentPriceData;
        itemData.previous = previousPriceData;
        itemsCurPrevPrice.push(itemData);
      }
    }

    //Fetch data for all items missing current/previous price information
    await Promise.all(fetchPromises);

    let items = [];
    for (const itemData of itemsCurPrevPrice) {
      //Defining price averages and changes
      const currentPrice = getAveragePrice(itemData.current);
      const previousPrice = getAveragePrice(itemData.previous);
      const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

      //Adding item info and prices to items array
      items.push({
        priceChange,
        id: itemData.item.id,
        name: itemData.item.name,
        examine: itemData.item.examine,
        members: itemData.item.members,
        icon: itemData.item.icon.replaceAll(' ', '_'),
        wikiLink: itemData.item.icon.replaceAll(' ', '_').slice(0, itemData.item.icon.length - 4),
        highAlch: itemData.item.highalch,
        buyLimit: itemData.item.limit,
        utilizedTimeSeriesSearch: itemData.utilizedTimeSeriesSearch,
        latestPrice: currentPrice,
        yesterdayPrice: previousPrice,
        latestVolumeTraded: itemData.current.highPriceVolume + itemData.current.lowPriceVolume,
        previousVolumeTraded: itemData.previous.highPriceVolume + itemData.previous.lowPriceVolume
      });
    }

    baseData = items;
    console.log('Time to fetch item data: ', ((Date.now() - start) / 1000).toFixed(2), 'seconds');
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

function binSearchID(array, target) {
  // const entryInRecordedPrices = recordedPrices.find(price => parseInt(price[0]) === item.id);
  let l = 0;
  let r = array.length - 1;
  while (l <= r) {
    let m = Math.floor(l / 2 + r / 2);
    const id = parseInt(array[m][0]);
    if (id === target) return array[m];
    else if (id < target) l = m + 1;
    else r = m -1;
  }
  return false;
};


let baseData = null;

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
      let lowQualityData = false;
      //Finding Current Price
      for (let i = 0; i < dailyPrices.length; i++) {
        const match = dailyPrices[i].find(price => parseInt(price[0]) === item.id);
        if (match) {
          if (Object.values(match).some(val => val == null)) continue;
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
            if (Object.values(match).some(val => val == null)) continue;
            previousPriceData = match[1];
            break;
          }
        }
      }
      if (!currentPriceData || !previousPriceData) {
        lowQualityData = true;
        const {current, previous} = await fetchItemCurrentAndPrevious(item.id);
        if (!current || !previous) {
          console.error('could not find a current and previous for', item.name);
          continue;
        }
        currentPriceData = current;
        previousPriceData = previous;
      }

      //Defining price averages and changes
      const currentPrice = (currentPriceData.avgHighPrice + currentPriceData.avgLowPrice) / 2;
      const previousPrice = (previousPriceData.avgHighPrice + previousPriceData.avgLowPrice) / 2;
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
        lowQualityData,
        latestPrice: Math.round(currentPrice),
        yesterdayPrice: Math.round(previousPrice),
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
    //None of the object entries contain null data.
    if (Object.values(priceHistory[i]).every(val => val != null)) {
      latestPriceData = priceHistory[i];
      latestFoundAtIndex = i;
      break;
    }
  }
  //Grab the next valid entry
  for (let i = latestFoundAtIndex - 1; i >= 0; i--) {
    if (Object.values(priceHistory[i]).every(val => val != null)) {
      previousPriceData = priceHistory[i];
      break;
    }
  }

  return {
    current: latestPriceData,
    previous: previousPriceData
  }
}

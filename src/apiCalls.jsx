
export async function loadPriceHistory(itemId, setPriceHistory) {
  const resp =  await fetch(`https://austinweeks.dev/api/ge-tracker/item/${itemId}`);
  const data = await resp.json();
  const history = Object.entries(data);
  console.log(history)
  setPriceHistory(history);
}




let rises = null;
export async function loadRises(updateFunction) {
  if (rises) {
    updateFunction(rises);
    return;
  }
  const mapped = await getBase();
  const priceRises = mapped.sort((a, b) => {
    return b.priceChange - a.priceChange;
  });
  rises = priceRises;
  updateFunction(priceRises)
}

let falls = null;
export async function loadFalls(updateFunction) {
  if (falls) {
    updateFunction(falls);
    return;
  }
  const mapped = await getBase();
  const priceFalls = mapped.sort((a, b) => {
    return a.priceChange - b.priceChange;
  });
  falls = priceFalls;
  updateFunction(priceFalls);
}

let valuable = null;
export async function loadMostValuable(updateFunction) {
  if (valuable) {
    updateFunction(valuable);
    return;
  }
  const mapped = await getBase();
  const mostValuable = mapped.sort((a, b) => {
    return b.latestPrice - a.latestPrice;
  });
  valuable = mostValuable;
  updateFunction(mostValuable);
}

let volume = null;
export async function loadMostTraded(updateFunction) {
  if (volume) {
    updateFunction(volume);
    return;
  }
  const mapped = await getBase();
  const mostTraded = mapped.sort((a, b) => {
    return b.latestVolumeTraded - a.latestVolumeTraded;
  });
  volume = mostTraded;
  updateFunction(mostTraded);
}

let baseData = null;
async function getBase() {
  if (baseData != null) return baseData.slice();
  try {
    const resp = await fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
    const data = await resp.json();
    const latestPrices = Object.entries(data.data);

    const respA = await fetch('https://prices.runescape.wiki/api/v1/osrs/1h');
    const dataA = await respA.json();
    const latest1hrPrices = Object.entries(dataA.data);

    const yesterdayTimestamp = dataA.timestamp - 86400;

    const respB = await fetch(`https://prices.runescape.wiki/api/v1/osrs/1h?timestamp=${yesterdayTimestamp}`);
    const dataB = await respB.json();
    const yesterdayPrices = Object.entries(dataB.data);

    const respC = await fetch('https://prices.runescape.wiki/api/v1/osrs/mapping');
    const details = await respC.json();

    console.group('API Calls');
      console.log('All Items', details.length);
      console.log('Latest', latestPrices.length);
      console.log('Last Hour', latest1hrPrices.length);
      console.log('Yesterday', yesterdayPrices.length);
    console.groupEnd();

    //YOU CAN REFACTOR WITH THE .REDUCE() METHOD TO REMOVE ITEMS WITH NO PRICE INFO
    const items = details.reduce((coll, item) => {
      const yesterdayArr = yesterdayPrices.find(price => parseInt(price[0]) === item.id);
      const yesterday = yesterdayArr ? yesterdayArr[1] : null;

      const latest1hrArr = latest1hrPrices.find(price => parseInt(price[0]) === item.id);
      let latest;
      if (latest1hrArr) latest = latest1hrArr[1];
      else {
        const latestArr = latestPrices.find(price => parseInt(price[0]) === item.id);
        if (!latestArr) return coll;
        else {
          const latestPrice = latestArr[1];
          latest = {
            avgHighPrice: latestPrice.high,
            highPriceVolume: yesterday ? yesterday.highPriceVolume : 0,
            avgLowPrice: latestPrice.low,
            lowPriceVolume: yesterday ? yesterday.lowPriceVolume : 0
          }
        }
      }

      
      const latestPrice = (latest.avgHighPrice + latest.avgLowPrice) / 2;
      const yesterdayPrice = yesterday ? (yesterday.avgHighPrice + yesterday.avgLowPrice) / 2 : null;
      const priceChange = yesterday ? ((latestPrice - yesterdayPrice) / yesterdayPrice) * 100 : 0;
      //will need to have a function that fetches data from offical api OR check previous prices for the item's timespan by id

      coll.push({
        priceChange,
        id: item.id,
        name: item.name,
        examine: item.examine,
        members: item.members,
        icon: item.icon.replaceAll(' ', '_'),
        wikiLink: item.icon.replaceAll(' ', '_').slice(0, item.icon.length - 4),
        highAlch: item.highalch,
        buyLimit: item.limit,
        latestPrice: Math.round(latestPrice),
        yesterdayPrice: Math.round(yesterdayPrice),
        latestVolumeTraded: latest.highPriceVolume + latest.lowPriceVolume
      });
      return coll;
    }, []);

    baseData = items;
    return items;

  } catch (e) {
    console.error(e)
    return {error: e}
  }
}

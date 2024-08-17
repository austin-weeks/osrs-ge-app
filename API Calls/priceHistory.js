
export default async function loadPriceHistory(itemId, setPriceHistory) {
  const resp = await fetch(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=24h&id=${itemId}`);
  const data = await resp.json();
  setPriceHistory(data.data);

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

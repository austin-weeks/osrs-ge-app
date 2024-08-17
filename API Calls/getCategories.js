import getBase from "./fetchItems";

const minimumVolume = 10;

let rises = null;
export async function loadRises(updateFunction) {
  if (rises) {
    updateFunction(rises);
    return;
  }
  const mapped = await getBase();
  const priceRises = mapped
    .filter(item => item.latestVolumeTraded > minimumVolume && item.previousVolumeTraded > minimumVolume)
    .sort((a, b) => {
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
  const priceFalls = mapped
    .filter(item => item.latestVolumeTraded > minimumVolume && item.previousVolumeTraded > minimumVolume)
    .sort((a, b) => {
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

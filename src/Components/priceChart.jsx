import * as Plot from "@observablehq/plot";

export default function loadLineChart(priceHistoryImmutable, chartType, timespan,  setLoading) {
  const root = document.getElementById('graph-root');
  while (root.firstElementChild) {
    root.removeChild(root.lastElementChild);
  }

  let priceItems = 0;
  let volumeItems = 0;
  switch (timespan) {
    default:
    case '1month': priceItems = 30;
      volumeItems = 30;
      break;
    case '3months': priceItems = 90;
      volumeItems = priceHistoryImmutable.volume.length;
      break;
    case '6months': priceItems = priceHistoryImmutable.daily.length;
      break;
  }


  let plot;
  if (chartType === 'prices') {
    const daily = priceHistoryImmutable.daily.slice(priceHistoryImmutable.daily.length - priceItems);
    const average = priceHistoryImmutable.average.slice(priceHistoryImmutable.average.length - priceItems);
    plot = priceChart(daily, average);
  } else if (chartType === 'volume') {
    const volume = priceHistoryImmutable.volume.slice(priceHistoryImmutable.volume.length - volumeItems);
    plot = volumeChart(volume);
  }

  plot.classList.add('absolute', 'inset-0','size-full')
  root.append(plot);

  setLoading(false)
}

function priceChart(daily, average) {
  const {min, max} = getMinMax(daily, 'Price');
  const range = max - min;
  const offset = range === 0 ? 1 : Math.round(range / 20);

  return Plot.plot({
    grid: true,
    x: {
      tickSpacing: 30
    },
    y: {

    },
    marks: [
      Plot.ruleY([min - offset]),
      
      Plot.lineY(daily, {
        x: 'Date',
        y: 'Price',
        stroke: '#292524',
        opacity: 0.8,
        curve: 'bundle',
        tension: 0.3
      }),
      
      Plot.lineY(daily, {
        x: 'Date',
        y: 'Price',
        opacity: 1,
        marker: 'dot'
      }),

      Plot.tip(daily, 
        Plot.pointer({
          x: 'Date',
          y: 'Price',
          fill: '#665b47'
        })
      ),
    ],
  });
}
function volumeChart(volume) {
  const { min, max } = getMinMax(volume, 'Price');
  const range = max - min;
  const offset = range === 0 ? 1 : Math.round(range / 20);

  return Plot.plot({
    grid: true,
    x: {
      interval: 'day',
      tickSpacing: 30
    },
    y: {

    },
    color: { domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"] },
    marks: [
      Plot.ruleY([0]),
      Plot.rectY(volume, {
        x: 'Date',
        y: 'Volume',
        // stroke: (d) => Math.sign(d.prev - d.price),
        // strokeWidth: 4,
        // strokeLinecap: "round",
      }),
      Plot.tip(volume,
        Plot.pointerX({
          x: 'Date',
          y: 'Volume',
          fill: '#665b47'
        })
      )
    ]
  });
}

function getMinMax(array, key) {
  let min = Infinity;
  let max = -Infinity;
  for (const el of array) {
    if (el[key] < min) min = el[key];
    if (el[key] > max) max = el[key];
  }
  return {min, max};
}

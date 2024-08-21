import * as Plot from "@observablehq/plot";
import { formatDate, formatPrice, formatVolume } from "./formatters";

export default function loadLineChart(priceHistoryImmutable, chartType, timespan,  setLoading, increaseTimeSpan) {
  const root = document.getElementById('graph-root');
  while (root.firstElementChild) {
    root.removeChild(root.lastElementChild);
  }

  const nowTimestamp = Date.now();
  const month = 2629743000;
  const year = 31556926000;
  let rewindedTimestamp;
  switch (timespan) {
    default:
    case '1month': rewindedTimestamp = nowTimestamp - month;
      break;
    case '3months': rewindedTimestamp = nowTimestamp - (month * 3);
      break;
    case '6months': rewindedTimestamp = nowTimestamp - (month * 6);
      break;
    case '1year': rewindedTimestamp = nowTimestamp - year;
      break;
  }
  const startingDate = new Date(rewindedTimestamp);

  const priceHistoryDateRange = priceHistoryImmutable.slice().filter(entry => entry.Date > rewindedTimestamp);
  if (priceHistoryDateRange.length === 0 && timespan !== '1year') {
    increaseTimeSpan();
    return;
  }

  let plot;
  if (chartType === 'prices') {
    plot = priceChart(priceHistoryDateRange, startingDate);
  } else if (chartType === 'volume') {
    plot = volumeChart(priceHistoryDateRange, startingDate, timespan);
  }

  plot.classList.add('absolute', 'top-0', 'inset-0','size-full')
  root.append(plot);

  setLoading(false)
}

function priceChart(priceHistory, startDate) {
  if (priceHistory.length === 0) {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-center text-center';
    div.textContent = 'This item has no recorded purchases within the selected timespan :(';
    return div;
  }

  const min = getMin(priceHistory, 'Low');
  const max = getMax(priceHistory, 'High');
  const range = Math.abs(max - min);
  let offset = range === 0 ? 1 : range / 20;
  if (range < 10) offset = 1;
  if (min - offset < 0) offset = min;


  return Plot.plot({
    marginLeft: 40,
    marginRight: 15,
    marginBottom: 37,
    grid: true,
    color: {
      domain: [-1, 0, 1],
      range: ["#e41a1c", "#333333", "#4daf4a"]
    },
    style: {
      fontFamily: 'inherit',
      fontSize: 12
    },
    x: {
      interval: 'day',
      tickSpacing: 30,
    },
    y: {
      label: 'Price (gp)',
      labelArrow: false,
      labelOffset: 33,
      tickFormat: d => d > Math.floor(d) ? '' : formatPrice(d)
    },
    marks: [
      //Have to check if max is less than min becuase theres weird date with items like pure essence
      Plot.ruleY([(max > min ? min : max) - offset]),
      Plot.ruleY([range < 10 ? max + 2 : max], {
        opacity: 0
      }),

      Plot.ruleX([startDate], {
        opacity: 0.7
      }),
      Plot.ruleX([Date.now()], {
        opacity: 0
      }),
      
      //Moving average curve
      Plot.lineY(priceHistory, 
        Plot.windowY(7, {
          x: 'Date',
          y: 'averagePrice',
          stroke: '#292524',
          opacity: 0.8,
          curve: 'basis'
        })
      ),

      //Candlestick price moves line
      Plot.ruleX(priceHistory, {
        x: 'Date',
        y1: 'Low',
        y2: 'High',
        stroke: d => Math.sign(d.averagePrice - d.previousPrice),
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        marker: 'none'
      }),
      Plot.dot(priceHistory, {
        x: 'Date',
        y: 'averagePrice',
        fill: d => Math.sign(d.averagePrice - d.previousPrice),
        r: 2.5
      }),
      
      // Plot.lineY(priceHistory, {
      //   x: 'Date',
      //   y: 'Price',
      //   opacity: 1,
      //   marker: 'dot'
      // }),

      Plot.tip(priceHistory,
        Plot.pointerX({
          x: 'Date',
          y1: d => d.Low ? d.Low : d.averagePrice,
          y2: d => d.High ? d.High : d.averagePrice,
          title: d => 
            `Date  ${formatDate(d.Date)}\n${`Price  ${formatPrice(d.averagePrice)}`}${(d.High && d.Low) ? `\nHigh  ${formatPrice(d.High)}\nLow   ${formatPrice(d.Low)}` : ''}`,
          fill: '#665b47',
          fontSize: 14,
          stroke: '#333333',
          strokeWidth: 1.5
        })
      ),
    ],
  });
}
function volumeChart(priceHistory, startDate, timepsan) {
  if (priceHistory.length === 0) {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-center text-center';
    div.textContent = 'This item has no recorded purchases within the selected timespan :(';
    return div;
  }

  let labelOffset;
  switch (timepsan) {
    default:
    case '1month': labelOffset = 13;
      break;
    case '3months': labelOffset = 4;
      break;
    case '6months': labelOffset = 2;
      break;
    case '1year': labelOffset = 1;
      break;
  }

  return Plot.plot({
    grid: true,
    marginRight: 15,
    marginBottom: 37,
    style: {
      fontFamily: 'inherit',
      fontSize: 12
    },
    x: {
      interval: 'day',
      tickSpacing: 30
    },
    y: {
      label: '# Traded',
      labelArrow: false,
      labelOffset: 30,
      tickFormat: d => formatVolume(d)
    },
    
    marks: [
      Plot.ruleY([0]),

      Plot.ruleX([startDate], {
        dx: - labelOffset,
        opacity: 0.7
      }),
      Plot.ruleX([Date.now()], {
        opacity: 0
      }),


      //Low Price Volume
      Plot.rectY(priceHistory, {
        x: 'Date',
        y1: 0, 
        y2: 'lowPriceVolume',
        fill: '#d97706'
      }),
      //High Price Volume
      Plot.rectY(priceHistory, {
        x: 'Date',
        y1: 'lowPriceVolume',
        y2: 'highPriceVolume',
        fill: '#0ea5e9'
      }),

      Plot.tip(priceHistory,
        Plot.pointerX({
          x: 'Date',
          y1: 0,
          y2: d => d.highPriceVolume > d.lowPriceVolume ? d.highPriceVolume : d.lowPriceVolume,
          fill: '#665b47',
          fontSize: 14,
          title: d => 
            `Date${formatDate(d.Date)}\nTotal Volume  ${formatVolume(d.totalVolume)}${(d.highPriceVolume > 0 && d.lowPriceVolume > 0) ? `\nHigh Price Volume  ${formatVolume(d.highPriceVolume)}\nLow Price Volume  ${formatVolume(d.lowPriceVolume)}` : ''}`,
          stroke: '#333333',
          strokeWidth: 1.5
        })
      )
    ]
  });
}

function getMin(array, key) {
  let min = Infinity;
  for (const el of array) {
    if (el[key] < min) min = el[key];
  }
  return min;
}
function getMax(array, key) {
  let max = -Infinity;
  for (const el of array) {
    if (el[key] > max) max = el[key];
  }
  return max;
}

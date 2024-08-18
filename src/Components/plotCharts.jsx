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

  plot.classList.add('absolute', 'inset-0','size-full')
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
  const offset = range === 0 ? 1 : range / 20;


  return Plot.plot({
    marginLeft: 50,
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
      Plot.ruleY([range < 2 ? max + 1 : max], {
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
        y1: d => d.Low ? d.Low : d.averagePrice,
        y2: d => d.High ? d.High : d.averagePrice,
        stroke: d => Math.sign(d.averagePrice - d.previousPrice),
        strokeWidth: 2,
        marker: 'dot'
      }),
      
      // Plot.lineY(priceHistory, {
      //   x: 'Date',
      //   y: 'Price',
      //   opacity: 1,
      //   marker: 'dot'
      // }),

      Plot.tip(priceHistory, 
        Plot.pointer({
          x: 'Date',
          y1: d => d.Low ? d.Low : d.averagePrice,
          y2: d => d.High ? d.High : d.averagePrice,
          title: d => 
            `Date  ${formatDate(d.Date)}\n${(d.High && d.Low) ? `High  ${formatPrice(d.High)}\nLow   ${formatPrice(d.Low)}` : `Price  ${formatPrice(d.averagePrice)}`}`,
          fill: '#665b47',
          fontSize: 14
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
    case '1month': labelOffset = 11;
      break;
    case '3months': labelOffset = 13;
      break;
    case '6months': labelOffset = 15;
      break;
    case '1year': labelOffset = 1;
      break;
  }

  return Plot.plot({
    grid: true,
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
        y2: 'Low Price Volume',
        fill: '#d97706'
      }),
      //High Price Volume
      Plot.rectY(priceHistory, {
        x: 'Date',
        y1: 'Low Price Volume',
        y2: 'High Price Volume',
        fill: '#0ea5e9'
      }),

      Plot.tip(priceHistory,
        Plot.pointerX({
          x: 'Date',
          y: 'High Price Volume',
          fill: '#665b47',
          fontSize: 14,
          title: d => 
            //Weird string literal to get the spacing correct
            `Date${d['High Price Volume'] > 1000 || d['Low Price Volume'] > 1000 ? '              ' : '          '}${formatDate(d.Date)}\nHigh Price Volume  ${formatVolume(d['High Price Volume'])}\nLow Price Volume   ${formatVolume(d['Low Price Volume'])}`
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

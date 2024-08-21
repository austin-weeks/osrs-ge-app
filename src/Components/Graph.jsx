import React, { useContext, useEffect, useRef, useState } from "react";
import { appContext } from "../StockApp";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import loadLineChart from "./plotCharts";
import loadPriceHistory from "../../API Calls/priceHistory";

export default function Graph() {
  const { selectedItem } = useContext(appContext);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (selectedItem === null) {
      setPriceHistory(null);
      return;
    }
    setDisabledTimespans([]);
    setLoading(true);
    loadPriceHistory(selectedItem.id, selectedItem.utilizedTimeSeriesSearch, (data) => {
      setPriceHistory(data);
    });
  }, [selectedItem]);

  const [activeGraph, setActiveGraph] = useState('prices');
  const [timespan, setTimespan] = useState('3months');
  const [disabledTimespans, setDisabledTimespans] = useState([]);
  function changeGraph(graph) {
    // if (graph === 'volume' && timespan === '6months')
    //   setTimespan('3months');
    setActiveGraph(graph);
  }

  useEffect(() => {
    if (priceHistory == null) return;
    setLoading(true);
    // setDisabledTimespans([]);
    loadLineChart(priceHistory, activeGraph, timespan, setLoading, () => {
      switch (timespan) {
        case '1month':
          setDisabledTimespans(['1month']);
          setTimespan('3months');
          break;
        case '3months':
          setDisabledTimespans(['1month', '3months']);
          setTimespan('6months');
          break;
        case '6months':
          setDisabledTimespans(['1month', '3months', '6months']);
          setTimespan('1year');
        break;
      }
    })
  }, [priceHistory, activeGraph, timespan]);

  const graphDivRef = useRef(null);
  useEffect(() => {
    if (graphDivRef == null) return;
    const observer = new ResizeObserver(entries => {
      const container = entries[0]?.target;
      if (container == null) return;
      //Caluclate size of graph div...
      //Aspect ratio = 640/407
      const width = graphDivRef.current.clientWidth;
      const height = (407 / 640) * width;
      graphDivRef.current.style.height = height + 'px';
    });
    observer.observe(graphDivRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="size-full max-h-full gap-0.5 sm:gap-1 flex flex-col overflow-auto">
      <div className="flex flex-row gap-0.5 sm:gap-1 items-center">
        <img src="https://oldschool.runescape.wiki/images/Grand_Exchange_icon.png?16321" className="flex-shrink-0 object-contain h-4 sm:h-5 md:h-[1.5rem] lg:h-6 no-blurry" />
        <Button onClick={() => changeGraph('prices')} active={activeGraph === 'prices'} small>
          Price Changes
        </Button>
        <Button onClick={() => changeGraph('volume')} active={activeGraph === 'volume'} small>
          Volume Traded
        </Button>
      </div>
      <div className="flex flex-row gap-0.5 sm:gap-1 items-center">
        <img src="https://oldschool.runescape.wiki/images/Speedrunning_shop_icon.png?b6c2f" className="flex-shrink-0 object-contain h-4 sm:h-5 md:h-[1.5rem] lg:h-6 no-blurry" />
        <Button onClick={() => setTimespan('1month')} active={timespan === '1month'} small disabled={disabledTimespans.includes('1month')}>
          1 Month
        </Button>
        <Button onClick={() => setTimespan('3months')} active={timespan === '3months'} small disabled={disabledTimespans.includes('3months')}>
          3 Months
        </Button>
        <Button onClick={() => setTimespan('6months')} active={timespan === '6months'} small disabled={disabledTimespans.includes('6months')}>
          6 Months
        </Button>
        <Button onClick={() => setTimespan('1year')} active={timespan === '1year'} small disabled={disabledTimespans.includes('1year')}>
          1 Year
        </Button>
      </div>

      {loading && (
        <div className="size-full flex justify-center items-center">
          <LoadingSpinner randomize />
        </div>
      )}

      <div ref={graphDivRef} className={`w-full pt-1 relative text-rs-shadow-small font-sans ${loading && 'hidden'}`} id="graph-root" />

    </div>
  );
}

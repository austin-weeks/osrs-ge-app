import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../StockApp";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { loadPriceHistory } from "../apiCalls";
import loadLineChart from "./plotCharts";

export default function Graph() {
  const { selectedItem } = useContext(appContext);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (selectedItem === null) {
      setPriceHistory(null);
      return;
    }
    setLoading(true);
    loadPriceHistory(selectedItem.id, (data) => {
      setPriceHistory(data);
    });
  }, [selectedItem]);

  const [activeGraph, setActiveGraph] = useState('prices');
  const [timespan, setTimespan] = useState('1month');
  function changeGraph(graph) {
    if (graph === 'volume' && timespan === '6months')
      setTimespan('3months');
    setActiveGraph(graph);
  }

  useEffect(() => {
    if (priceHistory == null) return;
    setLoading(true);
    loadLineChart(priceHistory, activeGraph, timespan, setLoading)
  }, [priceHistory, activeGraph, timespan]);

  return (
    <div className="border-2 border-border size-full gap-1 flex flex-col">
      <div className="flex flex-row gap-1 items-center">
        <img src="https://oldschool.runescape.wiki/images/Grand_Exchange_icon.png?16321" className="flex-shrink-0 object-contain h-6 no-blurry" />
        <Button onClick={() => changeGraph('prices')} active={activeGraph === 'prices'} small>
          Price Changes
        </Button>
        <Button onClick={() => changeGraph('volume')} active={activeGraph === 'volume'} small>
          Volume Traded
        </Button>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <img src="https://oldschool.runescape.wiki/images/Speedrunning_shop_icon.png?b6c2f" className="flex-shrink-0 object-contain h-6 no-blurry" />
        <Button onClick={() => setTimespan('1month')} active={timespan === '1month'} small>
          1 Month
        </Button>
        <Button onClick={() => setTimespan('3months')} active={timespan === '3months'} small>
          3 Months
        </Button>
        <Button onClick={() => setTimespan('6months')} active={timespan === '6months'} small disabled={activeGraph === 'volume'}>
          6 Months
        </Button>
      </div>

      {loading && (
        <div className="size-full flex justify-center items-center">
          <LoadingSpinner randomize />
        </div>
      )}
      <div className={`size-full relative text-rs-shadow-small font-sans ${loading && 'hidden'}`} id="graph-root" />
    </div>
  );
}

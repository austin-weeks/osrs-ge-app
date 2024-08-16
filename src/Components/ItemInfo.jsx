import React, { act, useContext, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { loadPriceHistory as loadPriceHistory } from "../apiCalls";
import { formatGP } from "./formatters";
import Button from "./Button";
import { appContext } from "../StockApp";

export default function ItemInfo() {
  const { selectedItem } = useContext(appContext);

  if (selectedItem == null) return (
    <div className="flex justify-center items-center w-full">
      <div className="text-center w-full">Please select an item</div>
    </div>
  );

  const formattedPrice = formatGP(selectedItem.latestPrice)

  return (
    <div className="flex flex-col flex-grow items-center border-2 border-border">
      <div className="flex flex-row relative w-full justify-center gap-3 items-center border-2 border-border">
        <div className="flex-shrink-0 w-12 h-12">
          <img src={`https://oldschool.runescape.wiki/images/${selectedItem.icon}`} alt="" className="no-blurry object-contain size-full" />
        </div>
        <span className="text-[2.75rem]">{selectedItem.name}</span>
        <div className="absolute right-1.5 top-0 h-full">
          <a href={`https://oldschool.runescape.wiki/w/${selectedItem.wikiLink}`} target="_blank" className="cursor-alias">
            <img src="https://oldschool.runescape.wiki/images/Wiki@2x.png" alt="osrs wiki" className="object-cover h-full" />
          </a>
        </div>
      </div>
      <div className="flex flex-row w-full justify-center items-center gap-4 border-2 border-border">
        <span className="text-xl">{selectedItem.examine}</span>
        <div className="h-full border-l-2 border-border"></div>
        <div className="flex flex-row text-xl gap-2">
          <span className={formattedPrice.text}>{formattedPrice.gp}</span>
          {selectedItem.priceChange >= 0 ? (
            <span className="text-green-600">+{selectedItem.priceChange.toFixed(2)}%</span>
          ) : (
            <span className="text-red-600">{selectedItem.priceChange.toFixed(2)}%</span>
          )}
        </div>
      </div>
      <Graph />
    </div>
  );
}

function Graph() {
  const { selectedItem } = useContext(appContext);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (selectedItem === null) {
      setPriceHistory(null);
      return;
    }
    setLoading(true);
    loadPriceHistory(selectedItem.id, (data) => {
      setPriceHistory(data);
      setLoading(false);
    });
  }, [selectedItem]);

  const [activeGraph, setActiveGraph] = useState('prices');
  const [timespan, setTimespan] = useState('1month');
  function setGraph(graph) {
    // setTimespan('1month');
    setActiveGraph(graph);
  }

  if (loading || priceHistory == null) return (
    <div className="size-full flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
  console.log(selectedItem,priceHistory)
  return (
    <div className="border-2 border-border size-full flex flex-col">
      <div className="flex flex-row">
        <Button onClick={() => setGraph('prices')} active={activeGraph === 'prices'}>
          Price Changes
        </Button>
        <Button onClick={() => setGraph('volume')} active={activeGraph === 'volume'}>
          Volume Traded
        </Button>
      </div>
      <div className="flex flex-row">
        <Button onClick={() => setTimespan('1month')} active={timespan === '1month'}>
          1 Month
        </Button>
        <Button onClick={() => setTimespan('3months')} active={timespan === '3months'}>
          3 Months
        </Button>
        <Button onClick={() => setTimespan('6months')} active={timespan === '6months'}>
          6 Months
        </Button>
      </div>
      <div>
        graph :)
        {priceHistory.map(item => (<div>{item[1]}</div>))}
      </div>
    </div>
  );
}

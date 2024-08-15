import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { loadInDepth } from "../apiCalls";
import { formatGP } from "./formatters";
import Button from "./Button";

export default function ItemInfo({ item }) {
  const [itemInfo, setItemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('useeffect');
    if (item === null) return;
    console.log('item not null')
    setLoading(true);
    loadInDepth(item, (info) => {
      setItemInfo(info);
      setLoading(false);
    });
  }, [item]);


  if (loading) return (
    <div className="size-full flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
  if (itemInfo === null) return (
    <div className="text-center">please select an item</div>
  );

  const formattedPrice = formatGP(itemInfo.latestPrice)

  return (
    <div className="flex flex-col flex-grow items-center border-2 border-border">
      <div className="flex flex-row w-full justify-center items-center border-2 border-border">
        <div className="flex-shrink-0 w-12 h-12">
          <img src={`https://oldschool.runescape.wiki/images/${itemInfo.icon}`} alt="" className="no-blurry object-contain size-full" />
        </div>
        <span className="text-4xl">{itemInfo.name}</span>
      </div>
      <div className="flex flex-row w-full justify-center items-center gap-4 border-2 border-border">
        <span className="text-lg">{itemInfo.examine}</span>
        <div className="h-full border-l-2 border-border"></div>
        <div className="flex flex-row text-lg gap-2">
          <span className={formattedPrice.text}>{formattedPrice.gp}</span>
          {item.priceChange >= 0 ? (
            <span className="text-green-600">+{item.priceChange.toFixed(2)}%</span>
          ) : (
            <span className="text-red-600">{item.priceChange.toFixed(2)}%</span>
          )}
        </div>
      </div>
      <Graph itemInfo={itemInfo} />
    </div>
  );
}

function Graph(itemInfo) {
  const [activeGraph, setActiveGraph] = useState('prices');
  const [timespan, setTimespan] = useState('1month');
  function setGraph(graph) {
    setTimespan('1month');
    setActiveGraph(graph);
  }

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
    </div>
  );
}

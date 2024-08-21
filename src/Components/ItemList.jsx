import React, { useContext, useEffect, useRef, useState } from "react";
import { formatGP } from "./formatters";
import { appContext } from "../StockApp";

export default function ItemList() {
  const { currItems } = useContext(appContext);
  const [lastIndex, setLastIndex] = useState(99);
  const [showShadows, setShowShadows] = useState({top: false, bottom: false});
  const scrollingDivRef = useRef(null);
  useEffect(() => {
    if (scrollingDivRef.current == null) return;
    function onScroll(e) {
      const scrollTop = e.target.scrollTop;
      const scrollBottom = e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop);
      setShowShadows({
        top: scrollTop !== 0,
        bottom: scrollBottom !== 0
      })
    }
    onScroll({target:scrollingDivRef.current});
    scrollingDivRef.current.addEventListener('scroll', onScroll);
    return () => {
      if (scrollingDivRef.current != null) scrollingDivRef.current.removeEventListener('scroll', onScroll);
    }
  }, []);

  useEffect(() => {
    if (scrollingDivRef.current != null) scrollingDivRef.current.scrollTop = 0;
    setLastIndex(99);
  }, [currItems]);
  
  if (currItems == null || currItems.length == 0) return (
    <div className="text-2xl sm:text-3xl w-full h-[80%] flex justify-center items-center">
      Nothing to see here...
    </div>
  );

  return (
    <div className="relative overflow-auto w-full max-h-full">
      <div className={`${!showShadows.top && 'hidden'} absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-stone-900/35 to-transparent border-t-2 border-neutral-800 pointer-events-none`} />
      <div className={`${!showShadows.bottom && 'hidden'} absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-stone-900/35 to-transparent border-b-2 border-neutral-800 pointer-events-none`} />
      <div ref={scrollingDivRef} className="flex flex-col h-full w-full overflow-auto gap-0.5 sm:gap-1 rs-inner-shadow">
        {currItems.slice(0, lastIndex).map((item, ind) => <Item key={ind} item={item} />)}
        {currItems.length > lastIndex &&
          <button className="text-rs-shadow-small sm:text-rs-shadow text-sm sm:text-xl md:text-2xl lg:text-3xl px-2 pt-1 border-[2px] rounded-sm border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800 bg-rs-medium"
            onClick={() => {
              const nextIndex = lastIndex + 100;
              if (nextIndex < currItems.length) setLastIndex(nextIndex);
              else setLastIndex(currItems.length);
            }}
          >
            Load More Items...
          </button>
        }
      </div>
    </div>
  );
}

function Item({ item }) {
  const { selectedItem, setSelectedItem } = useContext(appContext);
  const formattedPrice = formatGP(item.latestPrice);

  return (
    <button className={`text-rs-shadow-small sm:text-rs-shadow px-1 sm:px-2 py-1 border-[2px] rounded-sm
      ${selectedItem === item ? 'bg-rs-dark border-t-rs-border-light-active border-l-rs-border-light-active border-b-rs-border-dark-active border-r-rs-border-dark-active'
      : 'border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800 bg-rs-medium'}`}
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex flex-row w-full items-center gap-1 sm:gap-2">
        <div className="flex-shrink-0 aspect-square size-[1.2rem] sm:size-7 md:size-8 lg:size-9">
          <img src={`https://oldschool.runescape.wiki/images/${item.icon}`} alt="" className="no-blurry object-contain size-full" />
        </div>
        <div className="truncate text-start -mt-4 sm:-mt-2 md:-mt-1">
          <span className={`text-xs sm:text-base md:text-xl xl:text-2xl`}>
            {item.name}
          </span>
          <div className="flex flex-row text-[0.6rem]/[1] sm:text-sm md:text-base lg:text-lg gap-1 sm:gap-2">
            <span className={formattedPrice.text}>{formattedPrice.gp}</span>
              {item.priceChange >= 0 ? (
                <span className="text-green-600 pr-1">+{item.priceChange.toFixed(2)}%</span>
              ) : (
                <span className="text-red-600 pr-1">{item.priceChange.toFixed(2)}%</span>
              )}
          </div>
        </div>
      </div>
    </button>
  )
}
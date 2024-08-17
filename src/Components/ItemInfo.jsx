import React, { act, useContext } from "react";
import { formatGP } from "./formatters";
import { appContext } from "../StockApp";
import Graph from "./Graph";

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
      <div className="flex flex-row w-full justify-between items-center px-2 py-1 border-2 border-border">
        <div className="flex flex-row gap-3 justify-center items-center">
          <div className="flex-shrink-0 w-11 h-11">
            <img src={`https://oldschool.runescape.wiki/images/${selectedItem.icon}`} alt="" className="no-blurry object-contain size-full" />
          </div>
          <span className="text-[2.75rem] text-ellipsis">{selectedItem.name}</span>
        </div>
        <div className="flex flex-row gap-3 justify-center items-center h-12">
          <button className="rounded-full bg-border w-9 h-9 flex justify-center items-center">
            <span className="text-green-500">+</span>
          </button>
          <a href={`https://oldschool.runescape.wiki/w/${selectedItem.wikiLink}`} target="_blank" className="cursor-alias w-12 h-full">
            <img src="https://oldschool.runescape.wiki/images/Wiki@2x.png" alt="osrs wiki" className="object-contain h-full" />
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

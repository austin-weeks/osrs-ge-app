import React, { act, useContext, useEffect, useState } from "react";
import { formatGP, formatPrice } from "./formatters";
import { appContext } from "../StockApp";
import Graph from "./Graph";
import { addItemToMyList, removeItemFromMyList } from "../../API Calls/myList";
import ToolTip from "./ToolTip";

export default function ItemInfo() {
  const { selectedItem } = useContext(appContext);

  if (selectedItem == null) return (
    <div className="size-full relative">
        <img src="/gnome_child.png" className="size-full object-contain no-blurry opacity-30 border-l-2 border-border" />
        <span className="absolute top-[40%] right-[20%] text-4xl opacity-60">stonk</span>
    </div>
  );

  const formattedPrice = formatGP(selectedItem.latestPrice)
  return (
    <div className="text-rs-shadow-small sm:text-rs-shadow max-h-full flex flex-col flex-grow items-center overflow-auto">
      <div className="flex flex-row w-full px-1 sm:px-4 sm:py-1 justify-between items-center">
        <div className="flex flex-row gap-1.5 sm:gap-3 justify-center items-center">
          <div className="flex-shrink-0 size-7 sm:size-9 md:size-10 lg:size-11">
            <img src={`https://oldschool.runescape.wiki/images/${selectedItem.icon}`} alt="" className="no-blurry object-contain size-full" />
          </div>
          <span className="text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem]">{selectedItem.name}</span>
        </div>
        <div className="flex flex-row gap-1 sm:gap-3 justify-center items-center h-12">
          <AddRemoveButton />
          <a href={`https://oldschool.runescape.wiki/w/${selectedItem.wikiLink}`} target="_blank" className="cursor-alias w-8 sm:w-12 h-full">
            <img src="https://oldschool.runescape.wiki/images/Wiki@2x.png" alt="osrs wiki" className="object-contain h-full" />
          </a>
        </div>
      </div>
      
      <div className="px-1.5 sm:px-4 pb-1 w-full self-start text-sm sm:text-lg md:text-xl border-border border-b-2">
        {selectedItem.examine}
      </div>

      <div className="flex flex-row py-1 sm:py-1.5 flex-wrap w-full justify-center items-center gap-2 md:gap-4">
        <div className="relative group">
          <img src={`https://oldschool.runescape.wiki/images/${selectedItem.members ? 'Member_icon.png?1de0c' : 'Free-to-play_icon.png?628ce'}`}
            className=" h-3.5 sm:h-5 -mt-1 aspect-square object-contain no-blurry"
          />
          <ToolTip offset="-top-1.5 left-6">
            {selectedItem.members ? 'Members Item' : 'Free-to-play Item'}
          </ToolTip>
        </div>
        <div className="hidden lg:block h-full border-l-2 border-border"></div>
        <div className="flex flex-row text-xs sm:text-xl gap-2 relative group">
          <span className={formattedPrice.text}>{formattedPrice.gp}</span>
          {selectedItem.priceChange >= 0 ? (
            <span className="text-green-600">+{selectedItem.priceChange.toFixed(2)}%</span>
          ) : (
            <span className="text-red-600">{selectedItem.priceChange.toFixed(2)}%</span>
          )}
          <ToolTip offset="top-0 -left-[8.5rem]">
            24 Hour Price Change
          </ToolTip>
        </div>
        <div className="hidden lg:block h-full border-l-2 border-border"></div>
        <div className="flex flex-row gap-2 justify-center items-center group relative">
          <img src="https://oldschool.runescape.wiki/images/High_Level_Alchemy.png?94664"
            className="h-3.5 sm:h-5 -mt-1 aspect-square object-contain no-blurry"
          />
          <span className="text-xs sm:text-xl">{formatGP(selectedItem.highAlch).gp}</span>
          <ToolTip offset="top-0 -left-[6.25rem]">
            High Alch Price
          </ToolTip>
        </div>
        {selectedItem.buyLimit &&
        <>
          <div className="hidden lg:block h-full border-l-2 border-border"></div>
          <div className="flex flex-row gap-2 justify-center items-center group relative">
            <img src="https://oldschool.runescape.wiki/images/Grand_Exchange_icon.png?16321"
              className=" h-3 sm:h-[1.25rem] aspect-square object-contain no-blurry"
              />
            <span className="text-xs sm:text-xl">{formatPrice(selectedItem.buyLimit)}</span>
            <ToolTip offset="top-0 -left-[10rem]">
              Grand Exchange Buy Limit
            </ToolTip>
          </div>
        </>}
      </div>

      <Graph />

    </div>
  );
}

function AddRemoveButton() {
  const { selectedItem, currCategory, refreshCategory } = useContext(appContext);
  const [isListItem, setIsListItem] = useState(false);
  useEffect(() => {
    if (selectedItem == null) return;
    setIsListItem(selectedItem.isMyListItem);
  }, [selectedItem]);

  if (selectedItem == null) return (
    <div className="flex justify-center items-center w-full">
      <div className="text-center w-full">Please select an item</div>
    </div>
  );

  return (
    <button className="rounded-full border-2 border-rs-border-light-active group relative bg-border size-6 sm:size-9 flex justify-center items-center"
      onClick={() => {
        const updateList = currCategory === 'my-list' ? () => refreshCategory() : null;
        if (isListItem) {
          removeItemFromMyList(selectedItem, updateList);
          setIsListItem(false);
        } else {
          addItemToMyList(selectedItem, updateList);
          setIsListItem(true);
        }
      }}
    >
      <ToolTip>
        {isListItem ? 'Remove from' : 'Add to'} Watchlist
      </ToolTip>
      {isListItem ?
        <span className="text-red-500 text-5xl pt-1">-</span> :
        <span className="text-green-500 pt-0.5">+</span>
      }
    </button>


  );
}

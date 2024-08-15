import React, { act } from "react";
import { formatGP } from "./formatters";

export default function ItemList({ items, activeItem, selectItem }) {
  
  return (
    <div className="flex flex-col max-w-[20rem] w-full max-h-full overflow-auto gap-1">
      {items.slice(0, 99).map((item, ind) => <Item key={ind} item={item} activeItem={activeItem} selectItem={selectItem} />)}
    </div>
  );
}

function Item({ item, activeItem, selectItem }) {
  const formattedPrice = formatGP(item.latestPrice);

  return (
    <button className={`text-rs-shadow px-2 pt-1.5 pb-1 border-[2px]
      ${activeItem === item ? 'border-rs-text bg-rs-dark'
      : 'border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800 bg-rs-medium rounded-sm'}`}
      onClick={() => selectItem(item)}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex-shrink-0 w-9 h-9">
          <img src={`https://oldschool.runescape.wiki/images/${item.icon}`} alt="" className="no-blurry object-contain size-full" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-2xl text-start text-ellipsis whitespace-nowrap overflow-hidden w-[15rem]">
            {item.name}
          </span>
          <div className="flex flex-row text-lg gap-2">
            <span className={formattedPrice.text}>{formattedPrice.gp}</span>
              {item.priceChange >= 0 ? (
                <span className="text-green-600">+{item.priceChange.toFixed(2)}%</span>
              ) : (
                <span className="text-red-600">{item.priceChange.toFixed(2)}%</span>
              )}
          </div>
        </div>
      </div>
    </button>
  )
}
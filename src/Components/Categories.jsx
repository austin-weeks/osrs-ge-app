import React, { useContext, useState } from "react";
import Button from "./Button";
import { appContext } from "../StockApp";

export default function Categories() {
  const { currCategory, updateCategory } = useContext(appContext);

  return (
    <div className="flex flex-row w-full gap-1 items-center justify-center py-1">
      <Button>
        Search for Item
      </Button>
      <Button active={currCategory === 'rises'} onClick={() => updateCategory('rises')}>
        Price Rises
      </Button>
      <Button active={currCategory === 'falls'} onClick={() => updateCategory('falls')}>
        Price Falls
      </Button>
      <Button active={currCategory === 'most-valuable'} onClick={() => updateCategory('most-valuable')}>
        Most Valuable Trades
      </Button>
      <Button active={currCategory === 'most-traded'} onClick={() => updateCategory('most-traded')}>
        Most Traded
      </Button>
    </div>
  );
}
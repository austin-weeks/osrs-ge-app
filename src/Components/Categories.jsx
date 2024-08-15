import React, { useState } from "react";
import Button from "./Button";

export default function Categories({ category, changeCategory }) {

  return (
    <div className="flex flex-row w-full gap-1 items-center justify-center py-1">
      <Button>
        Search for Item
      </Button>
      <Button active={category === 'rises'} onClick={() => changeCategory('rises')}>
        Price Rises
      </Button>
      <Button active={category === 'falls'} onClick={() => changeCategory('falls')}>
        Price Falls
      </Button>
      <Button active={category === 'most-valuable'} onClick={() => changeCategory('most-valuable')}>
        Most Valuable Trades
      </Button>
      <Button active={category === 'most-traded'} onClick={() => changeCategory('most-traded')}>
        Most Traded
      </Button>
    </div>
  );
}
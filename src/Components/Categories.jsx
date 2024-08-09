import React from "react";
import Button from "./ButtonInventory";

export default function Categories({ activeCategory, changeCategory }) {

  return (
    <div className="flex flex-row w-full gap-1 items-center justify-center border-stone-700 border-t-2 border-b-2 py-1">
      <Button>
        Search for Item
      </Button>
      <Button>
        Price Rises
      </Button>
      <Button>
        Price Falls
      </Button>
      <Button>
        Most Valuable Trades
      </Button>
      <Button>
        Most Traded
      </Button>
    </div>
  );
}
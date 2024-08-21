import React, { useContext } from "react";
import Button from "./Button";
import { appContext } from "../StockApp";

export default function Categories() {
  const { currCategory, updateCategory } = useContext(appContext);

  return (
    <div className="flex flex-row flex-wrap lg:flex-nowrap w-full gap-0.5 sm:gap-1 items-center justify-center text-base sm:text-xl xl:text-2xl">
      <Button active={currCategory === 'search'} onClick={() => updateCategory('search')}>
        <IconAndText
          iconSrc={'https://runescape.wiki/images/Magnifying_glass.png?51c4f'}
          text={'Search'}
        />
      </Button>
      <Button active={currCategory === 'my-list'} onClick={() => updateCategory('my-list')}>
        <IconAndText
          iconSrc={'https://oldschool.runescape.wiki/images/List_of_elders.png?30594'}
          text={'My Watchlist'}
        />
      </Button>
      <Button active={currCategory === 'rises'} onClick={() => updateCategory('rises')}>
        <IconAndText
          iconSrc={'https://www.runescape.com/img/rsp777/grand_exchange/positive.gif'}
          text={'Price Rises'}
        />
      </Button>
      <Button active={currCategory === 'falls'} onClick={() => updateCategory('falls')}>
        <IconAndText
          iconSrc={'https://www.runescape.com/img/rsp777/grand_exchange/negative.gif'}
          text={'Price Falls'}
        />
      </Button>
      <Button active={currCategory === 'most-valuable'} onClick={() => updateCategory('most-valuable')}>
        <IconAndText
          iconSrc={'https://oldschool.runescape.wiki/images/Bank_icon.png?b3b57'}
          text={'Most Valuable Trades'}
        />
      </Button>
      <Button active={currCategory === 'most-traded'} onClick={() => updateCategory('most-traded')}>
        <IconAndText
          iconSrc={'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467'}
          text={'Most Traded'}
        />
      </Button>
    </div>
  );
}

export function IconAndText({iconSrc, text}) {
  return (
    <div className="flex flex-row justify-center items-center gap-2">
      <img src={iconSrc} className="size-4 sm:size-6 aspect-square object-contain no-blurry -ml-2 mb-1" />
      <span className="truncate">
        {text}
      </span>
    </div>
  )
}
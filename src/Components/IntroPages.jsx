import React from "react";
import Button from "./Button";
import { IconAndText } from "./Categories";
import LoadingSpinner from "./LoadingSpinner";

export default function IntroPage({ categoryPicked, setCategoryPicked }) {
  // function getPickedCategoryString() {
  //   switch (categoryPicked) {
  //     case 'search': return 'Search';
  //     case 'my-list': return 'My Watchlist';
  //     case 'rises': return 'Price Rises';
  //     case 'falls': return 'Price Falls';
  //     case 'most-valuable': return 'Most Valuable Trades';
  //     case 'most-traded': return 'Most Traded';
  //     default: return 'error';
  //   }
  // }

  return (
    <div className="flex flex-col items-center justify-start gap-12 sm:gap-16 p-1 pt-10 sm:pt-14 overflow-auto size-full">
      <div className=" w-full h-[7.5rem] sm:h-[10rem] xl:h-[12rem]">
        <img src="https://oldschool.runescape.wiki/images/Old_School_RuneScape_logo.png?1d864&20181104160057" alt="Old School Runescape"
          className="object-contain h-full w-auto aspect-auto mx-auto"
        />
      </div>
      <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center">
        {categoryPicked ? (
          <div className="text-3xl sm:text-4xl pt-24">
            {/* Loading {getPickedCategoryString()}... */}
            <LoadingSpinner randomize />
          </div>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl underline decoration-2">
              Select a Category
            </div>
            <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-1 w-full px-4 sm:px-12 items-center justify-evenly text-base sm:text-xl xl:text-2xl">
              <Button large onClick={() => setCategoryPicked('search')}>
                <IconAndText
                  iconSrc={'https://runescape.wiki/images/Magnifying_glass.png?51c4f'}
                  text={'Search'}
                />
              </Button>
              <Button large onClick={() => setCategoryPicked('my-list')}>
                <IconAndText
                  iconSrc={'https://oldschool.runescape.wiki/images/List_of_elders.png?30594'}
                  text={'My Watchlist'}
                />
              </Button>
              <Button large onClick={() => setCategoryPicked('rises')}>
                <IconAndText
                  iconSrc={'https://www.runescape.com/img/rsp777/grand_exchange/positive.gif'}
                  text={'Price Rises'}
                />
              </Button>
              <Button large onClick={() => setCategoryPicked('falls')}>
                <IconAndText
                  iconSrc={'https://www.runescape.com/img/rsp777/grand_exchange/negative.gif'}
                  text={'Price Falls'}
                />
              </Button>
              <Button large onClick={() => setCategoryPicked('most-valuable')}>
                <IconAndText
                  iconSrc={'https://oldschool.runescape.wiki/images/Bank_icon.png?b3b57'}
                  text={'Most Valuable Trades'}
                />
              </Button>
              <Button large onClick={() => setCategoryPicked('most-traded')}>
                <IconAndText
                  iconSrc={'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467'}
                  text={'Most Traded'}
                />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
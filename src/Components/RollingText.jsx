import React, { useEffect, useState } from "react";
import { getMyList, subscribeToListUpdates } from "../../API Calls/myList";
import { formatGP } from "./formatters";

export default function RollingText({ text, toRight=false, ...props }) {
  let repeatedText = text;
  for (let i = 0; i < 100; i++) {
    repeatedText += (' ' + text);
  }

  return (
    <div className={`w-full overflow-x-hidden flex-shrink-0 pt-1 hover:cursor-crosshair ${props.className}`}>
      <div className={`w-full whitespace-nowrap pause-hover ${toRight ? 'animate-scroll-text-right' : 'animate-scroll-text-left'}`}>
        {repeatedText}
      </div>
    </div>
  );
}

const osrsLogoLarge = 'https://oldschool.runescape.wiki/images/Steam_client_logo.png?a7cae&20210407035501';
const osrsLogoSmall = 'https://oldschool.runescape.wiki/images/RuneScape_2_logo.png?47c97&20240819234416';
const osrsLogoExtraSmall = 'https://oldschool.runescape.wiki/images/Old_School_RuneScape_client_icon_%28alternative%29.png?9fcc3&20191128181110';

export function RollingLogo({ toRight = false, ...props }) {
  function LogoAndText() {
    return (
      <span className="flex flex-row gap-4 md:gap-6 justify-center items-center flex-shrink-0">
        <div className="h-[42px] md:h-[54px] w-[113px] md:w-[150px] relative overflow-hidden">
          <img src={osrsLogoSmall} alt="Old School Runescape" className="absolute top-1 md:top-0.5 left-0 object-contain h-[36px] md:h-[50px] aspect-auto" />
        </div>
        <span className="text-rs-shadow md:text-rs-shadow-large pt-1 pb-0.5 text-3xl md:text-5xl">Grand Exchange Tracker</span>
      </span>
    );
  }

  let repititions = new Array(50);
  repititions.fill(0);

  return (
    <div className={`w-full overflow-x-hidden flex-shrink-0 hover:cursor-crosshair ${props.className}`}>
      <div className={`w-full flex flex-row gap-4 md:gap-6 justify-center items-center whitespace-nowrap pause-hover ${toRight ? 'animate-scroll-text-right' : 'animate-scroll-text-left'}`}>
        {repititions.map((el, ind) => <LogoAndText key={ind} />)}
      </div>
    </div>
  );
}

const runeIcons = [
  'Air_rune.png?248b4',
  'Mind_rune.png?92ebd',
  'Water_rune.png?75a26',
  'Earth_rune.png?0b998',
  'Fire_rune.png?3859a',
  'Body_rune.png?acf91',
  'Cosmic_rune.png?1f2bc',
  'Chaos_rune.png?3fbd5',
  'Nature_rune.png?ed6d0',
  'Law_rune.png?6592f',
  'Astral_rune.png?2baad',
  'Death_rune.png?3a184',
  'Blood_rune.png?3d4c6',
  'Soul_rune.png?44c1f'
];

export function RollingIconsVertical({ flipped = false, ...props }) {
  let repeatedIcons = [];
  for (let i = 0; i < 30; i++) {
    repeatedIcons = repeatedIcons.concat(runeIcons);
  }

  return (
    <div className={`hidden md:flex h-full w-11 text-4xl overflow-y-hidden justify-center flex-shrink-0 hover:cursor-crosshair border-border border-l-2 
          ${flipped ? 'rotate-180' : ''}
        `}
    >
      <div className={`h-full whitespace-nowrap flex gap-4 pause-hover animate-scroll-text-vertical ${props.className}`}>
        {repeatedIcons.map((iconLink, ind) => (
          <img key={ind} src={`https://oldschool.runescape.wiki/images/${iconLink}`} className={`aspect-square no-blurry w-9 ${flipped && 'rotate-180'}`} />
        ))}
      </div>
    </div>
  );
}


export function RollingTextVertical({text, flipped=false, ...props }) {
  let repeatedText = text;
  for (let i = 0; i < 50; i++) {
    repeatedText += (' ' + text);
  }

  return (
    <div className={`h-full w-11 text-4xl overflow-y-hidden flex-shrink-0 hover:cursor-crosshair border-border border-l-2 
          ${flipped ?'rotate-180' : ''}
        `}
    >
      <div className={`h-full whitespace-nowrap pause-hover animate-scroll-text-vertical ${props.className}`}>
        {repeatedText}
      </div>
    </div>
  );
}

export function RollingWatchList({toRight = false, ...props }) {
  const [items, setItems] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [forcedUpdate, setForcedUpdate] = useState(0);
  function forceUpdate() {
    setForcedUpdate(Math.random());
  }
  useEffect(() => {
    if (!subscribed) {
      setSubscribed(true);
      subscribeToListUpdates(forceUpdate);
    }
  }, []);

  useEffect(() => {
    getMyList(setItems);
  }, [forcedUpdate]);

  if (!items || items.length === 0) return (
    <div className="w-full flex-shrink-0 h-[44px] md:h-[52px] border-t-2 border-border" />
  );

  let repeatedItems = [];
  for (let i = 0; i < 30; i++) {
    repeatedItems = repeatedItems.concat(items);
  }

  return (
    <div className={`w-full overflow-x-hidden flex-shrink-0 py-1 hover:cursor-crosshair ${props.className}`}>
      <div className={`w-full whitespace-nowrap flex flex-row gap-4 pause-hover ${toRight ? 'animate-scroll-text-right' : 'animate-scroll-text-left'}`}>
        {repeatedItems.map((item, ind) => {
          const formattedPrice = formatGP(item.latestPrice);
          return (
            <div key={ind} className="flex flex-row flex-shrink-0 items-center justify-center md:py-1 gap-1.5 pl-4 border-l-2 border-border">
              <div className="flex-shrink-0 h-6 sm:h-7">
                <img src={`https://oldschool.runescape.wiki/images/${item.icon}`} className="no-blurry object-contain h-full aspect-square" />
              </div>
              <div className="text-start text-base sm:text-xl">
                {item.name}
              </div>
              <span className="mt-0.5 text-2xl text-rs-shadow-small">-</span>
              <span className={`${formattedPrice.text} ${'text-base md:text-xl'}`}>{formattedPrice.gp}</span>
              {item.priceChange >= 0 ? (
                <span className="text-green-600 text-base md:text-xl">+{item.priceChange.toFixed(2)}%</span>
              ) : (
                <span className="text-red-600 text-base md:text-xl">{item.priceChange.toFixed(2)}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
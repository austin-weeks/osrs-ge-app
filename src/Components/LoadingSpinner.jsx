import React from "react";

export default function LoadingSpinner({ style = 'runes', randomize = false}) {
  if (randomize) {
    if (Math.random() > 0.5) style = 'runes';
    else style = 'partyhats';
  }
  let item1;
  let item2;
  let item3;
  switch (style) {
    default: 
    case "runes": 
      item1 = 'Air_rune.png?248b4';
      item2 = 'Water_rune.png?75a26';
      item3 = 'Fire_rune.png?3859a';
      break;
    case "partyhats":
      item1 = 'Blue_partyhat.png?00685';
      item2 = 'Red_partyhat.png?77caa';
      item3 = 'Green_partyhat.png?e75c0';
      break;
  }
  return (
    <div className="h-16 flex flex-col justify-end">
      <div className="flex flex-row gap-1 animate-runes-fade justify-center items-center">
        {/* air rune */}
        <img src={`https://oldschool.runescape.wiki/images/${item1}`}
          className="w-8 h-8 animate-runes-bounce"
        />
        {/* water rune */}
        <img src={`https://oldschool.runescape.wiki/images/${item2}`}
          className="w-8 h-8 animate-runes-bounce [animation-delay:0.15s]"
        />
        {/* fire rune */}
        <img src={`https://oldschool.runescape.wiki/images/${item3}`}
          className="w-8 h-8  animate-runes-bounce [animation-delay:0.3s]"
        />
      </div>
    </div>
  );
}
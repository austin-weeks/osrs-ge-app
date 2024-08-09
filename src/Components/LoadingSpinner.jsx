import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="h-16 flex flex-col justify-end">
      <div className="flex flex-row gap-1 animate-runes-fade">
        {/* air rune */}
        <img src="https://oldschool.runescape.wiki/images/Air_rune.png?248b4"
          className="w-8 h-8 animate-runes-bounce"
        />
        {/* water rune */}
        <img src="https://oldschool.runescape.wiki/images/Water_rune.png?75a26"
          className="w-8 h-8 animate-runes-bounce [animation-delay:0.15s]"
        />
        {/* fire rune */}
        <img src="https://oldschool.runescape.wiki/images/Fire_rune.png?3859a"
          className="w-8 h-8  animate-runes-bounce [animation-delay:0.3s]"
        />
      </div>
    </div>
  );
}
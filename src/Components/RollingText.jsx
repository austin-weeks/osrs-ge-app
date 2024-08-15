import React from "react";

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

export function RollingTextVertical({ text, flipped=false, ...props }) {
  let repeatedText = text;
  for (let i = 0; i < 50; i++) {
    repeatedText += (' ' + text);
  }

  return (
    <div className={`h-full overflow-y-hidden flex-shrink-0 hover:cursor-crosshair border-border border-l-2 ${flipped ? 'pl-1 rotate-180' : 'pr-1'}`}>
      <div className={`h-full whitespace-nowrap pause-hover animate-scroll-text-vertical ${props.className}`}>
        {repeatedText}
      </div>
    </div>
  );
}
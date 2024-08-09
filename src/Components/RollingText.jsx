import React from "react";

export default function RollingText({ text, toRight=false, ...props }) {
  let repeatedText = text;
  for (let i = 0; i < 20; i++) {
    repeatedText += (' ' + text)
  }
  return (
    <div className="w-full overflow-x-hidden">
      <div className={`w-full whitespace-nowrap ${toRight ? 'animate-scroll-text-right' : 'animate-scroll-text-left'} ${props.className}`}>
        {repeatedText}
      </div>
    </div>
  );
}
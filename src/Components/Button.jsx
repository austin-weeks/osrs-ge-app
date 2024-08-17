import React from "react";

export default function Button({ active = false, small = false, disabled = false, ...props }) {
  return (
    <button className={`text-rs-shadow border-[2px] flex-grow
      ${small ? 'text-xl' :'px-3 pt-1.5 pb-1'}
      ${!disabled && !active && 'bg-rs-medium'}
      ${disabled && 'bg-neutral-700 pointer-events-none'}
      ${active ? 'border-rs-text bg-rs-dark'
        : 'border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800 rounded-sm'}
      `}>
      <div {...props} />
    </button>
  );
}
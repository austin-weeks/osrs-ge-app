import React from "react";

export default function Button({ active = false, small = false, large = false, disabled = false, ...props }) {
  let sizeStyles = '';
  if (small && large) throw new Error('cannot have a large and small styled buttom');
  if (small) sizeStyles = 'text-sm sm:text-lg md:text-xl sm:pt-0.5';
  else if (large) sizeStyles = 'text-2xl md:text-3xl xl:text-4xl px-4 xl:px-6 p-2 pt-3';
  else sizeStyles = 'px-3 pt-0.5 sm:pt-1 md:pt-1.5 sm:pb-0.5 md:pb-1';

  return (
    <button className={`text-rs-shadow-small sm:text-rs-shadow border-[2px] flex-grow rounded-sm
      ${sizeStyles}
      ${!disabled && !active && 'bg-rs-medium'}
      ${disabled && 'bg-neutral-700 pointer-events-none'}
      ${active ? 'border-t-rs-border-light-active border-l-rs-border-light-active border-b-rs-border-dark-active border-r-rs-border-dark-active bg-rs-dark'
        : 'border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800'}
      `}>
      <div {...props} />
    </button>
  );
}
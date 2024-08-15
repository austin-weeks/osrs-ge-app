import React from "react";

export default function Button({ active, ...props }) {
  return (
    <button className={`text-rs-shadow px-3 pt-1.5 pb-1 border-[2px] 
      ${active ? 'border-rs-text bg-rs-dark'
      : 'border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800 bg-rs-medium rounded-sm'}`}>
      <div {...props} />
    </button>
  );
}
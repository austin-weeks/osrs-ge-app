import React from "react";

export default function Button({ ...props }) {
  return (
    <button className="text-rs-shadow bg-rs-medium px-3 pt-1.5 pb-1
      border-[2px] rounded-sm border-t-rs-border-light border-l-rs-border-light border-b-stone-800 border-r-stone-800">
      <div {...props} />
    </button>
  );
}
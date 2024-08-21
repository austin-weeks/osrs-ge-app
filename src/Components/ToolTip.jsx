import React from "react";

/**
 * Parent element MUST contain the 'group' and 'relative' class in order for the tooltip to show on hover.
 * @param {*} param0 
 * @returns 
 */
export default function ToolTip({ offset = null, ...props }) {
  return (
    <div 
      className={`absolute z-10 text-base shadow-md text-rs-shadow-small hidden sm:group-hover:block py-0.5 px-1.5 whitespace-nowrap bg-rs-medium rounded-sm ${offset ? offset : 'top-1 right-10'}`}
      {...props}
    />
  );
}
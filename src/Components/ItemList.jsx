import React from "react";

export default function ItemList({ items }) {
  console.log(items);
  return (
    <div className="flex flex-col">
      {items.map(item => <Item item={item} />)}
    </div>
  );
}

function Item(item) {
  return (
    <div>
      This is an item!
    </div>
  )
}
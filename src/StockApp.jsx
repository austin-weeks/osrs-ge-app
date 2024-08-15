import React, { useEffect, useState } from "react";
import RollingText, { RollingTextVertical } from "./Components/RollingText";
import Categories from "./Components/Categories";
import ItemInfo from "./Components/ItemInfo";
import ItemList from "./Components/ItemList";
import LoadingSpinner from "./Components/LoadingSpinner";
import { loadFalls, loadMostTraded, loadMostValuable, loadRises } from "./apiCalls";


let catgegories = 'rises' || 'falls' || 'most-valuable' || 'most-traded' || 'my-list';


export default function StockApp() {
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const [category, setCategory] = useState('rises');
  function updateCategory(category) {
    setLoading(true);
    setCategory(category);
    if (category === 'rises') loadRises(loadItems);
    else if (category === 'falls')  loadFalls(loadItems);
    else if (category === 'most-valuable') loadMostValuable(loadItems);
    else if (category === 'most-traded') loadMostTraded(loadItems);
    else if (category === 'my-list') setItems({error: 'my-list not implemented'});
    else {
      console.error('updating category to invalid category');
    }
  }
  function loadItems(items) {
    setItems(items);
    setLoading(false);
  }

  useEffect(() => {
    loadRises(loadItems);
  }, [])


  let content = <MainSection items={items} category={category} updateCategory={updateCategory} activeItem={activeItem} selectItem={setActiveItem} />;
  if (loading) content = (
    <div className="size-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
  if (items?.error) content = 'error!';

  return (
    <div className="text-3xl max-h-screen h-screen w-screen overflow-auto flex flex-col items-center">
      <RollingText className="text-4xl h1 border-b-2 border-border" text="OLD SCHOOL RUNESCAPE GRAND EXCHANGE TRACKER -" />
      <div className="flex flex-row size-full overflow-auto">
        <RollingTextVertical flipped className="text-4xl" text="IDK WHAT TO PUT BUT HERE WE GO -" />

        {/* Main app section */}
        {content}

        <RollingTextVertical className="text-4xl" text="WHEEEEEEEEEEEEEE -" />
      </div>
      <RollingText className="text-4xl border-t-2 border-border" text="GOOD DESIGN BY ME -" toRight />
    </div>
  );
}

function MainSection({ items, updateCategory, category, activeItem, selectItem }) {
  return (
    <div className="flex flex-col items-center overflow-auto size-full text-3xl">
      <Categories changeCategory={updateCategory} category={category} />
      <div className="flex flew-row w-full overflow-auto max-h-full h-full">
        <ItemList items={items} activeItem={activeItem} selectItem={selectItem} />
        <ItemInfo item={activeItem} />
        {/* <LoadingSpinner /> */}
      </div>
    </div>
  );
}
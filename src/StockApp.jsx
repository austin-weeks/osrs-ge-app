import React, { useEffect, useState } from "react";
import RollingText, { RollingTextVertical } from "./Components/RollingText";
import Categories from "./Components/Categories";
import ItemInfo from "./Components/ItemInfo";
import ItemList from "./Components/ItemList";
import LoadingSpinner from "./Components/LoadingSpinner";
import { loadFalls, loadMostTraded, loadMostValuable, loadRises } from "../API Calls/getCategories";


// let catgegories = 'rises' || 'falls' || 'most-valuable' || 'most-traded' || 'my-list';

export const appContext = React.createContext(null);

export default function StockApp() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currItems, setItems] = useState(null);
  const [currCategory, setCategory] = useState('rises');

  function updateCategory(updatedCategory) {
    if (currCategory === updatedCategory) return;

    setLoading(true);
    setSelectedItem(null);
    setCategory(updatedCategory);
    if (updatedCategory === 'rises') loadRises(loadItems);
    else if (updatedCategory === 'falls')  loadFalls(loadItems);
    else if (updatedCategory === 'most-valuable') loadMostValuable(loadItems);
    else if (updatedCategory === 'most-traded') loadMostTraded(loadItems);
    else if (updatedCategory === 'my-list') setItems({error: 'my-list not implemented'});
    else {
      console.error('updating category to invalid category');
    }
  }
  function loadItems(items) {
    setItems(items);
    setSelectedItem(items[0])
    setLoading(false);
  }

  useEffect(() => {
    loadRises(loadItems);
  }, [])


  let content = <MainSection />;
  if (loading) content = (
    <div className="size-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
  if (currItems?.error) content = 'error!';

  return (
    <div className="text-3xl max-h-screen h-screen w-screen overflow-auto flex flex-col items-center">
      <RollingText className="text-4xl h1 border-b-2 border-border" text="OLD SCHOOL RUNESCAPE GRAND EXCHANGE TRACKER -" />
      <div className="flex flex-row size-full overflow-auto">
        <RollingTextVertical flipped className="text-4xl" text="IDK WHAT TO PUT BUT HERE WE GO -" />

        {/* Main app section */}
        <appContext.Provider value={{
          currItems,
          currCategory,
          selectedItem,
          updateCategory,
          setSelectedItem
        }}>
          {content}
        </appContext.Provider>

        <RollingTextVertical className="text-4xl" text="WHEEEEEEEEEEEEEE -" />
      </div>
      <RollingText className="text-4xl border-t-2 border-border" text="GOOD DESIGN BY ME -" toRight />
    </div>
  );
}

function MainSection() {
  return (
    <div className="flex flex-col items-center overflow-auto size-full text-3xl">
      <Categories />
      <div className="flex flew-row w-full overflow-auto max-h-full h-full">
        <ItemList />
        <ItemInfo />
        {/* <LoadingSpinner /> */}
      </div>
    </div>
  );
}
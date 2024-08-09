import React, { useState } from "react";
import RollingText from "./Components/RollingText";
import Categories from "./Components/Categories";
import ItemInfo from "./Components/ItemInfo";
import ItemList from "./Components/ItemList";
import LoadingSpinner from "./Components/LoadingSpinner";

export default function StockApp() {
  const [category, setCategory] = useState(null);
  function updateCategory(category) {
    setCategory(category);
  }

  return (
    <div className="text-3xl max-h-screen w-screen flex flex-col items-center">
      <RollingText className="text-4xl pt-1" text="OLD SCHOOL RUNESCAPE PRICES" />
      <Categories activeCategory={category} changeCategory={updateCategory} />
      <div className="flex flew-row w-full h-full">
        <ItemList items={['','','','','','','','','','','','']} />
        <ItemInfo item={null} />
        <LoadingSpinner />
      </div>
    </div>
  );
}
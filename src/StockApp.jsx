import React, { useState } from "react";
import RollingText from "./Components/RollingText";
import Categories from "./Components/Categories";

export default function StockApp() {
  const [category, setCategory] = useState(null);
  function updateCategory(category) {
    setCategory(category);
  }

  return (
    <div className="text-3xl max-h-screen w-screen flex flex-col items-center">
      <RollingText className="text-4xl" text="OLD SCHOOL RUNESCAPE PRICES" />
      <Categories activeCategory={category} changeCategory={updateCategory} />
    </div>
  );
}
import React, { useContext, useEffect, useState } from "react";
import { RollingIconsVertical, RollingLogo, RollingWatchList } from "./Components/RollingText";
import Categories from "./Components/Categories";
import ItemInfo from "./Components/ItemInfo";
import ItemList from "./Components/ItemList";
import LoadingSpinner from "./Components/LoadingSpinner";
import { loadFalls, loadMostTraded, loadMostValuable, loadRises } from "../API Calls/getCategories";
import { getMyList } from "../API Calls/myList";
import SearchBox from "./Components/SearchBox";
import getSearchResults from "../API Calls/search";
import { initializeData } from "../API Calls/fetchItems";
import IntroPage from "./Components/IntroPages";


export const appContext = React.createContext(null);

export default function StockApp() {
  const [baseDataLoadCalled, setBaseDataLoadCalled] = useState(false);
  const [baseDataLoaded, setBaseDataLoaded] = useState(false);
  const [categoryPicked, setCategoryPicked] = useState(null);
  useEffect(() => {
    if (baseDataLoadCalled) return;
    setBaseDataLoadCalled(true);
    initializeData(() => {
      setBaseDataLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (baseDataLoaded && categoryPicked) {
      updateCategory(categoryPicked);
      return;
    }
  }, [categoryPicked, baseDataLoaded]);



  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currItems, setItems] = useState(null);
  const [currCategory, setCategory] = useState(null);
  const queryState = useState(null);

  function refreshCategory() {
    updateCategory(currCategory, true);
  }

  function updateCategory(updatedCategory, forceUpdate = false) {
    if (!forceUpdate && currCategory === updatedCategory) return;

    setLoading(true);
    setSelectedItem(null);
    setCategory(updatedCategory);
    if (updatedCategory === 'rises') loadRises(loadItems);
    else if (updatedCategory === 'falls') loadFalls(loadItems);
    else if (updatedCategory === 'most-valuable') loadMostValuable(loadItems);
    else if (updatedCategory === 'most-traded') loadMostTraded(loadItems);
    else if (updatedCategory === 'my-list') getMyList(loadItems);
    else if (updatedCategory === 'search') {
      setItems(null);
      setSelectedItem(null);
      setLoading(false);
    }
    else {
      console.error('updating category to invalid category');
    }
  }
  function loadItems(items) {
    setItems(items);
    setSelectedItem(items[0])
    setLoading(false);
  }
  function loadSearchResults(query) {
    setSelectedItem(null);
    getSearchResults(query, setItems);
  }

  let content = <MainSection />;
  if (!baseDataLoaded || !categoryPicked) content = <IntroPage categoryPicked={categoryPicked} setCategoryPicked={setCategoryPicked} />

  if (loading) content = (
    <div className="size-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
  if (currItems?.error) content = 'error!';

  return (
    <div className="text-3xl max-h-screen h-screen w-screen overflow-auto flex flex-col items-center">
      <RollingLogo className="border-b-2 border-border" toRight />
      <div className="flex flex-row size-full overflow-auto">
        <RollingIconsVertical flipped />

        {/* Main app section */}
        <appContext.Provider value={{
          currItems,
          currCategory,
          selectedItem,
          updateCategory,
          refreshCategory,
          setSelectedItem,
          loadSearchResults,
          queryState
        }}>
          {content}
        </appContext.Provider>

        <RollingIconsVertical />
      </div>
      <RollingWatchList className="border-t-2 border-border" />
    </div>
  );
}


function MainSection() {
  const { currCategory } = useContext(appContext);
  return (
    <div className="flex flex-col items-center p-1 gap-0.5 sm:gap-1 overflow-auto size-full">
      <Categories />
      <div className="flex flew-row w-full gap-1 sm:gap-1.5 overflow-auto max-h-full h-full">
        <div className="flex flex-col gap-1 
          w-[7rem] sm:w-[11rem] md:w-[13rem] lg:w-[16rem] xl:w-[19rem]
          overflow-auto flex-shrink-0"
        >
          {currCategory === 'search' &&
            <SearchBox />
          }
          <ItemList />
        </div>
        <ItemInfo />
        {/* <LoadingSpinner /> */}
      </div>
    </div>
  );
}

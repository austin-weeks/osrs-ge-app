import React, { useContext, useEffect, useRef, useState } from "react";
import { appContext } from "../StockApp";

export default function SearchBox() {
  const { loadSearchResults, queryState } = useContext(appContext);
  const [currQuery, setCurrQuery] = queryState;
  const inputRef = useRef(null);

  useEffect(() => {
    if (currQuery != null) loadSearchResults(currQuery);
    if (inputRef.current != null) {
      inputRef.current.value = currQuery;
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current == null) return;
    function onSearch(e) {
      if (e.key !== 'Enter') return;
      setCurrQuery(inputRef.current.value);
      loadSearchResults(inputRef.current.value);
    }
    inputRef.current.addEventListener('keydown', onSearch);
    return () =>{
      if (inputRef.current == null) return;
      inputRef.current.removeEventListener('keydown', onSearch);
    }
  }, [inputRef]);

  return (
    <div className="w-full max-h-full overflow-auto h-12 sm:h-14 flex-shrink-0">
      <input ref={inputRef} type="text"
        className="text-black size-full px-2 bg-stone-300 rounded-sm
          text-base sm:text-3xl"
        placeholder="Search..."
      />
    </div>
  );
}
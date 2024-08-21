import getBase from "./fetchItems";

export default async function getSearchResults(query, setItems) {
  if (!query) return;
  
  const items = await getBase();
  const searchStr = query.toLowerCase();
  const results = items.filter(item => item.name.toLowerCase().includes(searchStr));
  console.log(results);
  setItems(results);
}

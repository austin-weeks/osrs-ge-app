import getBase from "./fetchItems";

const listKey = 'watchlist-ids';
let myListItemEntries = null;

export async function getMyList(updateFunction, forceReload = false) {
  if (!forceReload && myListItemEntries != null) {
    updateFunction(myListItemEntries);
    return;
  }

  // localStorage.clear()
  const mapped = await getBase();
  const itemIDs = getMyListItemIDs();

  myListItemEntries = [];
  for (const id of itemIDs) {
    const match = mapped.find(item => item.id === id);
    match.isMyListItem = true;
    myListItemEntries.push(match);
  }

  updateFunction(myListItemEntries);
}

let myListIDs = null;
const defaultListIDs = [
  //Dragon Scimitar
  4587,
  //Torva full helm
  26382,
  //Dragon Platebody
  21892,
  //BluePartyhat
  1042,
  //Bond
  13190,
  //Blood rune
  565
];

function getMyListItemIDs() {
  myListIDs = localStorage.getItem(listKey);
  if (myListIDs == null) {
    return myListIDs = defaultListIDs;
  } else if (!myListIDs) {
    return [];
  } else {
    return myListIDs.split(',').map(id => parseInt(id));
  }
}

let refreshRollingList;
export function subscribeToListUpdates(callback) {
  refreshRollingList = callback;
}
async function saveList(idsArr, updateFunction) {
  myListIDs = idsArr;
  try {
    localStorage.setItem(listKey, idsArr.toString());
  } catch (e) {
    console.log(e);
    return;
  }
  if (updateFunction != null) getMyList(updateFunction, true);
  if (refreshRollingList) refreshRollingList();
}

export function addItemToMyList(item, updateFunction) {
  item.isMyListItem = true;
  const itemIds = getMyListItemIDs();
  const newItemIds = itemIds.slice();
  newItemIds.push(item.id);
  saveList(newItemIds, updateFunction ? updateFunction : () => {});
}

const emptyIDs = [1931, 1961];

export function removeItemFromMyList(item, updateFunction) {
  item.isMyListItem = false;
  const itemIds = getMyListItemIDs();
  const newItemIds = itemIds.filter(id => id !== item.id);
  // if (newItemIds.length === 0) {
  //   if (item.id === emptyIDs[0]) newItemIds.push(emptyIDs[1]);
  //   else newItemIds.push(emptyIDs[0]);
  // }
  saveList(newItemIds, updateFunction);
}


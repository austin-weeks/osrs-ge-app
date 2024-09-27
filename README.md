# Old School Runescape Grand Exchange Tracker
Provides similar functionality to the grand exchange page of the offical OSRS site, but with a more concise UI and extra features, including the ability to add items to a personal watch-list.
This app is primarily meant to be a personal portfolio project, but it is free to use for the OSRS community!

View the app [here!](https://austin-weeks.github.io/osrs-ge-app)

<a href="https://austin-weeks.github.io/osrs-ge-app">
  <picture><img src="/preview.png" alt="Preview of the price-tracker."></picture>
</a>

## API Implementation Issues
The app pulls data from the [OSRS Wiki Real-time Prices API](https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices). The API is a partnership between the Old School Wiki and [RuneLite](https://runelite.net/), and tracks item transactions made through the RuneLite client.

The API's `/mapping` and `/latest` endpoints list information for each game item. However, these lists don't always include all the required data points, so it's sometimes necessary to make a call to `/timeseries?id={itemID}` for each of the items with missing data. This means the app needs to make 100-200 total API calls on startup, which resulted in load times of 5-15 seconds with my initial implementation.

Small optimzations helped improved this, such as using a binary search to match item ID's rather than the built in `Array.find()` method. However, the main optimzation came from using `Promise.all()` to simultaneously fetch the missing data. After implementing these improvements, the app now loads in less than a second!

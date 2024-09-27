# Old School Runescape Grand Exchange Tracker
Provides similar functionality to the grand exchange page of the offical OSRS site, but with a more concise UI and extra features, including the ability to add items to a personal watch-list.
This app is primarily meant to be a personal portfolio project, but it is free to use for the OSRS community!

View the app [here!](https://austin-weeks.github.io/osrs-ge-app)

<a href="https://austin-weeks.github.io/osrs-ge-app">
  <picture><img src="/preview.png" alt="Preview of the price-tracker."></picture>
</a>

## API Usage
This app primarily pulls data from the [OSRS Wiki Real-time Prices API](https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices). The API is a partnership between the Old School Wiki and [RuneLite](https://runelite.net/) and tracks transactions by players using the RuneLite client. The API does not provide convenient endpoints for all of the data needed for this app, so a rather creative approach was taken to balance efficiency and price accuracy.

# Neighborhood Map - Café list

Final project for Udacity's Front-end Developer Nanodegree.

**Online Access:** [https://louisberns.github.io/neighborhood-map/](https://louisberns.github.io/neighborhood-map/)

**Download:** `$ git clone https://github.com/louisberns/neighborhood-map.git`
____

## Content
List of coffee places displayed with [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/), fetching data from [Foursquare Places API](https://developer.foursquare.com/places-api) to populate the `google.maps.infoWindow`.

### Application
Making use of the MVVM pattern with [Knockout.JS](http://knockoutjs.com/).
- List of places within a toggle-able menu
- Center the map and display info window when marker or item of the list is chose
- Search input with instant filter for markers displayed on map

### Google Maps API
- Added animations to markers on the first load
- Animate markers when chosen or clicked
- Display info windows with information about the coffee places

### Foursquare API
- Fetching data asynchronously from foursquare API using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Retrieving data from fetch request and display on info window

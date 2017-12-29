/*
 *  Neightborhood Map Project - Udacity Front-end Nanodegree
 *  Use Google Maps API and Knockout.js to display locations in a map and give a menu list with a filter
 */

// APPLICATION MVVM HANDLERS
const locs = [
		{id: 0, title: "France", location: {lat: 46.727106, lng: 2.465734}, info: "<div>Some really nice text on the info window</div>"},
		{id: 1, title: "Amsterdam", location: {lat: 52.358717, lng: 4.868406}, info: "<div>Some really nice text on the info window</div>"},
		{id: 2, title: "Prage", location: {lat: 50.071045, lng: 14.430600}, info: "<div>Some really nice text on the info window</div>"},
		{id: 3, title: "Dublin", location: {lat: 53.324597, lng: -6.194791}, info: "<div>Some really nice text on the info window</div>"},
		{id: 4, title: "Berlin", location: {lat: 52.528739, lng: 13.454198}, info: "<div>Some really nice text on the info window</div>"}
]

const viewModel = {
	self: this,
	query: ko.observable(''),
	menuPane: ko.observable(null),
	locations: ko.observableArray(),
	windowKo: ko.observable(window.innerWidth),

	toggleMenu: () => {
		if (viewModel.menuPane() === null) {
			viewModel.menuPane("menu-close");
		} else {
			viewModel.menuPane(null);
		}
	},
	setCenterMap: loc => { map.setCenter(loc); },
	showInfoWindow: (id) => {
		infoWindow.map(i => {
			i.setMap(null);
		});
		infoWindow[id].open(map, markers[id]);
	},
	showMarkerWindow: (id, loc) => {
		viewModel.setCenterMap(loc);
		viewModel.showInfoWindow(id);
	}
};

// Copy the value of locs to observableArray
locs.map(l => viewModel.locations().push(l));

// Check the viewport size to toggle menu on mobile
if (viewModel.windowKo() <= 500) {
	viewModel.toggleMenu()
}

// Listen to the search input query and show the results
viewModel.searchList = ko.computed(() => {
	let q = viewModel.query();

	if (!q) {
		if (document.readyState === "complete") {
			markers.map(m => { m.setMap(map); })
		}
		return viewModel.locations();
	} else {
		return ko.utils.arrayFilter(viewModel.locations(), item => {
			return item.title.toLowerCase().indexOf(q) >= 0;
		});
	}
});

viewModel.filterMarkers = ko.computed(() => {
	var m = viewModel.searchList();

	if (!m) {
		return 
	} else {
		if (document.readyState === "complete") {
			return m.filter(item => {
				console.log(item)
				return markers[item.id].setMap(map);
			});
		}
	}
});

// Listen for resize window to enable menu button
window.addEventListener('resize', () => {
	if (window.innerWidth <= 500) {
		viewModel.menuPane("menu-close");
	} else { return }
});

// GOOGLE MAPS API
var map,
		markers = [],
		infoWindow = [];

// Initialize map on load
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: viewModel.locations()[0].location,
		zoom: 5,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		}
	});

	// Responsive map by resizing window
  google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
  });

	marker = new google.maps.Marker({
		position: viewModel.locations()[0].location,
		title: 'Hello World!'
	});

	// Set initial MARKERS to the map
	// use marker.setMap(map) to add one marker
	viewModel.locations().map(item => {
		let m = new google.maps.Marker({
			id: item.id,
			position: item.location,
			title: item.title,
		});

		let iW = new google.maps.InfoWindow({
			id: item.id,
			content: item.info,
			position: m.position
		});

		m.setMap(map);

		// Populate MARKERS and INFOWINDOW arrays
		markers.push(m);
		infoWindow.push(iW);
	})

	// Add listener for open infoWindow and center map to marker on CLICK
	markers.map(m => {
		m.addListener('click', target => {
			viewModel.showMarkerWindow(m.id, m.position);
		});
	});

	// Aplly bindings to Knockout as soon as map is loaded
	ko.applyBindings(viewModel);
}

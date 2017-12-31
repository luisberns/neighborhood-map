/*
 *  Neightborhood Map Project - Udacity Front-end Nanodegree
 *  Use Google Maps API and Knockout.js to display locations in a map and give a menu list with a filter
 */

// APPLICATION MVVM HANDLERS
const locs = [
		{id: 0, title: "Hardware Société", placeid: "ChIJpZjaLl1u5kcR0yN4kIoECqw", location: {lat: 48.8868764, lng: 2.344576800000027}, address: null, info: "<div>Some really nice text on the info window</div>"},
		{id: 1, title: "La Caféothèque", placeid: "ChIJUZd-NP1x5kcRQhl91RYHxRs", location: {lat: null, lng: null}, address: null, info: "<div>Some really nice text on the info window</div>"},
		{id: 2, title: "Fondation Café", placeid: "ChIJEfw8-gVu5kcRCoObsIY7C1I", location: {lat: null, lng: null}, address: null, info: "<div>Some really nice text on the info window</div>"},
		{id: 3, title: "Bagelstein", placeid: "ChIJswHuekdu5kcR6xgWWkc5aPc", location: {lat: null, lng: null}, address: null, info: "<div>Some really nice text on the info window</div>"},
		{id: 4, title: "CRAFT", placeid: "ChIJLeUyggtu5kcRNUgCe7GhauQ", location: {lat: null, lng: null}, address: null, info: "<div>Some really nice text on the info window</div>"}
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
	showInfoWindow: id => {
		infoWindow.map(i => {
			i.setMap(null);
		});
		infoWindow[id].open(map, markers[id]);
	},
	animateMarker: id => {
		markers[id].setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(() => {
			markers[id].setAnimation(null);
		}, 1400)
	},
	showMarkerWindow: (id, loc) => {
		viewModel.setCenterMap(loc);
		viewModel.showInfoWindow(id);
		viewModel.animateMarker(id);
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
			for (let x = 0; x < markers.length; x++) {
				markers[x].setMap(null);
			}
			return m.filter(item => {
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
		geocoder,
		markers = [],
		infoWindow = [];

// Initialize map on load
function initMap() {
	geocoder = new google.maps.Geocoder();

	// Responsive map by resizing window
  google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
  });

	// Set map after the geocode requests
	map = new google.maps.Map(document.getElementById('map'), {
		center: viewModel.locations()[0].location,
		zoom: 5,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		}
	});
}

function loadMap() {
	// Set initial MARKERS to the map
	// use marker.setMap(map) to add one marker
	viewModel.locations().map(item => {
		let m = new google.maps.Marker({
			id: item.id,
			position: item.location,
			title: item.title,
			animation: google.maps.Animation.DROP
		});

		let iW = new google.maps.InfoWindow({
			id: item.id,
			content: item.info + '<div>' + item.address + '</div>',
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
};

// Get position and address info from geocoder
const gCode = new Promise ((resolve, reject) => {
	let resultsArray = [];
	window.setTimeout(() => {
		viewModel.locations().map(item => {
			geocoder.geocode({'placeId' : item.placeid}, (results, status) => {
				if (status === 'OK') {
					console.log(results);
					resultsArray.push(results);
				} else {
					window.alert('Geocoder failed due to: ' + status);
					reject(Error(status));
				}
			});
		});
		resolve(resultsArray);
	}, 1000);
});


// TODO: fix the damn promise info request
var han,
		hanT;
gCode.then(results => {
	console.log(results);
	han = results;
	viewModel.locations().map(item => {
		hanT = item;
		if (results[item.id] !== null) {
			item.location.lat = results[item.id][0].geometry.location.lat();
			item.location.lng = results[item.id][0].geometry.location.lng();
			item.address = results[item.id][0].formatted_address;
			return results;
		} else {
			window.alert('No results found');
		}
	})
})
.catch(err => console.log(err))
.then(() => loadMap());

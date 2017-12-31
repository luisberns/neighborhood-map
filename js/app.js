/*
 *  Neightborhood Map Project - Udacity Front-end Nanodegree
 *  Use Google Maps API and Knockout.js to display locations in a map and give a menu list with a filter
 */

// APPLICATION MVVM HANDLERS
const locs = [
		{id: 0, title: "Hardware Société", placeid: "ChIJpZjaLl1u5kcR0yN4kIoECqw", fsId: "5710c77a498e3021c0641aa9", location: {lat: 48.8868764, lng: 2.344576800000027}, address: "10 Rue Lamarck, 75018 Paris, France", info: "<div>Some really nice text on the info window</div>"},
		{id: 1, title: "La Caféothèque", placeid: "ChIJUZd-NP1x5kcRQhl91RYHxRs", fsId: "4bbb21a91261d13aa847eb98", location: {lat: 48.8544402, lng: 2.3557431000000406}, address: "52 Rue de l'Hôtel de ville, 75004 Paris, France", info: "<div>Some really nice text on the info window</div>"},
		{id: 2, title: "Fondation Café", placeid: "ChIJEfw8-gVu5kcRCoObsIY7C1I", fsId: "527e5b6f11d2c8ad2cf37a22", location: {lat: 48.86570700000001, lng: 2.3615029999999706}, address: "16 Rue Dupetit-Thouars, 75003 Paris, France", info: "<div>Some really nice text on the info window</div>"},
		{id: 3, title: "Bagelstein", placeid: "ChIJswHuekdu5kcR6xgWWkc5aPc", fsId: "546dd0fc498e1597e843450f", location: {lat: 48.8770224, lng: 2.338313400000061}, address: "8 Rue Saint-Lazare, 75009 Paris, France", info: "<div>Some really nice text on the info window</div>"},
		{id: 4, title: "CRAFT", placeid: "ChIJLeUyggtu5kcRNUgCe7GhauQ", fsId: "50420756e4b0047a41a495fc", location: {lat: 48.87322330000001, lng: 2.363122100000055}, address: "24 Rue des Vinaigriers, 75010 Paris, France", info: "<div>Some really nice text on the info window</div>"}
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
		let item = viewModel.locations()[id];

		infoWindow.map(i => {
			i.setMap(null);
		});
		infoWindow[id].setContent('<div>' + item.fsContent + '</div>' + item.info + '<div><strong>Address: </strong>' + item.address + '</div>')
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

/*
 * Resquest Foursquare API data
 */
function foursquareRequest() {
	const client_id = 'O0R3FG5EKQ0JW4ND4DDLEBU11VOIKVNAKLTJPHY4M0A55S0Q',
				client_secret = '1B44WB2ZAJZAU3X1ZFIZFMEXEJ2PVGCQWYWJNMTYQTYUJECF';

	viewModel.locations().map(item => {
		let i = item.fsId;
		console.log(i);
		fetch('https://api.foursquare.com/v2/venues/' + i + '?ll=' + viewModel.locations()[0].location.lat + ',' + viewModel.locations()[0].location.lng + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20200101')
		.then(resolve => {
			console.dir(resolve);

			resolve.json().then(data => {
				console.log(data);

				let h = data.response.venue.hours.status;
				item.fsContent = h;
			});


			console.log(item);
		}).catch(err => console.log(err));
	});
};

foursquareRequest();

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

// Filter markers as the user types
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
		zoom: 13,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		}
	});
	loadMap();
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

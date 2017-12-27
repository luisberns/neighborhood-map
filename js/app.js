/*
 * Neightborhood Map Project - Udacity Front-end Nanodegree
 * Use Google Maps API and Knockout.js to display locations in a map and give a menu list with a filter
 */

// APPLICATION MVVM HANDLERS
const model = {
	locations: [
		{title: "Someplace", location: {lat: -20, lng: 20}},
		{title: "Someplace", location: {lat: -20, lng: 20}},
		{title: "Someplace", location: {lat: -20, lng: 20}},
		{title: "Someplace", location: {lat: -20, lng: 20}},
		{title: "Someplace", location: {lat: -20, lng: 20}}
	],
	marker: {

	}
};

const viewModel = {

};

const view = {

};


// GOOGLE MAPS API
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: model.locations[0].location,
		zoom: 15
	});
}
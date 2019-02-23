// Global Variables
var jsonForecast = null;
var jsonWeather = null;
var results = document.getElementById("myGeolocation"), posOptions={ enableHighAccuracy: false, timeout: 5000, maximumAge: 0};

// API token goes here
var key = '0f5ed629c92c2c';

// Add layers that we need to the map
var streets = L.tileLayer.Unwired({key: key, scheme: "streets"});

// Initialize the map
var map = L.map('map', {
    center: [39.73, -104.99], // Map loads with this location as center
    zoom: 14,
    scrollWheelZoom: false,
    layers: [streets] // Show 'streets' by default
});

// Marker
var marker = L.marker([39.73, -104.99]).addTo(map);

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({
    "Streets": streets
}).addTo(map);

// Onload
document.addEventListener("DOMContentLoaded", function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( geolocationSuccess, geolocationFailure, posOptions);
    }
    else {
        //results.innerHTML = "This browser doesn't support geolocation.";
    }

    // Drag and Drop Box
    dropBox = document.getElementById("drop-box");
    dropBox.ondragenter = ignoreDrag;
    dropBox.ondragover = ignoreDrag;
    dropBox.ondrop = drop;

    callAPIs();
});

// Drag and Drop Functions
function ignoreDrag(e) {
    e.stopPropagation();
    e.preventDefault();
}
function drop(e) {
    e.stopPropagation(); // Cancel this event for everyone else.
    e.preventDefault();
    var data = e.dataTransfer; // Get the dragged-in files.
    var files = data.files;
    handleFiles(files); // Pass them to the file-processing function.
}
function handleFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        // When this event fires, the data is ready.
        // Copy it to a <div> on the page.
        // var output = document.getElementById("fileOutput");
        // output.textContent = e.target.result;
        console.log(e.target.result);
    };
    reader.readAsText(file);
}

function callAPIs() {
/*     var xmlhttp1 = new XMLHttpRequest();
    var xmlhttp2 = new XMLHttpRequest();
    var jsonURL = ""; */

    /* // fires when response is recieved.
    xmlhttp1.onreadystatechange = function() {
        if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
            jsonWeather = JSON.parse(xmlhttp1.responseText);
            if (jsonForecast != null) {
                onCallsReady();
            }
        }
    }
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            jsonForecast = JSON.parse(xmlhttp2.responseText);
            if (jsonWeather != null) {
                onCallsReady();
            }
        }  
    } */

    /* // Send API calls.
    jsonURL = "https://api.openweathermap.org/data/2.5/weather?q=" + "&units=" + "&APPID=4c06bfe661f0b300a0f60bc62534ad7d";
    xmlhttp1.open("GET", jsonURL, true);
    xmlhttp1.send();

    jsonURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + "&units=" + "&APPID=4c06bfe661f0b300a0f60bc62534ad7d";
    xmlhttp2.open("GET", jsonURL, true);
    xmlhttp2.send(); */
}

/* Updates when api responses are recieved. */
function onCallsReady() {
}

function geolocationSuccess(position) {
    var lat = position.coords.latitude,
    lng = position.coords.longitude,
    acc = position.coords.accuracy;

    console.log("lat:" + lat);
    console.log("long: " + lng);

    setMapPosition(position);
}
function geolocationFailure(error) {
    console.log("FAILED");
}

function setMapPosition(position) {
    // Moves map
    map.setView([position.coords.latitude, position.coords.longitude], 13);
    marker.setLatLng([position.coords.latitude, position.coords.longitude]);
}

// Upper First.
// Capitalizes the first letters of each word in a string.
/* function toUpperFirst(str) {
    return str.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
} */


/* function setWeatherPanels(day) {
    if (day == 0) {
        document.getElementById("panel-clouds").innerHTML = jsonWeather.clouds.all + "%";
        document.getElementById("panel-wind-speed").innerHTML = Math.round(jsonWeather.wind.speed) + "m/s";
        document.getElementById("panel-wind-dir").innerHTML = Math.round(jsonWeather.wind.deg) + "°";
        document.getElementById("panel-pressure").innerHTML = Math.round(jsonWeather.main.pressure) + "hPa";
        document.getElementById("panel-humidity").innerHTML = jsonWeather.main.humidity + "%";
    }
} */
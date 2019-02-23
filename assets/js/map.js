// Global Variables
var jsonCurr = null;
var jsonFile = null;
var positionCurr = new Array(2);
var positionFile = null;
var posOptions = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 };
var latlngs = [[0, 0], [0, 0]];
var distance = 0;

// Map
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
var markerCurr = L.marker([0, 0]).addTo(map);
var markerFile = L.marker([0, 0]).addTo(map);

// Path Polyline
var polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({"Streets": streets}).addTo(map);

// Map On-Click Handler
function onMapClick(e) {
    positionCurr[0] = e.latlng.lat;
    positionCurr[1] = e.latlng.lng;
    callAPI("curr");
}
map.on('click', onMapClick);

// Onload
document.addEventListener("DOMContentLoaded", function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure, posOptions);
    }
    else {
        alert("This browser doesn't support geolocation.");
    }

    // Drag and Drop Box
    dropBox = document.getElementById("drop-box");
    dropBox.ondragenter = ignoreDrag;
    dropBox.ondragover = ignoreDrag;
    dropBox.ondrop = drop;

    document.getElementById("panel-curr").style.display = "none";
    document.getElementById("panel-file").style.display = "none";
});
// API Call Handler
function callAPI(mode) {
    var xmlhttp = new XMLHttpRequest();
    var jsonURL = "";

    // fires when response is recieved.
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (mode == "curr") {
                jsonCurr = JSON.parse(xmlhttp.responseText);
                document.getElementById("panel-curr").style.display = "contents";
                // console.log(jsonCurr);
            }
            if (mode == "file") {
                jsonFile = JSON.parse(xmlhttp.responseText);
                document.getElementById("panel-file").style.display = "contents";
                // console.log(jsonFile);
            }
            haversineFormula();
            setLocationPanels();
            setMap();
        }
    }

    // Send API calls.
    if (mode == "curr") {
        jsonURL = "https://us1.locationiq.com/v1/reverse.php?key=" + key + "&lat=" + positionCurr[0] + "&lon=" + positionCurr[1] + "&format=json";
    }
    if (mode == "file") {
        jsonURL = "https://us1.locationiq.com/v1/reverse.php?key=" + key + "&lat=" + positionFile[0] + "&lon=" + positionFile[1] + "&format=json";
    }
    xmlhttp.open("GET", jsonURL, true);
    xmlhttp.send();
}

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
        positionFile = e.target.result.split(", ");
        callAPI("file");
    };
    reader.readAsText(file);
}

// GeoLocation Handlers
function geolocationSuccess(position) {
    positionCurr[0] = position.coords.latitude;
    positionCurr[1] = position.coords.longitude;

    // Moves map.
    map.setView([positionCurr[0], positionCurr[1]], 13);
    callAPI("curr");
}
function geolocationFailure(error) {
    console.log("This browser doesn't support geolocation.");
}

// Set Map
function setMap() {
    // Moves marker.
    markerCurr.setLatLng([positionCurr[0], positionCurr[1]]);

    if (positionFile != null) {
        latlngs = [
            [positionCurr[0], positionCurr[1]],
            [positionFile[0], positionFile[1]]
        ];
        markerFile.setLatLng([positionFile[0], positionFile[1]]);
        map.fitBounds(latlngs);
    }
}

// Set Location Panel Details
function setLocationPanels() {
    document.getElementById("panel-lat1").innerHTML = jsonCurr.lat;
    document.getElementById("panel-lon1").innerHTML = jsonCurr.lon;
    if (jsonCurr.address.hasOwnProperty('name')) {
        document.getElementById("panel-name1").innerHTML = jsonCurr.address.name;
    } else {
        document.getElementById("panel-name1").innerHTML = jsonCurr.address.road;
    }
    document.getElementById("panel-city1").innerHTML = jsonCurr.address.city;
    document.getElementById("panel-state1").innerHTML = jsonCurr.address.state;
    document.getElementById("panel-country1").innerHTML = jsonCurr.address.country;

    if (jsonFile != null) {
        document.getElementById("panel-lat2").innerHTML = jsonFile.lat;
        document.getElementById("panel-lon2").innerHTML = jsonFile.lon;
        if (jsonFile.address.hasOwnProperty('name')) {
            document.getElementById("panel-name2").innerHTML = jsonFile.address.name;
        } else {
            document.getElementById("panel-name2").innerHTML = jsonFile.address.road;
        }
        document.getElementById("panel-city2").innerHTML = jsonFile.address.city;
        document.getElementById("panel-state2").innerHTML = jsonFile.address.state;
        document.getElementById("panel-country2").innerHTML = jsonFile.address.country;
    }
}

// Haversine Formula Worker
function haversineFormula() {
    if(positionFile != null) {
        function handleWorkerError(event) {
            console.warn('Error in web worker: ', event.message);
        }
        function handleWorkerMessage(event) {
            console.log('Distance: ' + event.data);
            distance = event.data;
            polyline.unbindTooltip();
            polyline.setLatLngs(latlngs);
            polyline.bindTooltip((Math.round(distance * 10) / 10 ) + "km", {permanent: true, direction:"center", className: "tooltip"});

            myNewWorker.terminate(); // Kill worker when calculation is complete.
        }

        // Create a new worker.
        // Workaround to allow local workers on Google Chrome.
        var blob = new Blob(["onmessage = function(e){" + haversine_formula.toString() + "haversine_formula(e);}"]);
        var blobURL = window.URL.createObjectURL(blob);
        var myNewWorker = new Worker(blobURL);
        // var myNewWorker = new Worker('assets/js/wworker.js');

        // Register error and message event handlers on the worker.
        myNewWorker.addEventListener('error', handleWorkerError);
        myNewWorker.addEventListener('message', handleWorkerMessage);

        myNewWorker.postMessage([positionCurr[0], positionCurr[1], positionFile[0], positionFile[1]]);
    }
}
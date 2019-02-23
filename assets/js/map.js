// Global Variables
var jsonCurr = null;
var jsonFile = null;
var positionCurr = new Array(2);
var positionFile = null;
var posOptions = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};

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
var markerCurr = L.marker([39.73, -104.99]).addTo(map);
var markerFile = L.marker([39.73, -104.99]).addTo(map);

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({"Streets": streets}).addTo(map);

function onMapClick(e) {
    positionCurr[0] = e.latlng.lat;
    positionCurr[1] = e.latlng.lng;

    callAPI("curr");
    setMap();
    haversineFormula();
}

map.on('click', onMapClick);

// Onload
document.addEventListener("DOMContentLoaded", function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure, posOptions);
    }
    else {
        //results.innerHTML = "This browser doesn't support geolocation.";
    }

    // Drag and Drop Box
    dropBox = document.getElementById("drop-box");
    dropBox.ondragenter = ignoreDrag;
    dropBox.ondragover = ignoreDrag;
    dropBox.ondrop = drop;
});
function callAPI(mode) {
    var xmlhttp = new XMLHttpRequest();
    var jsonURL = "";

    // fires when response is recieved.
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (mode == "curr") {
                jsonCurr = JSON.parse(xmlhttp.responseText);
                setLocationPanels();
                console.log(jsonCurr);
            }
            if (mode == "file") {
                jsonFile = JSON.parse(xmlhttp.responseText);
                setLocationPanels();
                console.log(jsonFile);
            }
        }
    }

    // Send API calls.
    if (mode == "curr") {
        jsonURL = "https://us1.locationiq.com/v1/reverse.php?key=" + key + "&lat=" + positionCurr[0] + "&lon=" + positionCurr[1] + "&format=json";
    }
    if (mode == "file") {
        jsonURL = "https://us1.locationiq.com/v1/reverse.php?key=" + key + "&lat=" + positionFile[0] + "&lon=" + positionFile[1] + "&format=json";
    }
    console.log(jsonURL);
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
        setMap();
        haversineFormula();
        console.log(positionFile[0] + ", " + positionFile[1]);
    };
    reader.readAsText(file);
}

function geolocationSuccess(position) {
    positionCurr[0] = position.coords.latitude;
    positionCurr[1] = position.coords.longitude;
    callAPI("curr");
    setMap();
}
function geolocationFailure(error) {
    console.log("FAILED");
}

function setMap() {
    // Moves map.
    map.setView([positionCurr[0], positionCurr[1]], 13);
    // Moves marker.
    markerCurr.setLatLng([positionCurr[0], positionCurr[1]]);

    if (positionFile != null) {
        markerFile.setLatLng([positionFile[0], positionFile[1]]);
        map.fitBounds([
            [positionCurr[0], positionCurr[1]],
            [positionFile[0], positionFile[1]]
        ]);
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
        console.log('Message received from worker: ' + event.data);
    }

    // Create a new worker.
    var myNewWorker = new Worker('assets/js/wworker.js');

    // Register error and message event handlers on the worker.
    myNewWorker.addEventListener('error', handleWorkerError);
    myNewWorker.addEventListener('message', handleWorkerMessage);

    myNewWorker.postMessage([positionCurr[0], positionCurr[1], positionFile[0], positionFile[1]]);
    }
}
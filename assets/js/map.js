// Global Variables
var jsonResults = [];
var positions = [];
var posOptions = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 };

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
// Polylines
var polylines = [];

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({"Streets": streets}).addTo(map);

// Map On-Click Handler
function onMapClick(e) {
    var latlon = [e.latlng.lat, e.latlng.lng];
    positions[0] = latlon;
    markerCurr.setLatLng(latlon); // Moves marker.
    setLines();
    callAPI(latlon, "update");
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
});
// API Call Handler
function callAPI(latlng, mode) {
    var xmlhttp = new XMLHttpRequest();
    var jsonURL = "";

    // fires when response is recieved.
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (mode == "update") {
                jsonResults[0] = JSON.parse(xmlhttp.responseText);
                setLocationPanels("update");
            }
            if (mode == "push") {
                jsonResults.push(JSON.parse(xmlhttp.responseText));
                setLocationPanels("push");
            }
        }
    }

    // Send API calls.
    jsonURL = "https://us1.locationiq.com/v1/reverse.php?key=" + key + "&lat=" + latlng[0] + "&lon=" + latlng[1] + "&format=json";
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
        var positionString = e.target.result.split("\n");
        for (i = 0; i < positionString.length; i++) {
            // Parse and push location coodinates.
            var positionArray = positionString[i].split(", ");
            positionArray[0] = Number(positionArray[0]);
            positionArray[1] = Number(positionArray[1]);
            positions.push(positionArray);
            
            map.fitBounds(positions); // Reposition map.
            L.marker([positions[i + 1][0], positions[i + 1][1]]).addTo(map); // Add markers.
            pushTemplate((i + 2)); // Push location detail template.

            var delayInMilliseconds = 1000; //1 second
            setTimeout(function(j) {
                callAPI([positions[j + 1][0], positions[j + 1][1]], "push"); // Call API.
            }, delayInMilliseconds*i, i);
        }
        setLines(); // Set lines/
    };
    reader.readAsText(file);
}

// GeoLocation Handlers
function geolocationSuccess(position) {
    positions.push([position.coords.latitude, position.coords.longitude]);
    map.setView([positions[0][0], positions[0][1]], 13); // Moves map.
    markerCurr.setLatLng([positions[0][0], positions[0][1]]); // Creates marker.
    pushTemplate(1); // Push location detail template.
    callAPI(positions[0], "push"); // Call api.
}
function geolocationFailure(error) {
    console.log("This browser doesn't support geolocation.");
}

// Set Location Panel Details
function setLocationPanels(mode) {
    var i = 0;
    if (mode == "push") {
        i = (jsonResults.length - 1);
    }
    
    document.getElementsByClassName("panel-lat")[i].innerHTML = jsonResults[i].lat;
    document.getElementsByClassName("panel-lon")[i].innerHTML = jsonResults[i].lon;
    if (jsonResults[i].address.hasOwnProperty('name')) {
        document.getElementsByClassName("panel-name")[i].innerHTML = jsonResults[i].address.name;
    } else {
        document.getElementsByClassName("panel-name")[i].innerHTML = jsonResults[i].address.road;
    }
    document.getElementsByClassName("panel-city")[i].innerHTML = jsonResults[i].address.city;
    document.getElementsByClassName("panel-state")[i].innerHTML = jsonResults[i].address.state;
    document.getElementsByClassName("panel-country")[i].innerHTML = jsonResults[i].address.country;
}

// Set Lines and Distance
function setLines() {
    // Clear all lines.
    for(i = 0; i < polylines.length; i++) {
        map.removeLayer(polylines[i]);
    }
    polylines = [];

    // Create new lines.
    for(i = 1; i < positions.length; i++) {
        polylines.push(L.polyline([positions[0], [positions[i][0], positions[i][1]]], {color: 'blue'}).addTo(map));
        haversineFormula(i);
    }
}

// Haversine Formula Worker
function haversineFormula(i) {
    function handleWorkerError(event) {
        console.warn('Error in web worker: ', event.message);
    }
    function handleWorkerMessage(event) {
        console.log('Distance: ' + event.data[0]);
        var distance = event.data[0];
        polylines[event.data[1]].unbindTooltip();
        polylines[event.data[1]].bindTooltip((Math.round(distance * 10) / 10 ) + "km", {permanent: true, direction:"center", className: "tooltip"});
        //myNewWorker.terminate(); // Kill worker when calculation is complete.
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

    myNewWorker.postMessage([positions[0], [positions[i][0], positions[i][1]], (i - 1)]);
}
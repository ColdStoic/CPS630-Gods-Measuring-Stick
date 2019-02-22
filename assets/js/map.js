// Global Variables.
var jsonForecast = null;
var jsonWeather = null;
var results=document.getElementById("myGeolocation"), posOptions={ enableHighAccuracy: false, timeout: 5000, maximumAge: 0};

// Onload.
document.addEventListener("DOMContentLoaded", function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( geolocationSuccess, geolocationFailure, posOptions);
    }
    else {
        //results.innerHTML = "This browser doesn't support geolocation.";
    }

    callAPIs();
});

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
}
function geolocationFailure(error) {
    console.log("FAILED");
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
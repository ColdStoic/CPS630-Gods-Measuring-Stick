
// This formula was found on StackOverflow..
function haversine_formula(e) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = e.data[0];
    var lat1 = e.data[1];

    var lon2 = e.data[2];
    var lat2 = e.data[3];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    self.postMessage(d);
}

// Workaround to allow local workers on Google Chrome.
if (window != self) haversine_formula(e);
// self.addEventListener('message', haversineFormula);
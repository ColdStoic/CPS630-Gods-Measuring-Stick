// Upper First.
// Capitalizes the first letters of each word in a string.
function toUpperFirst(str) {
    return str.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

// Search handler.
function searchHandler() {
	/* Location name searchbar */
	var locationName = document.getElementById("location-name").value;
	localStorage.setItem("locationName", toUpperFirst(locationName));

	/* Unit checkbox */
	var unit = document.getElementsByName("unit");
	for (var i = 0, length = unit.length; i < length; i++)
	{
		if (unit[i].checked) {
			localStorage.setItem("unit", unit[i].value);
		}
	}

	window.location.href = "weather.html";
}

/* Keyboard enter listener */
var input = document.getElementById("location-name");
input.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		// Trigger the button element with a click
		document.getElementById("search").click();
	}
}); 

var panel = document.getElementById("panel-location-info");
var panelTemplate =
    `<div class="panel-container-main">
        <div class="panel-container">
            <div class="panel lat">
                <div>Latitude</div>
                <div class="panel-info">
                    <div class="panel-lat"></div>
                </div>
            </div>
        </div>
        <div class="panel-container">
            <div class="panel lon">
                <div>Longitude</div>
                <div class="panel-info">
                    <div class="panel-lon"></div>
                </div>
            </div>
        </div>
        <div class="panel-container">
            <div class="panel name">
                <div>Name</div>
                <div class="panel-info">
                    <div class="panel-name"></div>
                </div>
            </div>
        </div>
        <div class="panel-container">
            <div class="panel city">
                <div>City</div>
                <div class="panel-info">
                    <div class="panel-city"></div>
                </div>
            </div>
        </div>
        <div class="panel-container">
            <div class="panel state">
                <div>State</div>
                <div class="panel-info">
                    <div class="panel-state"></div>
                </div>
            </div>
        </div>
        <div class="panel-container">
            <div class="panel country">
                <div>Country</div>
                <div class="panel-info">
                    <div class="panel-country"></div>
                </div>
            </div>
        </div>
        <div class="break"></div>
    </div>`

function pushTemplate(i) {
    panel.innerHTML += "<h2>Location " + i + "</h2>"
    panel.innerHTML += panelTemplate;
}
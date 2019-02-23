document.addEventListener("DOMContentLoaded", function(event) {
    var panelCurr = document.getElementById("panel-curr");
    var panelFile = document.getElementById("panel-file");

    panelCurr.innerHTML =
        `<h2>Current Location</h2>
            <div class="panel-container-main">
                <div class="panel-container">
                    <div class="panel lat">
                        <div>Latitude</div>
                        <div class="panel-info">
                            <div id="panel-lat1"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-container">
                    <div class="panel lon">
                        <div>Longitude</div>
                        <div class="panel-info">
                            <div id="panel-lon1"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-container">
                    <div class="panel name">
                        <div>Name</div>
                        <div class="panel-info">
                            <div id="panel-name1"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-container">
                    <div class="panel city">
                        <div>City</div>
                        <div class="panel-info">
                            <div id="panel-city1"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-container">
                    <div class="panel state">
                        <div>State</div>
                        <div class="panel-info">
                            <div id="panel-state1"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-container">
                    <div class="panel country">
                        <div>Country</div>
                        <div class="panel-info">
                            <div id="panel-country1"></div>
                        </div>
                    </div>
                </div>
                <div class="break"></div>
            </div>`

    panelFile.innerHTML =
        `<h2>File Location</h2>
        <div class="panel-container-main">
            <div class="panel-container">
                <div class="panel lat">
                    <div>Latitude</div>
                    <div class="panel-info">
                        <div id="panel-lat2"></div>
                    </div>
                </div>
            </div>
            <div class="panel-container">
                <div class="panel lon">
                    <div>Longitude</div>
                    <div class="panel-info">
                        <div id="panel-lon2"></div>
                    </div>
                </div>
            </div>
            <div class="panel-container">
                <div class="panel name">
                    <div>Name</div>
                    <div class="panel-info">
                        <div id="panel-name2"></div>
                    </div>
                </div>
            </div>
            <div class="panel-container">
                <div class="panel city">
                    <div>City</div>
                    <div class="panel-info">
                        <div id="panel-city2"></div>
                    </div>
                </div>
            </div>
            <div class="panel-container">
                <div class="panel state">
                    <div>State</div>
                    <div class="panel-info">
                        <div id="panel-state2"></div>
                    </div>
                </div>
            </div>
            <div class="panel-container">
                <div class="panel country">
                    <div>Country</div>
                    <div class="panel-info">
                        <div id="panel-country2"></div>
                    </div>
                </div>
            </div>
            <div class="break"></div>
        </div>`
})
var overlays = [];

testOverlay.prototype = new google.maps.OverlayView();

function initialize() {
    var mapCanvases = document.querySelectorAll("#map-canvas");
    var pacInputs = document.querySelectorAll("#pac-input");

    mapCanvases.forEach((mapCanvas, index) => {
        var map = new google.maps.Map(mapCanvas, {
            zoom: 15,
            center: {
                lat: 9.072264,
                lng: 7.491302,
            },
            mapTypeId: "terrain",
            draggableCursor: "crosshair"
        });
        map.addListener("click", (event) => {
            map.setCenter(event.latLng);
            console.log(event.latLng.toString());
        });

        overlay = new testOverlay(map);
        overlays.push(overlay);

        var input = pacInputs[index];
        map.controls[google.maps.ControlPosition.TOP_LEFT];

        var searchBox = new google.maps.places.SearchBox(input);

        google.maps.event.addListener(searchBox, "places_changed", function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            map.setCenter(places[0].geometry.location);
            // set search location as input.value
        });
    });
}

function testOverlay(map) {
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

testOverlay.prototype.onAdd = function () {
    var div = document.createElement("div");
    this.div_ = div;
    div.style.borderStyle = "none";
    div.style.borderWidth = "0px";
    div.style.position = "absolute";
    div.style.left = -window.innerWidth / 2 + "px";
    div.style.top = -window.innerHeight / 2 + "px";
    div.width = window.innerWidth;
    div.height = window.innerHeight;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    div.appendChild(canvas);

    const panes = this.getPanes();
    panes.overlayLayer.appendChild(div);


};



testOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

// google.maps.event.addDomListener(window, "load", initialize);
window.addEventListener("load", initialize);








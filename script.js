var map, infoWindow;

function createMap() {
    var options = {
        center: { lat: 36.7783, lng: -119.4179 },
        zoom: 5.5,
        disableDefaultUI: true,

    };

    //displays map
    map = new google.maps.Map(document.getElementById('map'), options);

    infoWindow = new google.maps.InfoWindow;

    //Access user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(p) {
            var position = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
            infoWindow.setPosition(position);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
        }, function() {
            handleLocationError('Geolocation failed', map.center())
        })
    } else {
        handleLocationError('No geolocation available', map.center());
    }

    requestEvents(); //API Call

    //Hard Coded circle
    var script = document.createElement('script');
    script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    map.data.setStyle(function(feature) {
        var magnitude = feature.getProperty('mag');

        return {
            icon: getEarthquakeCircle(magnitude)
        }
    })
}

function getEarthquakeCircle(value) { //HardCoded Purple Circles

    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'purple',
        fillOpacity: .2,
        scale: Math.pow(2, value) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

function eqfeed_callback(geojson) {
    map.data.addGeoJson(geojson);
}

function requestEvents() { //Makes API Call and parses JSON and passes coordinates for each event to setMark
    var request = new XMLHttpRequest();
    request.open('GET', 'https://eonet.sci.gsfc.nasa.gov/api/v3/events?limit=10', true);
    request.onload = function() {

        var data = JSON.parse(this.response);
        console.log(data);
        data.events.forEach((event) => {
            console.log(event.title);
            console.log(event.geometry);
            console.log(event.geometry[0].coordinates);
            setMark(event.geometry[0].coordinates);

        })

    }
    request.send();
}

function setMark(coordinates) { //Sets mark at passed coordinates. 
    //Bug: Does not display all the events. Line 86
    var marker = new google.maps.Marker({
        map: map,
        position: { lat: coordinates[1], lng: coordinates[0] },
        title: 'Some event'
    });
}
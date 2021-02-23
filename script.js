var map, infoWindow;

function createMap()
{
  var options = {
    center: { lat: 36.7783, lng: -119.4179},
    zoom: 5.5,
    disableDefaultUI: true
    //mapTypeId: 'terrain'
  };

  map = new google.maps.Map(document.getElementById('map'), options);

  infoWindow = new google.maps.InfoWindow;


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
        var position = {
            lat: p.coords.latitude,
            lng: p.coords.longitude
        };
        infoWindow.setPosition(position);
        infoWindow.setContent('Your Location');
        infoWindow.open(map);
    }, function () {
        handleLocationError ('Geolocation failed', map.center())
    })
  }
  else {
      handleLocationError('No geolocation available', map.center());
  }

  var script = document.createElement('script');
  script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  map.data.setStyle(function (feature) {
    var magnitude = feature.getProperty('mag');

    return {
      icon: getEarthquakeCircle(magnitude)
    }
  })
}

function getEarthquakeCircle(value) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'purple',
    fillOpacity: .2,
    scale: Math.pow(2, value) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function eqfeed_callback (geojson) {
  map.data.addGeoJson(geojson);
}

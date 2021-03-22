var map, infoWindow;

var markers = [[],[],[],[],[],[],[],[]];


var checkList = document.getElementById('list');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

let wildFires = document.querySelector("input[name=wildFires]");
    wildFires.addEventListener('change', function() {       
        if (this.checked) {
          filter[7] = true;
          showMarkers(7);
        } else {
          filter[7] = false;
          clearMarkers(7);
        }
        console.log(filter);
      });

    let landSlides = document.querySelector("input[name=landSlides]");

    landSlides.addEventListener('change', function() {       
        if (this.checked) {
          filter[3] = true;
          showMarkers(3);
        } else {
          filter[3] = false;
          clearMarkers(3);
        }
        console.log(filter);
      });

    let earthQuakes = document.querySelector("input[name=earthQuakes]");

    earthQuakes.addEventListener('change', function() {       
        if (this.checked) {
          filter[1] = true;
          showMarkers(3);
          //reassessEvents(1)
        } else {
          filter[1] = false;
          clearMarkers(3);
        }
        console.log(filter);
      });


    var filter = [true, true, true, true, true, true, true, true];

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

/*function getEarthquakeCircle(value) { //HardCoded Purple Circles

    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'purple',
        fillOpacity: .2,
        scale: Math.pow(2, value) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}*/

function eqfeed_callback(geojson) {
    map.data.addGeoJson(geojson);
}


function requestEvents() { //Makes API Call and parses JSON and passes coordinates for each event to setMark
    var request = new XMLHttpRequest();
    request.open('GET', 'https://eonet.sci.gsfc.nasa.gov/api/v3/events', true);
    request.onload = function() {
        var data = JSON.parse(this.response);
        console.log(data);
        var sorted = [[],[],[],[],[],[],[],[]];
        
        data.events.forEach((event) => {
            switch(event.categories[0].id) {

                case "drought":
                    sorted[0].push(event);
                    break;
                case "earthquakes":
                    sorted[1].push(event);
                    break;
                case "floods":
                    sorted[2].push(event);
                    break;
                case "landslides":
                    sorted[3].push(event);
                    break;
                case "severeStorms":
                    sorted[4].push(event);
                    break;
                case "tempExtremes":
                    sorted[5].push(event);
                    break;
                case "waterColor":
                    sorted[6].push(event);
                    break;
                case "wildfires":
                    sorted[7].push(event);
                    break;
                default:
                    break;
                
            }       
                  
        })
        console.log(sorted);
        
        
        for(i in sorted) {
            if(filter[i] == true) {
                sorted[i].forEach((event) => {
                    console.log(event.title);
                    console.log(event.geometry);
                    console.log(event.geometry[0].coordinates);
                    var temp = i + 1;
                    console.log("adding event from category " + i);
                    setMark(event.geometry[0].coordinates, event.categories[0].id, event);
                })
            }
        }

    }
    request.send();
}

function clearMarkers(category) {
    setMapOnAll(null, category);
    }

function setMapOnAll(map, category) {
    for (var i = 0; i < markers[category].length; i++) {
        console.log("removing category from map " + category);
        markers[category][i].setMap(map);
    }
}
function showMarkers(category) {

     setMapOnAll(map,category);

 }
 function setMark(coordinates, category, event) { //Sets mark at passed coordinates. 
    //Bug: Does not display all the events. Line 86
    var marker = new google.maps.Marker({
        map: map,
        data: event,
        position: { lat: coordinates[1], lng: coordinates[0] },
        title: 'Some event'
    });
    switch(category){
                case "drought":
                    markers[0].push(marker);
                    break;
                case "earthquakes":
                    markers[1].push(marker);
                    break;
                case "floods":
                    markers[2].push(marker);
                    break;
                case "landslides":
                    markers[3].push(marker);
                    break;
                case "severeStorms":
                    markers[4].push(marker);
                    break;
                case "tempExtremes":
                    markers[5].push(marker);
                    break;
                case "waterColor":
                    markers[6].push(marker);
                    break;
                case "wildfires":
                    markers[7].push(marker);
                    break;
                default:
                    break;
    }

    var contentString = createMarkerContent(marker.data);

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener("click", () => {
        if(!marker.open){
          infowindow.open(map, marker);
          marker.open = true;
        } else {
          infowindow.close();
          marker.open = false;
        }
    });
}
function createMarkerContent(data) { // Create content string of event data for marker window display
    return "<b>Name: </b>" + data.title.toString() + "<br>" +
           "<b>Category: </b>" + data.categories[0].title.toString() + "<br>" + 
           "<b>Date: </b>" + data.geometry[0].date.toString() +  "<br>" + 
           "<b>Coordinates: </b>" + "[ " + data.geometry[0].coordinates[1].toString() + ", " + data.geometry[0].coordinates[0].toString() + " ]";
}

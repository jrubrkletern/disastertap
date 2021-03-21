var map, infoWindow;

let wildFires = document.querySelector("input[name=wildFires]");
    wildFires.addEventListener('change', function() {       
        if (this.checked) {
          filter[7] = true;
        } else {
          filter[7] = false;
        }
        console.log(filter);
      });

    let landSlides = document.querySelector("input[name=landSlides]");

    landSlides.addEventListener('change', function() {       
        if (this.checked) {
          filter[3] = true;
        } else {
          filter[3] = false;
        }
        console.log(filter);
      });

    let earthQuakes = document.querySelector("input[name=earthQuakes]");

    earthQuakes.addEventListener('change', function() {       
        if (this.checked) {
          filter[1] = true;
          //reassessEvents(1)
        } else {
          filter[1] = false;
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
    request.open('GET', 'https://eonet.sci.gsfc.nasa.gov/api/v3/events', true);
    request.onload = function() {
        var test;
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
                    setMark(event.geometry[0].coordinates);
                })
            }
        }

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
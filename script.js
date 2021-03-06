var map, infoWindow;

var iconBase = 'icons/'

var icons = {
    drought: {
        icon: iconBase + 'droughtMarker.png'
    },
    earthquakes: {
        icon: iconBase + 'earthquakesMarker.png'
    },
    floods: {
        icon: iconBase + 'floodsMarker.png'
    },
    landslides: {
        icon: iconBase + 'landslidesMarker.png'
    },
    severeStorms: {
        icon: iconBase + 'severeStormsMarker.png'
    },
    tempExtremes: {
        icon: iconBase + 'temperatureExtremesMarker.png'
    },
    waterColor: {
        icon: iconBase + 'waterColorMarker.png'
    },
    wildfires: {
        icon: iconBase + 'wildfiresMarker.png'
    },
    dustHaze: {
        icon: iconBase + 'dustAndHazeMarker.png'
    },
    manmade: {
        icon: iconBase + 'manMadeMarker.png'
    },
    seaLakeIce: {
        icon: iconBase + 'seaAndLakeIceMarker.png'
    },
    snow: {
        icon: iconBase + 'snowMarker.png'
    },
    volcanoes: {
        icon: iconBase + 'volcanoesMarker.png'
    }
};


var markers = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

setInterval(function() {
    requestEvents();
}, 60000);

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
});

let earthQuakes = document.querySelector("input[name=earthQuakes]");

earthQuakes.addEventListener('change', function() {
    if (this.checked) {
        filter[1] = true;
        showMarkers(1);
    } else {
        filter[1] = false;
        clearMarkers(1);
    }
});

let droughts = document.querySelector("input[name=droughts]");

droughts.addEventListener('change', function() {
    if (this.checked) {
        filter[0] = true;
        showMarkers(0);
    } else {
        filter[0] = false;
        clearMarkers(0);
    }
});

let floods = document.querySelector("input[name=floods]");

floods.addEventListener('change', function() {
    if (this.checked) {
        filter[2] = true;
        showMarkers(2);
    } else {
        filter[2] = false;
        clearMarkers(2);
    }
});

let severeStorms = document.querySelector("input[name=severeStorms]");

severeStorms.addEventListener('change', function() {
    if (this.checked) {
        filter[4] = true;
        showMarkers(4);
    } else {
        filter[4] = false;
        clearMarkers(4);
    }
});

let tempExtremes = document.querySelector("input[name=tempExtremes]");

tempExtremes.addEventListener('change', function() {
    if (this.checked) {
        filter[5] = true;
        showMarkers(5);
    } else {
        filter[5] = false;
        clearMarkers(5);
    }
});

let waterColor = document.querySelector("input[name=waterColor]");

waterColor.addEventListener('change', function() {
    if (this.checked) {
        filter[6] = true;
        showMarkers(6);
    } else {
        filter[6] = false;
        clearMarkers(6);
    }
});

let dustHaze = document.querySelector("input[name=dustHaze]");

dustHaze.addEventListener('change', function() {
    if (this.checked) {
        filter[8] = true;
        showMarkers(8);
    } else {
        filter[8] = false;
        clearMarkers(8);
    }
});

let manmade = document.querySelector("input[name=manmade]");

manmade.addEventListener('change', function() {
    if (this.checked) {
        filter[9] = true;
        showMarkers(9);
    } else {
        filter[9] = false;
        clearMarkers(9);
    }
});

let seaLakeIce = document.querySelector("input[name=seaLakeIce]");

seaLakeIce.addEventListener('change', function() {
    if (this.checked) {
        filter[10] = true;
        showMarkers(10);
    } else {
        filter[10] = false;
        clearMarkers(10);
    }
});

let snow = document.querySelector("input[name=snow]");

snow.addEventListener('change', function() {
    if (this.checked) {
        filter[11] = true;
        showMarkers(11);
    } else {
        filter[11] = false;
        clearMarkers(11);
    }
});

let volcanoes = document.querySelector("input[name=volcanoes]");

volcanoes.addEventListener('change', function() {
    if (this.checked) {
        filter[12] = true;
        showMarkers(12);
    } else {
        filter[12] = false;
        clearMarkers(12);
    }
});



var filter = [true, true, true, true, true, true, true, true, true, true, true, true, true];
var dateAndTimeFilter = false;
var selectedStartDate = null;
var selectedEndDate = null;

function createMap() {
    var options = {
        center: { lat: 36.7783, lng: -119.4179 },
        zoom: 5.5,
        disableDefaultUI: true,

    };

    //displays map
    map = new google.maps.Map(document.getElementById('map'), options);

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }
            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });


    map.setOptions({ minZoom: 4, maxZoom: 18 });
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
        var sorted = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        data.events.forEach((event) => {
            switch (event.categories[0].id) {
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
                case "dustHaze":
                    sorted[8].push(event);
                    break;
                case "manmade":
                    sorted[9].push(event);
                    break;
                case "seaLakeIce":
                    sorted[10].push(event);
                    break;
                case "snow":
                    sorted[11].push(event);
                    break;
                case "volcanoes":
                    sorted[12].push(event);
                    break;

                default:
                    break;

            }

        })
        for (i = 0; i < sorted.length; i++) {
            clearMarkers(i);
            markers[i] = [];
            sorted[i].forEach((event) => {
                setMark(event.geometry[0].coordinates, event.geometry[0].type, event.categories[0].id, event);
                if (filter[i] == false) {
                    markers[i][markers[i].length - 1].setMap(null);
                } else if (dateAndTimeFilter) {
                    // setMapOnAll(null, i);
                    for (j = 0; j < markers[i].length; j++) {
                        if (markers[i][j] != null) {
                            eventDate = markers[i][j].data.geometry[0].date.toString()
                            if (selectedStartDate <= eventDate && eventDate <= selectedEndDate) {
                                console.log("Start Date:  " + selectedStartDate);
                                console.log("Actual : " + eventDate);
                                console.log("End Date : " + selectedEndDate);
                                dateAndTimeFilter = true;
                                markers[i][j].setMap(map);
                            } else {
                                dateAndTimeFilter = true;
                                markers[i][j].setMap(null);
                            }
                        }
                    }
                }
            })
        }
    }
    request.send();
}

function clearMarkers(category) {
    setMapOnAll(null, category);
}

function setMapOnAll(map, category) {
    for (var i = 0; i < markers[category].length; i++) {
        markers[category][i].setMap(map);
    }
}

function showMarkers(category) {
    if (selectedStartDate == null || selectedStartDate == null) {
        setMapOnAll(map, category);
    } else {
        for (j = 0; j < markers[category].length; j++) {
            if (markers[category][j] != null) {
                eventDate = markers[category][j].data.geometry[0].date.toString();

                if (selectedStartDate <= eventDate && eventDate <= selectedEndDate) {
                    console.log("Start Date:  " + selectedStartDate);
                    console.log("Actual : " + eventDate);
                    console.log("End Date : " + selectedEndDate);
                    dateAndTimeFilter = true;
                    markers[category][j].setMap(map);
                } else {
                    dateAndTimeFilter = true;
                    markers[category][j].setMap(null);
                }
            }
        }
    }
}

function setMark(coordinates, type, category, event) { //Sets mark at passed coordinates. 
    //Bug: Does not display all the events. Line 86

    var myLat;
    var myLng;
    if (type == "Point") {
        if (!Array.isArray(coordinates[0])) {
            myLat = coordinates[1];
            myLng = coordinates[0];
        } else {
            myLat = coordinates[0][coordinates[0].length - 1][1];
            myLng = coordinates[0][coordinates[0].length - 1][0];
        }
        console.log("setting icon..")
        console.log(category)
        var marker = new google.maps.Marker({
            map: map,
            data: event,
            icon: { url: icons[category].icon, scaledSize: new google.maps.Size(50, 50) },
            position: { lat: myLat, lng: myLng },
            title: category
        });
        console.log(icons[category].icon);
    } else {
        var shape = [];
        var color;
        var r = 0;
        for (r = 0; r < coordinates[0].length; r++) {
            shape.push([]);
            shape[r] = new google.maps.LatLng(coordinates[0][r][1], coordinates[0][r][0]);
        }
        switch (category) {
            case "drought":
                color = "#E35131";
                break;
            case "earthquakes":
                color = "#6C2812";
                break;
            case "floods":
                color = "#0D3FCF";
                break;
            case "landslides":
                color = "#8B3E2B";
                break;
            case "severeStorms":
                color = "#b80dcf";
                break;
            case "wildfires":
                color = "#FF0000";
                break;
            default:
                color = "#FEFEFE";
                break;
        }
        var marker = new google.maps.Polygon({
            paths: shape,
            data: event,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,

        });
        marker.setMap(map);
    }


    switch (category) {
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
        case "dustHaze":
            markers[8].push(marker);

            break;
        case "manmade":
            markers[9].push(marker);
            break;
        case "seaLakeIce":
            markers[10].push(marker);
            break;
        case "snow":
            markers[11].push(marker);
            break;
        case "volcanoes":
            markers[12].push(marker);
            break;
        default:
            break;
    }

    var contentString = createMarkerContent(marker.data);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener("click", () => {
        if (!marker.open) {
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
        "<b>Date: </b>" + data.geometry[0].date.toString() + "<br>"
    "<b>Coordinates: </b>" + "[ " + data.geometry[0].coordinates[1].toString() + ", " + data.geometry[0].coordinates[0].toString() + " ]";
}

$(function() {
    $('input[name="datetimes"]').daterangepicker({
        timePicker: false,
        autoUpdateInput: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour'),
        maxDate: moment().endOf('hour'),
        locale: {
            format: 'MM/DD/YYYY hh:mm A'
        }
    });
    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
        for (i = 0; i < filter.length; i++) {
            // setMapOnAll(null, i);
            for (j = 0; j < markers[i].length; j++) {
                if (markers[i][j] != null) {
                    selectedStartDate = picker.startDate.toISOString();
                    selectedEndDate = picker.endDate.toISOString();
                    eventDate = markers[i][j].data.geometry[0].date.toString();

                    if (selectedStartDate <= eventDate && eventDate <= selectedEndDate) {
                        console.log("Start Date:  " + selectedStartDate);
                        console.log("Actual : " + eventDate);
                        console.log("End Date : " + selectedEndDate);
                        dateAndTimeFilter = true;
                        if (filter[i] == true) {
                            markers[i][j].setMap(map);
                        }

                    } else {
                        console.log("FStart Date:  " + selectedStartDate);
                        console.log("FActual : " + eventDate);
                        console.log("FEnd Date : " + selectedEndDate);
                        dateAndTimeFilter = true;
                        if (filter[i] == true) {
                            markers[i][j].setMap(null);
                        }
                    }
                }
            }
        }
    });
});


function openNav() {
    document.getElementById("mySidebar").style.width = "550px";
    document.getElementById("main").style.marginLeft = "550px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

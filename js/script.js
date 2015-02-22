// Makes call to Parse backend with position parameter, gets positions data, then sets googlemMap pin locations for
function getParseData(position) {
  Parse.Cloud.run("restrooms", {lat: position.coords.latitude, lng: position.coords.longitude}, {
    success: function(objects) {
      objects.forEach(function(element, index, array) {
        var currentToilet = new google.maps.LatLng(element.location.latitude, element.location.longitude);
        var marker = new google.maps.Marker({
          position: currentToilet,
          toilet: element
        });
        google.maps.event.addListener(marker, 'click', function() {
          console.log(marker.toilet);
        });

        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
          openBar(element);
        });

      });
    },
    error: function(model, error) {
      $('.error').show();
    }
  });
}

function initializeMap() {
  var mapProp = {
    zoom: 14,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [{
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 17
              }]
            }, {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 20
              }]
            }, {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#6B6B6B"
              }, {
                "lightness": 17
              }]
            }, {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 29
              }, {
                "weight": 0.2
              }]
            }, {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 18
              }]
            }, {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [{
                "color": "#565656"
              }, {
                "lightness": 16
              }]
            }, {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 21
              }]
            }, {
              "elementType": "labels.text.stroke",
              "stylers": [{
                "visibility": "on"
              }, {
                "color": "#000000"
              }, {
                "lightness": 16
              }]
            }, {
              "elementType": "labels.text.fill",
              "stylers": [{
                "saturation": 36
              }, {
                "color": "#6E6E6E"
              }, {
                "lightness": 40
              }]
            }, {
              "elementType": "labels.icon",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 19
              }]
            }, {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#000000"
              }, {
                "lightness": 20        
              }]
            }]
          };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: '<i class="fa fa-street-view"></i>'
      });
      map.setCenter(pos);
      getParseData(position);
    }, function(e) {
      console.log(e);
    });
  } else {
    // Browser doesn't support Geolocation
    alert("Browser doesn't support Geolocation");
  }
}

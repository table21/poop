function initializeMap() {
  var mapProp = {
    zoom: 14,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false/*,
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
    }]*/
  };

  // Main Map Variable
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  // Assigns the user positions based on geolocation HTML5
  if(navigator.geolocation) {
    var pos;

    navigator.geolocation.getCurrentPosition(function(position) {

      // pos is var for holding 
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: '<i class="fa fa-street-view"></i>'
      });
      // Centers Google Map on pos (userLocation)
      map.setCenter(pos);
      // Gets the parse data for surrounding bathrooms
      getParseData(position);
    }, function(e) {
      console.log(e); // Prints data array?
    });

  } else {
    // Browser doesn't support Geolocation
    alert("Browser doesn't support Geolocation");
  }
}

function getParseData(position) {
  Parse.Cloud.run("restrooms", {lat: position.coords.latitude, lng: position.coords.longitude}, {
    success: function(objects) {
      var allMarkers = objects.map(function(element, index, array) {
        var currentToilet = new google.maps.LatLng(element.location.latitude, element.location.longitude);
        var marker = new google.maps.Marker({
          position: currentToilet,
          toilet: element
        });

                  /*google.maps.event.addListener(marker, 'click', function() {
                    console.log(marker.toilet);
                    openBar(marker.toilet);
                  });*/
        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
          openBar(element);
        });

        return marker;

      });
      calcRoute(allMarkers, {lat: position.coords.latitude, lng: position.coords.longitude});
    },
    error: function(model, error) {
      $('.error').show();
    }
  });
}

function addComment(id, comment) {
  var RefugeComment = Parse.Object.extend("RefugeComment");
  var refugeComment = new RefugeComment();

  refugeComment.save({"comment_id": id, "text": comment}, {
    success: function(response) {
      console.log(response);
    },
    error: function(response, error) {
      console.log(error);
    }
  });
}



function calcRoute (markers, pos) {
  var directionsService = new google.maps.DirectionsService();
  
  var currentPosition = new google.maps.LatLng(pos.lat, pos.lng);
  var dest = new google.maps.LatLng(markers[6].position.D, markers[6].position.k);
  
  //var smallestDist = google.maps.geometry.spherical.computeDistanceBetween(pos,markers[0].position);

  // Linear search
  //for (var i = 1; i < markers.length; i++) {
    //if(google.maps.geometry.spherical.computeDistanceBetween(pos, markers[i]) < smallestDist) {
      //smallestDist = google.maps.geometry.spherical.computeDistanceBetween(pos, markers[i]);
    //}

  //}        
  // After find other destination in the shortest distance, do directions request
  

  /*var request = {
    origin: pos,
    desintation: dest, //Find the nearest
    travelMode: google.maps.TravelMode.WALKING
  };*/

  var request = {
    // origin: getCurrentPosition,
    // destination: dest,
    origin: 'stanford',
    destination: 'sfo',
    travelMode: google.maps.TravelMode.DRIVING,
  }


  directionsService.route(request, function(response, status) {
    console.log(response);
      console.log(status);
    if (status == google.maps.DirectionsStatus.OK) {
      var directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(new google.maps.Map(document.getElementById("googleMap"), mapProp));
      directionsDisplay.setDirections(response);
    }
  });
}

function openBar(toilet) {
  $('footer.main').addClass('open');
  $('footer.main section .name').text(toilet.name);
  $('footer.main section .comments').html("");
  $('.comments').attr("id", toilet.id);
  toilet.comments.forEach(function(comment) {
    $('footer.main section .comments').append('<li class="comment">' +
                                              comment +
                                              '</li>');
  });
}

function submitComment() {
  var text = $('.comment-placeholder textarea').val();
  if (text) {
    var id = $('.comments').attr("id");
    $('.comment-placeholder textarea').val("");
    addComment(id, text);
    $('footer.main section .comments').append('<li class="comment">' +
                                                text +
                                                '</li>');
    initializeMap();
  }
}

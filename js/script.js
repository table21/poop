// Makes call to Parse backend with position parameter, gets positions data, then sets googlemMap pin locations for
function getParseData(position) {
  Parse.Cloud.run("restrooms", {lat: position.coords.latitude, lng: position.coords.longitude}, {
    success: function(objects) {
      console.log(objects);
      objects.forEach(function(element, index, array) {
        var currentToilet = new google.maps.LatLng(element.location.latitude, element.location.longitude);
        var marker = new google.maps.Marker({
          position: currentToilet,
        });
        marker.setMap(map);
      });
    },
    error: function(model, error) {
      $('.error').show();
    }
  });
}

function initializeMap() {
  var mapProp = {
    zoom: 12,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Current Location'
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

function openBar() {
  $(document.getElementById('popoutBar')).addClass('barClosed');
  $(document.getElementById('popoutBar')).removeClass('barOpen');
}

function closeBar() {
  $(document.getElementById('popoutBar')).addClass('barOpen');
  $(document.getElementById('popoutBar')).removeClass('barClosed');
}



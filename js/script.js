function getParseData(position) {
  Parse.Cloud.run("restrooms", {lat: position.coords.latitude, lng: position.coords.longitude}, {
    success: function(object) {
      object.forEach(function(element, index, array) {
        var currentToilet = new google.maps.LatLng(element.latitude, element.longitude);
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
    zoom: 10,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
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



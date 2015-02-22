// Makes call to Parse backend with position parameter, gets positions data, then sets googlemMap pin locations for
function getParseData(position) {
  Parse.Cloud.run("restrooms", {lat: position.coords.latitude, lng: position.coords.longitude}, {
    success: function(objects) {
      objects.forEach(function(element, index, array) {
        var currentToilet = new google.maps.LatLng(element.location.latitude, element.location.longitude);
        var marker = new google.maps.Marker({
          position: currentToilet,
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

function openBar(data) {
  $(document.getElementById('popoutBar')).addClass('barOpen');
  $(document.getElementById('popoutBar')).removeClass('barClosed');
  $(document.getElementById('popoutBar')).html(getToiletHTML(data));
}

function closeBar() {
  $(document.getElementById('popoutBar')).addClass('barClosed');
  $(document.getElementById('popoutBar')).removeClass('barOpen');
}

function getToiletHTML(data) {
  var html = '';
  html += '<legend>' + data.name + '</legend>';
  html += '<form><textarea placeholder="leave a comment" onclick="writeReview()"></textarea></form>' +
      '<div id="reviewData">' + stuff() +
      '</div>'
  html += stuff();
  return html;
}

function writeReview() {
  $('#reviewData').addClass('visible');
}

function stuff() {
  var rating = '<fieldset class="rating">' +
      '<input type="radio" id="star5" name="rating" value="5" /><label class = "full" for="star5" title="Awesome - 5 stars"></label>' +
      '<input type="radio" id="star4half" name="rating" value="4.5" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>' +
      '<input type="radio" id="star4" name="rating" value="4" /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>' +
      '<input type="radio" id="star3half" name="rating" value="3.5" /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>' +
      '<input type="radio" id="star3" name="rating" value="3" /><label class = "full" for="star3" title="Meh - 3 stars"></label>' +
      '<input type="radio" id="star2half" name="rating" value="2.5" /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>' +
      '<input type="radio" id="star2" name="rating" value="2" /><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>' +
      '<input type="radio" id="star1half" name="rating" value="1.5" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>' +
      '<input type="radio" id="star1" name="rating" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>' +
      '<input type="radio" id="starhalf" name="rating" value=".5" /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>' +
  '</fieldset>'
  return rating;
}


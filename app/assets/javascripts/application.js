// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).on('ready', function(){
  markers = [];
  segments = [];
  previous_marker = null;
  var mapCanvas = document.getElementById('map-canvas');

  var mapOptions = {
    center: new google.maps.LatLng(-34.893587, -56.164438),
    zoom: 9,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false
  }
  map = new google.maps.Map(mapCanvas, mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });

  function placeMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    previous_marker = null;

    markers.push(marker);

    google.maps.event.addListener(marker, "dblclick", function() {
      var index = markers.indexOf(marker);
      markers.splice(index, 1);
      marker.setMap(null);
    });

    google.maps.event.addListener(marker, "click", function() {
      if (previous_marker != null) {

        var segment = new google.maps.Polyline({
          path: [previous_marker.getPosition(), marker.getPosition()],
          strokeColor:"#00F",
          strokeOpacity:0.8,
          strokeWeight:2,
          map: map
        });
        segments.push(segment);

        var txt = segmentToText(segment) + "\n";
        var box = $("#result");
        box.val(box.val() + txt);

        google.maps.event.addListener(segment, "click", function() {
          var sindex = segments.indexOf(segment);
          if (sindex != -1) {
            segments.splice(sindex, 1);
            segment.setMap(null);
            var remove_txt = segmentToTextNoIndex(segment);
            var res = $("#result");
            box.val(res.val().replace(txt, ''));
          }
        });
        previous_marker = null;
      } else {
        previous_marker = marker;
      }
    });
  }

  getCoordinates = function getCoordinates() {
    for (var i = 0; i < markers.length; i++) {
      var position = markers[i].position;
      console.log(i + ' ' + position.lat() + ' ' + position.lng());
    }
  }

  getSegments = function getSegments() {
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      console.log(segmentToText(segment));
    }
  }

  function segmentToText(segment) {
    var sindex = segments.indexOf(segment);
    return sindex + ' ' + segment.getPath().getArray()[0].A + ' ' + segment.getPath().getArray()[0].F +  ' ' + segment.getPath().getArray()[1].A + ' ' + segment.getPath().getArray()[1].F;
  }

  function segmentToTextNoIndex(segment) {
    return segment.getPath().getArray()[0].A + ' ' + segment.getPath().getArray()[0].F +  ' ' + segment.getPath().getArray()[1].A + ' ' + segment.getPath().getArray()[1].F;
  }

});

function initMap() {
  var msk = {lat: 55.709623, lng:  37.593688};
  var office = {lat: 55.678803, lng: 37.253474};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: msk,
    scrollwheel:  false
  });
  var image = {
  url: 'img/map-point.png',
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(231, 190),
  // The origin for this image is (0, 0).
  origin: new google.maps.Point(0, 0),
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: new google.maps.Point(50, 190)
};
  var marker = new google.maps.Marker({
    position: office,
    icon: image,
    map: map
  });
}

window.initMap = initMap;

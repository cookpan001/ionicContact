app.controller('LocationCtrl', function($scope, $cordovaGeolocation, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBar(false);
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      console.log("lat: " + lat + ", long: " + long);
    }, function(err) {
      console.log("getCurrentPosition", err);
    });
  var watchOptions = {
    frequency : 1000,
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      console.log("watch", err);
    },
    function(position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      console.log("lat: " + lat + ", long: " + long);
  });
  watch.clearWatch();
});
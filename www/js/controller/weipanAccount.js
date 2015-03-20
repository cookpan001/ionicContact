app.controller('AccountCtrl', function($rootScope, $scope, $ionicModal, $http, $localstorage, Weipan) {
  $scope.userInfo = {};
  $scope.isLogin = false;
  $scope.showLogin = true;
  $scope.syncContacts = true;
  $rootScope.$on("weipan:refresh_token_failed", function(){
    console.log("weipan refresh token failed");
    $scope.weipanLogin();
  });
  $rootScope.$on("weipan:login", function(weipanAccessToken){
    console.log("receive weipan login event");
    $scope.getWeipanAccountInfo();
  });
  $scope.getWeipanAccountInfo = function(){
    console.log("get Weipan Account Info");
    Weipan.user_info()
    .success(function(data){
        $scope.userInfo = angular.fromJson(data);
        $scope.isLogin = true;
    })
    .error(function(data, status){
      var result = angular.fromJson(data);
      if(result['error_detail_code'] == 40102){
        Weipan.refresh_access_token();
      }else{
        $scope.weipanLogin();
      }
    });
  };
  $scope.weipanLogin = function(){
    $scope.showLogin = false;
    var ref = window.open(Weipan.authorizeApi+'?redirect_uri='+Weipan.callback+'&response_type=code&client_id='+Weipan.appId+'&display='+Weipan.display, '_blank', 'location=no');
    ref.addEventListener('loadstart', function(event) {
        if((event.url).indexOf(Weipan.callback) === 0) {
            ref.close();
            ref = null;
            $http.get(event.url + "1")
            .success(function(data) {
              var accessTokenInfo = angular.fromJson(data);
              Weipan.set_access_token(accessTokenInfo);
              $rootScope.$broadcast('weipan:login', accessTokenInfo);
            })
            .error(function(data, status) {
                console.log("ERROR: " + angular.toJson(data));
            });
        }
    }, false);
  };
  var accessTokenInfo = $localstorage.getObject('weipanAccessToken2');
  if(accessTokenInfo.access_token){
    console.log('use localStorage access_token');
    $scope.showLogin = false;
    $scope.getWeipanAccountInfo();
  }
  //Modal
  $ionicModal.fromTemplateUrl('weipan-login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  });

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});
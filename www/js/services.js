angular.module('starter.services', ['ngCordova'])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return angular.fromJson($window.localStorage[key] || '{}');
    }
  }
}])
.factory('Weipan', ['$http', '$window', '$rootScope', '$localstorage', function($http, $window, $rootScope, $localstorage){
  var accessTokenInfo = $localstorage.getObject('weipanAccessToken2') || {};
  return {
    appId: 1849463086,
    authorizeApi: "https://auth.sina.com.cn/oauth2/authorize",
    callback: "http://pzhu001.sinaapp.com/access_token",
    display: "mobile",
    //API
    apiHost: "http://api.weipan.cn/",
    accountInfo: "2/account/info",
    set_access_token: function(tokenInfo){
      console.log(tokenInfo);
      accessTokenInfo = tokenInfo;
      $localstorage.setObject('weipanAccessToken2', tokenInfo);
    },
    refresh_access_token: function(){
      var req = {
        method: "POST",
        url: "http://pzhu001.sinaapp.com/refresh_token", 
        data: "refresh_token="+accessTokenInfo['refresh_token'],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      $http(req)
      .success(function(data, status){
        accessTokenInfo = angular.fromJson(data);
        console.log("refresh_token: " + accessTokenInfo + ","+status);
        $localstorage.setObject('weipanAccessToken2', accessTokenInfo);
        $rootScope.$broadcast('weipan:login', accessTokenInfo);
      })
      .error(function(data, status){
        console.log("refresh_token error: " + status + ", " + data);
        $rootScope.$broadcast('weipan:refresh_token_failed', accessTokenInfo);
      });
    },
    user_info: function(){
      var url =  "http://api.weipan.cn/2/account/info?access_token=" + accessTokenInfo['access_token'];
      console.log(url );
      return $http.get(url);
    },
    files: function(){

    },
    files_post: function(){

    },
    files_put: function(){

    },
    //weibo api
    weibo: function(api, param, method, func){
      var url = "http://api.weipan.cn/weibo/" + api + "?access_token=" + accessTokenInfo['access_token'];
      var req = {
        "method": method, 
        "url": url,
        "data": param
      };
      $http(req)
      .success(function(data){
        func(data);
      })
      .error(function(data, status){
        console.log("ERROR: " + status + "," + data);
        func(data);
      });
    }
  };
}])
.factory('Contacts', ['$cordovaContacts', function($cordovaContacts) {
  var allContacts = {};
  var options  = {
    fields: ['id', 'name', 'phoneNumbers'],
    multiple: true
  };
  $cordovaContacts.find(options).then(function(contacts){
    for (var i = 0; i < contacts.length; i++) {
      allContacts[contacts[i]['id']] = contacts[i];
    }
    console.log(allContacts);
  }, function(contactError){
    console.log(contactError);
  });
  return {
    all: function(){
      return allContacts;
    },
    remove: function(id){
      delete allContacts[id];
    },
    get: function(id){
      return allContacts[id];
    }
  };
}]);
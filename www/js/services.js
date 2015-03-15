angular.module('starter.services', ['ngCordova'])
.factory('Weipan', ['$http', function($http){
  var access_token = '';
  return {
    appId: 1849463086,
    authorizeApi: "https://auth.sina.com.cn/oauth2/authorize",
    callback: "http://pzhu001.sinaapp.com/access_token",
    display: "mobile",
    //API
    apiHost: "http://api.weipan.cn",
    accountInfo: "2/account/info",
    request_url: function(api){
      return apiHost + "/" + api;
    },
    set_access_token: function(token){
      access_token = token;
    },
    user_info: function(func){
      var url = request_url(accountInfo);
      $http(url)
      .success(function(data){
        func(data);
      })
      .error(function(data, status){
        console.log("ERROR: " + status + "," + angular.toJson(data));
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
app.factory('Weipan', ['$http', '$window', '$rootScope', '$localstorage', function($http, $window, $rootScope, $localstorage){
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
    get_contacts: function(){
      var file_name = "contacts_"+accessTokenInfo['uid']+".json";
      var url = "http://api.weipan.cn/2/files/basic/"+file_name+"?access_token="+accessTokenInfo['access_token'];
      console.log(url);
      $http.get(url)
      .success(function(data){
        console.log("get contacts", angular.toJson(data));
      })
      .error(function(data, status){
        console.log(status+":"+angular.toJson(data));
      });
    },
    files_post: function(data){
      var file_name = "contacts_"+accessTokenInfo['uid']+".json";
      var url =  "http://upload-vdisk.sina.com.cn/2/files/basic/"+file_name+"?access_token=" + accessTokenInfo['access_token'];
      console.log(url);
      var fd = new FormData();
      var file = new Blob([data], {type: 'application/json'});
      fd.append('file', file, file_name);
      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      })
      .success(function(data){
        console.log("upload contacts success");
      })
      .error(function(data,status){
        console.log("upload contacts failed: " + status + ":" + data);
      });
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
}]);
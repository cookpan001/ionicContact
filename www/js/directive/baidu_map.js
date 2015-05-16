app.directive('baidumap', ['$timeout', function($timeout){
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            location: '='
        },
        templateUrl: 'templates/baidu-map.html',
        link: function($scope, $element, $attrs) {
            console.log("link");
            var map = new BMap.Map("l-map");
            console.log(map);
            map.centerAndZoom(new BMap.Point(116.693686, 39.877192), 14);
            map.addControl(new BMap.ZoomControl());//缩放工具
            var scaleControl=new BMap.ScaleControl();
            map.addControl(scaleControl);
            var marker = new BMap.Marker(new BMap.Point(116.693686, 39.877192));// 创建标注      
            map.addOverlay(marker);
            map.addEventListener("click", function(e){      
                console.log(e.point.lng + ", " + e.point.lat);      
            });
            var local = new BMap.LocalSearch(map, {
                renderOptions:{map: map}
            });
            var watchTimer;
            $scope.$watch('location', function(location) {
                if (watchTimer){
                    $timeout.cancel(watchTimer);
                }
                watchTimer = $timeout(function () {
                    console.log("location: "+ location);
                    local.search(location);
                }, 1500);
            });
        }
    };
}])
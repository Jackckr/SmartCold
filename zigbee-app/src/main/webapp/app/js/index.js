var app = angular.module('app', []);
app.controller('ctrl', function ($http, $location, $scope) {
    $scope.msgTotalNum = window.msgTotalNum;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    function myFun(result) {
        var cityName = "上海";
        if (result && result.name) {
            cityName = result.name;
        }
        document.getElementById ("city").innerHTML = cityName;
        //alert("当前定位城市:" + cityName);
        //window.gpslocationcity = cityName;
        window.localStorage.cityName = cityName;
    }

    var myCity = new BMap.LocalCity();
    myCity.get(myFun);
});
	




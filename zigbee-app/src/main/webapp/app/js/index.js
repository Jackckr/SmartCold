var app = angular.module('app', []);
app.controller('ctrl', function ($http, $location, $scope) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.msgTotalNum = window.localStorage.msgTotalNum;
    function myFun(result) {
        var cityName = "上海";
        if (result && result.name) {
            cityName = result.name;
        }
        document.getElementById ("city").innerHTML = cityName;
        //alert("当前定位城市:" + cityName);
        //window.gpslocationcity = cityName;
        $http.get(ER.root+'/i/city/findCityByName', {
            params: {
                "CityName": cityName
            }
        }).success(function (data) {
        	 window.localStorage.appLocalCity = data;
        });
    }

    var myCity = new BMap.LocalCity();
    myCity.get(myFun);
});
	




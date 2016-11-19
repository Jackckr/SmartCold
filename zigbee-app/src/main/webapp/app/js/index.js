var app = angular.module('app', []);
app.controller('ctrl', function ($http, $location, $scope) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.msgTotalNum = window.localStorage.msgTotalNum;
    if(window.localStorage.appLocalCity ){
    	 document.getElementById ("city").innerHTML =JSON.parse(window.localStorage.appLocalCity).cityName;
    }else{
    	  function myFun(result) {
    	        var cityName = "上海";
    	        if (result && result.name) { cityName = result.name;  }
    	        $http.get(ER.root+'/i/city/findCityByName', { params: { "CityName": cityName} }).success(function (data) {
    	        	document.getElementById ("city").innerHTML = data.cityName;
    	        	 window.localStorage.appLocalCity =JSON.stringify(data);
    	        });
    	    }
    	    var myCity = new BMap.LocalCity();
    	    myCity.get(myFun);
    }
});
	




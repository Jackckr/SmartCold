var app = angular.module('app', []);
app.controller('ctrl', function ($http, $location, $scope) {
	$scope.msgTotalNum = window.localStorage.msgTotalNum;
    $http.defaults.withCredentials = true; $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    if(window.localStorage.appLocalCity ){
    	 document.getElementById ("city").innerHTML =JSON.parse(window.localStorage.appLocalCity).cityName;
    }else{
    	  function myFun(result) {
    	        var cityName = "上海";
    	        if (result && result.name) { cityName = result.name;  }
    	        $http.get(ER.root+'/i/city/findCityByName', { params: { "CityName": cityName} }).success(function (data) {
    	        	if(data!=null&&data!=undefined&&data!=""){
    	        	    document.getElementById ("city").innerHTML = data.cityName;
    	        	 	 window.localStorage.appLocalCity =JSON.stringify(data);
    	        	    }
    	        	else{
    	        		document.getElementById ("city").innerHTML = "上海";
    	        	    window.localStorage.appLocalCity='{"cityID":1,"cityName":"上海"}';//设置默认城市
    	        	}
    	        });
    	    }
    	    var myCity = new BMap.LocalCity();
    	    myCity.get(myFun);
    }
});
	




var app = angular.module('app', []);
 app.controller('ctrl', function($http, $location,$scope) {
	 $scope.msgTotalNum = window.msgTotalNum;
   $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	if (navigator.geolocation)
     {
     navigator.geolocation.getCurrentPosition(showPosition, showErr);
     }
     function showPosition(position){
	    var map = new BMap.Map("allmap");
		var point = new BMap.Point(position.coords.latitude,
				position.coords.longitude);
		map.centerAndZoom(point, 12);
		function myFun(result) {
			var cityName = result.name;
			map.setCenter(cityName);
			document.getElementById ("city").innerHTML = cityName;
			//alert("当前定位城市:" + cityName);
			window.gpslocationcity = cityName;
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myFun);
 	 
 }
 function show(msg){
     alert(msg);
 }
 function showErr(error){
     var result;
     switch(error.code) 
     {
     case error.PERMISSION_DENIED:
       result="位置服务被拒绝。";
       document.getElementById ("city").innerHTML = "上海";
       break;
     case error.POSITION_UNAVAILABLE:
       result="暂时获取不到位置信息。";
       document.getElementById ("city").innerHTML = "上海";
       break;
     case error.TIMEOUT:
       result="获取位置信息超时。";
       document.getElementById ("city").innerHTML = "上海";
       break;
     case error.UNKNOWN_ERROR:
       result="未知错误。";
       document.getElementById ("city").innerHTML = "上海";
       break;
     }
     alert(result);
 }
	/* var map = new BMap.Map("allmap");
		var point = new BMap.Point("116",
				"116");
		map.centerAndZoom(point, 12);
		function myFun(result) {
			var cityName = result.name;
			map.setCenter(cityName);
		    document.getElementById ("city").innerHTML = cityName;
			alert("当前定位城市:" + cityName);
			window.gpslocationcity = cityName;
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myFun);*/
	 
 });
	




checkLogin();
angular.module('app', []).controller('ctrl', function ($scope, $http) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	var url=window.location.href;
	var arrurl=url.split("?id=");
	$scope.flag = arrurl[1];
});

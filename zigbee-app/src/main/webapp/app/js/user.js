var app = angular.module('app', []);
 app.controller('usercl', function($http, $location,$scope) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.initdata=function(){
		 if(window.user!=null){ $scope.userinfo=window.user;return;};
		 $http.get(ER.root+"/i/user/findUser", {params: {token:util.getCookie('token')}}).success(function(data) {  
			 if(data.id!=0){$scope.userinfo=window.user= data; 
				window.localStorage.lkuser=JSON.stringify(data);
			 }
		 }); 
	 };
	 $scope.msgTotalNum = window.localStorage.msgTotalNum;
	 $scope.initdata();
 });
	




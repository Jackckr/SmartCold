 var app = angular.module('app', []);
 app.controller('usercl', function($http, $location,$scope) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	$scope.initdata=function(){
		 $.ajax({cache: false,type: "POST",url:ER.root+"/i/user/findUser", success: function(data) {
			 $scope.$apply(function () {
            	 if(data.id!=0){ $scope.userinfo= data;}
		    });
		 } });
	};

	$scope.initdata();
});

	




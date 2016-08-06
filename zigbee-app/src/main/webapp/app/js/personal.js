 var app = angular.module('app', []);
 app.controller('personal', function($http, $location,$scope) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.logout = function () {
			$http.get(ER.root+'/i/user/logout');
           	$scope.user=window.user  = null;gohome();
     };
	$scope.initdata=function(){
		 $.ajax({cache: false,type: "POST",url:ER.root+"/i/user/findUser", success: function(data) {
			 $scope.$apply(function () {
            	 if(data.id!=0){ 
            		 $("#user_sex").val(data.sex);
            		 $scope.userinfo= data;
            	 }
		    });
		 } });
		 $http.get(ER.root+'/i/city/findProvinceList').success(function(data) {
         	   $scope.provinces = data;
         });
	};
	$scope.initevg=function(){
		
	};
	$scope.initdata();
	$scope.initevg();
});

	




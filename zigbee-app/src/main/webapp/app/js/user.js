 var app = angular.module('app', []);
 app.controller('usercl', function($http, $location,$scope) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.initdata=function(){
		 if(window.user!=null){ $scope.userinfo=window.user;return;};
		 $.ajax({cache: false,type: "POST",url:ER.root+"/i/user/findUser",data:{token:util.getCookie('token')}, success: function(data) {
			 $scope.$apply(function () {
            	 if(data.id!=0){
            		 $scope.userinfo=window.user= data;
            		 window.sessionStorage.setItem("user",JSON.stringify(data));
            		}
		    });
		 } });
	 };
	 $scope.initdata();
});

	




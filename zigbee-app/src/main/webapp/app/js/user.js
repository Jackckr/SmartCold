 var app = angular.module('app', []);
 app.controller('userController', function($http, $location,$scope) {
	$scope.initdata=function(){
		 $.ajax({
             cache: false,
             type: "POST",
             url:ER.root+"/i/user/findUser",
             async: false,
             success: function(data) {
            	 debugger;
               alert(data);
            	 
             }
         });
	};
	$scope.initevg=function(){
		
	};
	$scope.initdata();
	$scope.initevg();
});

	




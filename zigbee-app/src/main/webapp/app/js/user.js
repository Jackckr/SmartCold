 var app = angular.module('app', []);
 app.controller('userController', function($http, $location,$scope) {
	$scope.initdata=function(){
		 $.ajax({cache: false,type: "POST",url:ER.root+"/i/user/findUser", success: function(data) {
            	 if(data.id!=0){$scope.user= data; }
             }
         });
	};
	$scope.initevg=function(){
		
	};
	$scope.initdata();
	$scope.initevg();
});

	




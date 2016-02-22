coldWeb.controller('base', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	$rootScope.load = function () {
    }
	
    
	$rootScope.logout = function () {
    	$http.get('/i/user/logout');
    	$rootScope.user = null;
    }
    
    $scope.load();

    
});

coldWeb.controller('error', function ($scope, $location,rejection) {
	$scope.status = rejection.status;
	
	if(rejection.status == 401){
		$scope.message = rejection.data.errorMsg;
	}else{
		$scope.message = rejection.statusText;
	}
});

coldWeb.controller('about', function ($scope, $location) {
});

coldWeb.controller('login', function ($scope, $location,$window) {
	
});
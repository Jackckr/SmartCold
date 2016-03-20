coldWeb.controller('base', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	$rootScope.load = function () {
		console.log("登陆成功,开始加载页面");
		console.log(user);
    }
	
    
	$rootScope.logout = function () {
    	$http.get('/i/user/logout');
    	$rootScope.user = null;
		window.location.reload() ;
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
coldWeb.controller('orderGenerate', function ($rootScope, $scope, $state, $stateParams,$cookies, $http, $location) {
	$scope.orderDto = $stateParams.data;
	$scope.load = function(){
		$http.get('/i/user/findUser').success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    });
    };
    $scope.load();
    $scope.getTeleNum = function () {
    	$http.get('/i/orders/getTelephone', {
    	    params: {
    	    	orderid : $scope.orderDto.orders.id,
    	    	ownerTele: $scope.orderDto.orders.ownertele,
    	    	userTele : $scope.orderDto.orders.usertele,
    	    	ownerName : $scope.orderDto.orders.ownername,
    	    	userName : $scope.orderDto.orders.username
    	    }
    	}).success(function (data) {
    			alert(data.message);
    	});
    };
});


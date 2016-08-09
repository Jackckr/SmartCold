coldWeb.controller('orderGenerate', function ($rootScope, $scope, $state, $stateParams,$cookies, $http, $location) {
	$scope.orderid = $stateParams.orderid;
	$scope.load = function(){
		$http.get('/i/user/findUser').success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
    }
    $scope.load();
   
	$scope.getOrder = function() {
    	$http.get('/i/orders/findOrderByOrderId', {
            params: {
                "orderID": $scope.orderid
            }
        }).success(function (data) {
        	$scope.order = data.entity;
        });
	}
	$scope.getOrder();
});


coldWeb.controller('personalOrder', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	 // 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.getOrders = function() {
    	$http.get('/i/orders/findOrdersByUserId', {
            params: {
                "userID": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.orders = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	$scope.pageChanged = function() {
		$scope.getOrders();
	}
	$scope.getOrders();
	
});


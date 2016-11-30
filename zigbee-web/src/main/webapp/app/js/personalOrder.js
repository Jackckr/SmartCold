coldWeb.controller('personalOrder', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
    }
    $scope.load();
	 // 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 0;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.getOrders = function() {
    	$http.get('/i/orders/findOrdersByUserId', {
            params: {
                "userID": $rootScope.user.id,
                keyword:$scope.keyword,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.ordersDto = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	$scope.pageChanged = function() {
		$scope.getOrders();
	}
	$scope.getOrders();
	
	
	 $scope.goSearch = function () {
		 $scope.getOrders();
	    }
	$scope.goShowOrder = function (orderdto) {
        $state.go('orderGenerate', {"data": orderdto});
}
	
	
	$scope.goDeleteOrder = function(orderID){
    	var r=confirm("删除订单？");
    	if(r){
    		$http({
    			method:'DELETE',
    			url:'/i/orders/deleteByOrderID',
    			params:{
    				'orderID':orderID
    			}
    		}).success(function (data) {
				//alert("删除成功");
				$state.reload(); 
        });
    	}
    }
});


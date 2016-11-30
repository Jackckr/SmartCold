coldWeb.controller('personalRdc', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	$scope.getRdcs = function() {
    	$http.get('/i/rdc/findRDCDTOByUserId', {
            params: {
                "userID": $rootScope.user.id,
                 keyword:$scope.keyword,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.rdcs = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	
    $scope.goSearch = function () {
        $scope.getRdcs();
    }

	
	$scope.pageChanged = function() {
		$scope.getRdcs();
	}
	$scope.getRdcs();
	$scope.goEditRdc = function (rdcID) {
	        $state.go('coldStorageEdit', {"rdcID": rdcID});
	}
	$scope.deleteRdc = function(rdcID){
	    	var r=confirm("删除冷库？");
	    	if(r){
	    		$http({
	    			method:'DELETE',
	    			url:'/i/rdc/deleteByRdcID',
	    			params:{
	    				'rdcID':rdcID
	    			}
	    		}).success(function (data) {
    				//alert("删除成功");
    				$state.reload(); 
            });
	    	}
	    }
	    
});


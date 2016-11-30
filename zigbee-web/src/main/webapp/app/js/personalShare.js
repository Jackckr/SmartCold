coldWeb.controller('personalShare', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	$scope.getShares = function() {
    	$http.get('/i/ShareRdcController/getSEListByUID', {
            params: {
                "uid": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.sharesDto = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	$scope.pageChanged = function() {
		$scope.getShares();
	}
	$scope.getShares();
	
	$scope.goEditShare = function(shareID){
		 $http.get('/i/ShareRdcController/getSEByIDForEdit', {
	         params: {
	             "id": shareID
	         }
	     }).success(function (data) {
	    	 if(data.entity.dataType==1){
	    		 $state.go('shareGoodsEdit', {"shareID": shareID});
	    	 }
	    	 if(data.entity.dataType==2){
	    		 $state.go('shareTransportEdit', {"shareID": shareID});
	    	 }
	    	 if(data.entity.dataType==3){
	    		 $state.go('shareStorageEdit', {"shareID": shareID});
	    	 }
	     });
	};
	
	
	$scope.goDeleteShare = function(shareID){
    	var r=confirm("删除订单？");
    	if(r){
    		$http({
    			url:'/i/ShareRdcController/delShareInfoByUid',
    			params:{
    				'id':shareID,
    				'uid':$rootScope.user.id
    			}
    		}).success(function (data) {
    				//alert("删除成功");
    				$state.reload(); 
            });
    	}
    }
});


coldWeb.controller('personalMessage', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	$scope.getMsgs = function() {
    	$http.get('/i/message/findMessageByUserId', {
            params: {
                "userID": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.msgs = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	
	$scope.pageChanged = function() {
		$scope.getRdcs();
	}
	$scope.getMsgs();
	$scope.deleteMsg = function(msgID){
	    	var r=confirm("删除消息？");
	    	if(r){
	    		$http({
	    			method:'DELETE',
	    			url:'/i/message/deleteMessage',
	    			params:{
	    				'msgID':msgID
	    			}
	    		}).success(function (data) {
    				//alert("删除成功");
    				$state.reload(); 
            });
	    	}
	    }
	    
});


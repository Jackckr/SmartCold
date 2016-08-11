coldWeb.controller('personalComment', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    
	$scope.getComments = function() {
    	$http.get('/i/comment/findCommentsByUserId', {
            params: {
                "userID": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.percommentsDto = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	$scope.pageChanged = function() {
		$scope.getComments();
	}
	$scope.getComments();
	
	$scope.goDeleteComment = function(commentID){
    	var r=confirm("删除评价？");
    	if(r){
    		$http({
    			method:'DELETE',
    			url:'/i/comment/deleteByCommentID',
    			params:{
    				'commentID':commentID
    			}
    		}).success(function (data) {
				alert("删除成功");
				$state.reload(); 
        });
    	}
    }
});


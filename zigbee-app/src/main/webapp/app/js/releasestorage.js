angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope,  $http) {
	$scope.load = function(){
		checkLogin();
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: ER.root +'/i/user/findUser'}).success(function(data,status,config,headers){
			 $scope.user = data;
			 $scope.pageChanged();
	    })
		//});
   }
   $scope.load();
   $scope.maxSize = 12;
   // 总条目数(默认每页十条)
   $scope.bigTotalItems = 12;
   // 当前页
   $scope.bigCurrentPage = 1;
    $scope.pageChanged = function () {
    	
    	$http.get(ER.root+"/i/rdc/findRDCDTOByUserId", {
            params: {
                "userID": $scope.user.id,
                keyword:$scope.keyword,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.rdclist = data.data;
        	$scope.bigTotalItems = data.total;
        });
    };
   
});

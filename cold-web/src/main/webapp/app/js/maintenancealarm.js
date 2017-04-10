coldWeb.controller('maintenancealarm', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.status=0; $scope.level=undefined; $scope.keyword=undefined;
	
    $scope.initData=function(){
	  $http.get('/i/warningMint/getWarningMintByRdcId',{params: {rdcId: $rootScope.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  		
  	  });
    };
    $scope.initData();
});

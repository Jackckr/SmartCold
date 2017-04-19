coldWeb.controller('maintenancenotice', function ($rootScope, $scope, $state, $cookies, $http, $location,baseTools) {
    $scope.status="1,2"; $scope.stmode=["未处理 ","待维修","维修中 ","已完成 ","已忽略"];//0:未处理 1：待处理  2:处理中 3已处理 4:已忽略
    $scope.level=undefined; $scope.keyword=undefined;
    $scope.initData=function(){
	  $http.get('/i/warningMint/getWarningMintByRdcId',{params: {rdcId: $rootScope.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  	  });
    };
    $scope.initData();
    //申请维修
    $scope.tol_forMaint=function(obj){$state.go('maintainRequest', {'ids': obj.id}); };
    //合并处理
    $scope.tol_batch=function(){
	   
    };
    
    
});

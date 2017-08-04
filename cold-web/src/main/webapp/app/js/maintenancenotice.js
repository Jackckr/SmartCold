coldWeb.controller('maintenancenotice', function ($rootScope, $scope, $state, $cookies, $http, $location,baseTools) {
    $scope.status="1,2,3,4,5"; 
    $scope.stmode=["未处理 ","待维修","等确认","维修中","维修清单确认","清单审核","已完成 ","已忽略"];
    $scope.level=undefined; $scope.keyword=undefined;
    $scope.initData=function(){
	  $http.get('/i/warningMint/getWarningMintByRdcId',{params: {rdcId: $rootScope.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  	  });
    };
    $scope.initData();
    //申请维修
    $scope.tol_forMaint=function(id,st){$state.go('maintainRequest', {'ids': id,st:st}); };
    //维修清单确认
    $scope.tol_gotRepair=function(id,st){$state.go('maintainRepair', {'ids': id,st:st}); };
    //清除故障
    $scope.tol_ignore=function(id,status,msg){
    	if(!confirm(msg)){return;}
    	$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids :id,userId: null,status:status}}).success(function (data) { $scope.initData();});
    };
    

    //合并处理
    $scope.tol_batch=function(){
	   
    };
    $("#oview").height($(".content-wrapper")[0].clientHeight);
    
});

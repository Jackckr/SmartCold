coldWeb.controller('maintenancenotice', function ($rootScope, $scope, $state, $cookies, $http, $location,baseTools) {
    $scope.status=1; $scope.setp=1;
    $scope.mode=["未处理 ","处理中 ","已处理 ","已忽略"];
    $scope.level=undefined; $scope.keyword=undefined;$scope.sqobj=undefined;
    $scope.initData=function(){
    	$scope.sqobj=undefined;
	  $http.get('/i/warningMint/getWarningMintByRdcId',{params: {rdcId: $rootScope.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  	  });
    };
    $scope.initData();
    //申请维修
    $scope.tol_forMaint=function(obj){
    	$scope.setp=2;
    	$scope.sqobj=obj;
//    	$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids:$scope.sqobj.id ,status:1}}).success(function (data) { 
//    		alert("维修信息已经提交！等待维修商处理");$scope.initData();
//    	});
    };
    //删除
    $scope.tol_del=function(id){
    	 if(!confirm("你确信要刪除这条告警吗？")){return;}
    	$http({method:'DELETE',url:'/i/warningMint/delMaintAlarmByIds',params:{'ids': id}}).success(function (data) {$scope.initData(); });
    };
    //忽略
    $scope.tol_ignore=function(id){
    	if(!confirm("你确信要忽略这条告警吗？")){return;}
    	$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids :id,status:3}}).success(function (data) { $scope.initData();});
    };
    //合并处理
    $scope.tol_batch=function(){
	   
    };
    
    $scope.tol_submit=function(){
    	$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids:$scope.sqobj.id ,status:1}}).success(function (data) { $scope.initData();});
    };

    
    
});

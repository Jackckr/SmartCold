coldWeb.controller('maintenancealarm', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location,baseTools) {
	$scope.st=$stateParams.st;
	if($scope.st==1||$scope.st==2){var statusmode=["0","0,1,2,3,4,5","6"];$scope.status=statusmode[$scope.st];}else{return;}
	$scope.setp=1;
	$scope.remode=["未处理 ","已忽略 ","解除故障","放弃维修"];//终止流程
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修清单确认","清单审核","已完成 "];//正常流程
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
    	$scope.setp=2;$scope.sqobj=obj;
    };
    //删除
    $scope.tol_del=function(id){
    	 if(!confirm("您确信要刪除这条告警吗？")){return;}$http({method:'DELETE',url:'/i/warningMint/delMaintAlarmByIds',params:{'ids': id}}).success(function (data) {$scope.initData(); });
    };
    //忽略
    $scope.tol_ignore=function(id,status,msg){
    	if(!confirm(msg)){return;}$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids :id,userId: $rootScope.user.id,status:status}}).success(function (data) { $scope.initData();});
    };
    //确定维修 ~维修确认
    $scope.tol_goMaint=function(id,st){$state.go('maintainRequest', {'ids': id,st:st}); };
    //维修清单确认
    $scope.tol_goMaintRepair=function(id,st){$state.go('maintainRepair', {'ids': id,st:st});};
    
    //合并处理
    $scope.tol_batch=function(){
	   
    };
    //查看维修结果
    $scope.tol_ckrest=function(id){
    	$state.go('maintainRepair', {'ids':id,'st':1});
    };
    
    $scope.tol_submit=function(){//
    	$http({
    		method: 'POST',
    		url: '/i/warningMint/upMaintAlarmstatuByIds',
    		params: {ids:$scope.sqobj.id ,userId: $rootScope.user.id,status:1,node:$("#tex_node").val()}
    	}).success(function (data) {  $scope.tol_back(); $scope.initData();});
    };
    
    $scope.tol_back=function(){
    	$scope.setp=1;	$scope.sqobj=undefined;
    };
    
    $scope.isselall=false;
    $scope.tol_selallevt=function(isck){
//    	$('#tb_body input[name="ck_obj"]').attr("checked",true);
    };
    
});


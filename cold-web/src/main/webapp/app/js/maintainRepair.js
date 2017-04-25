coldWeb.controller('maintainRepair', function ($rootScope, $scope, $state,$stateParams, $cookies, $http, $location,baseTools) {
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修确认","已完成 ","已忽略"];
	$scope.warids=$stateParams.ids;
	$scope.st=$stateParams.st;
	$http.get('/i/warningMint/getMaintenanceById',{params: {id: $scope.warids}}).success(function(data,status,config,header){
		  $scope.wardata=data.warData;
		  $scope.cuttstatus=$scope.wardata[0].status;
		  $scope.cuttdata= data.data;
		  $scope.warmappid=$scope.cuttdata.warmappid;
		  $scope.wuser= JSON.parse($scope.cuttdata.waruser),
		  $scope.company=JSON.parse($scope.cuttdata.companyinfo);
		  $scope.maintuser=	JSON.parse($scope.cuttdata.maintuser),
		  $scope.note=$scope.cuttdata.note;
//		  $scope.cost=	$scope.cuttdata.cost;
		  $("#wx").val($scope.cuttdata.repairtime);
		  $("#orderTime").val($scope.cuttdata.bookingtime);
//		  if($scope.cuttdata.servertype){
//			  var servers=  $scope.cuttdata.servertype.split(",");
//			  if(servers.length>0){ angular.forEach(servers,function(obj,i){  $("#ck_server"+obj).attr("checked", true); }); }
//		  }
	});
	
	
	$scope.cost=0.00;
	$scope.detailedList=[];
	$scope.uplist=function(isadd,index){
		if(isadd){
			var obj={pid:0,id:0,number:1,price:0};
			$scope.detailedList.push(obj);
		}else{
			$scope.detailedList.drop(index);
		}
	};


	 
    
});

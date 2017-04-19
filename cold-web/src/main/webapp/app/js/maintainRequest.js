coldWeb.controller('maintainRequest', function ($rootScope, $scope, $state,$stateParams, $cookies, $http, $location,baseTools) {
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修确认","已完成 ","已忽略"];
	$scope.warids=$stateParams.ids;
	$scope.st=$stateParams.st;
	if(!$scope.warids){return;}
	if($scope.st==0){
		$scope.note=undefined;$scope.cost=undefined; $scope.cuttstatus=1;
		$("#wx,#orderTime").jeDate({isinitVal:true,  skinCell:"jedateblue", isTime:true, minDate: $.nowDate(0),  format: 'YYYY-MM-DD hh:mm:ss'});
		 $http.get('/i/warningMint/getWarningMintById',{params: {ids: $scope.warids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
			  $scope.wardata=data.warData;
			  $scope.company=data.company;
			  $scope.wuser=data.user;
			  $scope.maintuser=$rootScope.user;
			 
	  	});
		$scope.submit=function(){
			var servertype="";
			var em_servertype=$("[name ='service']:checked");
			if(em_servertype.length>0){for(var i=0;i<em_servertype.length;i++){servertype += em_servertype[i].value +","; } servertype=servertype.substring(0,servertype.length-1);}
			var vo ={
			    		waruser:JSON.stringify($scope.wuser),
			    		maintuser:JSON.stringify($scope.maintuser),
			    		companyinfo:JSON.stringify( $scope.company),
			    		warMapper:JSON.stringify( $scope.wardata),
			    		warmappid:$scope.warids,
			    		note:$scope.note,
			    		cost:$scope.cost,
			    		repairtime :"2017-4-18 16:10:07",
				        bookingtime:"2017-4-20 16:10:12",
				        servertype:servertype
			  };
		      $.ajax({type: 'POST',data: vo,url: "/i/warningMint/addMaintenance",success: function(data){
		            alert("维修确认单已发送！");
		            $state.go("maintenancenotice");
		      }});
		};
	}else{
		 
		$http.get('/i/warningMint/getMaintenanceById',{params: {id: $scope.warids}}).success(function(data,status,config,header){
			  $scope.wardata=data.warData;
			  $scope.cuttstatus=$scope.wardata[0].status;
			  $scope.cuttdata= data.data;
			  $scope.warmappid=$scope.cuttdata.warmappid;
			  $scope.wuser= JSON.parse($scope.cuttdata.waruser),
			  $scope.company=JSON.parse($scope.cuttdata.companyinfo);
			  $scope.maintuser=	JSON.parse($scope.cuttdata.maintuser),
			  $scope.note=$scope.cuttdata.note;
			  $scope.cost=	$scope.cuttdata.cost;
			  $("#wx").val($scope.cuttdata.repairtime);
			  $("#orderTime").val($scope.cuttdata.bookingtime);
			  if($scope.cuttdata.servertype){
				  var servers=  $scope.cuttdata.servertype.split(",");
				  if(servers.length>0){ angular.forEach(servers,function(obj,i){  $("#ck_server"+obj).attr("checked", true); }); }
			  }
	  	});
		$("#div_maintainRequest input").attr({"disabled":"disabled"});
		$("#div_maintainRequest select").attr({"disabled":"disabled"});
		$("#div_maintainRequest .addBtn").attr({"disabled":"disabled"});
		$scope.tol_advice=function(isreject,status,msg){
			if(!confirm(msg)){return;}
			$http({method: 'POST',url: '/i/warningMint/rejectMaintenanceByWarId',params: {isreject:isreject, wid:$scope.warmappid, mid:$scope.warids, status:status}}).success(function (data) { 
				if(data){alert("提交成功！");}
				   $state.go("maintenancealarm");
			});
		};
		
	}
});

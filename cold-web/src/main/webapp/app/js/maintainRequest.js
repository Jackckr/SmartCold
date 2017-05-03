coldWeb.controller('maintainRequest', function ($rootScope, $scope, $state,$stateParams, $cookies, $http, $location,baseTools) {
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修确认","已完成 ","已忽略"];
	$scope.warids=$stateParams.ids;$scope.st=$stateParams.st;
	if(!$scope.warids){return;}
	$scope.maintenance={note:"", cost:0.00,repairtime:null, bookingtime:null };
	$scope.initdata=function(){
		$http.get('/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
	    	 $scope.pwartype=data;
	  	});
	    $http.get('/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
	    	 $scope.subwartype=data;//默认二级菜单
	  	});
	    $http.get('/i/warningMint/getWarningMintById',{params: {ids: $scope.warids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
			  $scope.company=data.company;//公司信息
			  $scope.wuser=data.user;//维修人员信息
			  $scope.maintuser=$rootScope.user;//维修人
			  $scope.wardata=data.warData;//初始告警信息
			  $scope.cuttstatus=$scope.wardata[0].status;
	  	 });
	};
	$scope.initdata();
	
	 $scope.swartype=new Array();    $scope.nwardata=new Array();
	if($scope.st==0){//查看or 审批
		
		$("#wx,#orderTime").jeDate({isinitVal:true,  skinCell:"jedateblue", isTime:true, minDate: $.nowDate(0),  format: 'YYYY-MM-DD hh:mm:ss'});
	 	$scope.addSelect=function(){//添加故障
	 		var item={id:2,pid:1};
	 		var index=  $scope.nwardata.push(item);
	 		$scope.swartype[index-1]=$scope.subwartype;
	     };
	     $scope.removerSelect=function(index){ $scope.nwardata.pop(index); };
	     $scope.changepwartype=function(index,item){//修改类型
	    	 $http.get('/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
	    		 $scope.swartype[index]=data;
	    		 item.id=$scope.swartype[index][0].id;
		  	 });
	     };
		$scope.submit=function(){
			var servertype="";
			var em_servertype=$("[name ='service']:checked");
			if(em_servertype.length>0){for(var i=0;i<em_servertype.length;i++){servertype += em_servertype[i].value +","; } servertype=servertype.substring(0,servertype.length-1);}
			$scope.maintenance.servertype=servertype;
			$scope.maintenance.rdcid=$rootScope.rdcId;
			$scope.maintenance.warmappid=$scope.warids;
			$scope.maintenance.repairtime=$("#wx").val();
			$scope.maintenance.bookingtime=$("#orderTime").val();
			$scope.maintenance.faultmapper=JSON.stringify( $scope.nwardata);
		    $.ajax({type: 'POST',data: $scope.maintenance,url: "/i/warningMint/addMaintenance",success: function(data){
		            alert("维修确认单已发送！");
		            $state.go("maintenancenotice");
		   }});
		};
	}else{
		 //查看
		$http.get('/i/warningMint/getMaintenanceByWId',{params: {wid: $scope.warids}}).success(function(data){
			$scope.maintenance=data;
			$("#wx").val($scope.maintenance.repairtime);
			$("#orderTime").val($scope.maintenance.bookingtime);
			$scope.nwardata=JSON.parse($scope.maintenance.faultmapper);
			angular.forEach($scope.maintenance.servertype.split(","),function(obj,i){
				$("#ck_server"+obj).attr("checked",true);
			});
			angular.forEach($scope.nwardata,function(obj,i){
				$http.get('/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
		    		 $scope.swartype[i]=data;
			  	 });
			}); 
		});
		
		$("#div_maintainRequest input").attr({"disabled":"disabled"});
		$scope.tol_advice=function(isreject,status,msg){
			if(!confirm(msg)){return;}
			$http({method: 'POST',url: '/i/warningMint/rejectMaintenanceByWarId',params: {isreject:isreject, wid:$scope.warids, mid:$scope.maintenance.id, status:status}}).success(function (data) { 
				if(data){alert("提交成功！");}else{alert("提交失敗！流程已锁定！");}
				   $state.go("maintenancealarm", {'st': 1});
			});
		};
		
	}
});

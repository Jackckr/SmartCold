coldWeb.controller('maintainRepair', function ($rootScope, $scope, $state,$stateParams, $cookies, $http, $location,baseTools) {
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修清单确认","维修签字","已完成 "];
	$scope.unit=[{id:1,name:'个'},{id:2,name:'套'},{id:3,name:'台'}];
	$scope.swartype=new Array();  $scope.faultmapper=new Array();//实际故障
	$scope.mwartype=new Array();  $scope.maintresult=new Array();//实际处理结果
	$scope.ordertype=new Array(); $scope.detailedList=new Array();//订单结果
	$scope.wids=$stateParams.ids,$scope.st=$stateParams.st;$scope.maintid=null;
	$scope.cuttusertype=($scope.st==1&&($rootScope.userType==0||$rootScope.userType>2));
	$http.get('/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
    	 $scope.pwartype=data;
  	});
    $http.get('/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
    	 $scope.subwartype=data;//默认二级菜单
  	});
    //获得初始异常消息
    $http.get('/i/warningMint/getWarningMintById',{params: {ids: $scope.wids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
		  $scope.company=data.company;//公司信息
		  $scope.wuser=data.user;//维修人员信息
		  $scope.maintuser=$rootScope.user;//维修人
		  $scope.wardata=data.warData;//初始告警信息
		  $scope.cuttstatus=$scope.wardata[0].status;
  	 });
    //获得附加异常消息   
    $http.get('/i/warningMint/getMaintenanceByWId',{params: {wid:$scope.wids}}).success(function(data){
		$scope.maintenance=data;
		$scope.maintid=$scope.maintenance.id;
		$scope.faultmapper=JSON.parse($scope.maintenance.faultmapper);
		angular.forEach($scope.faultmapper,function(obj,i){
			$http.get('/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
	    		 $scope.swartype[i]=data;
		  	 });
		}); 
		 $scope.initMode();
	});
	
    $scope.initMode=function(){
		if( $scope.st==0){//服务新建维修单
			 $scope.cuttstatus=4;
			$("#begin,#end").jeDate({isinitVal:true, skinCell:"jedateblue", minDate:  $.nowDate(0),  format: 'YYYY-MM-DD-hh:mm'});
			//1.实际故障联动
			$scope.addfSelect=function(){//添加故障
		 		var item={id:2,pid:1};
		 		var index=  $scope.faultmapper.push(item);
		 		$scope.swartype[index-1]=$scope.subwartype;
		     };
		     $scope.removerfSelect=function(index){ $scope.faultmapper.pop(index); };
		     $scope.changefselecttype=function(index,item){//修改类型
		    	 $http.get('/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
		    		 $scope.swartype[index]=data;
		    		 item.id=$scope.swartype[index][0].id;
			  	 });
		     };
		     //2.实际维修联动
		     $scope.addmSelect=function(){//添加故障
			 		var item={id:2,pid:1};
			 		var index=  $scope.maintresult.push(item);
			 		$scope.mwartype[index-1]=$scope.subwartype;
		    };
			$scope.removermSelect=function(index){ $scope.maintresult.pop(index); };
			$scope.changemselecttype=function(index,item){
				 $http.get('/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
		    		 $scope.mwartype[index]=data;
		    		 item.id=$scope.mwartype[index][0].id;
			  	 });
			};
			//3.订单详情order
			 $scope.uplist=function(isadd,index){
				if(isadd){	
					var obj={wpid:1,wid:2,number:1,price:0.00,unit:1,rdcId:$rootScope.rdcId,maintid:$scope.maintenance.id};
					 index=$scope.detailedList.push(obj);
					 $scope.ordertype[index-1]=$scope.subwartype;
				}else{
					$scope.detailedList.pop(index);
			 }};
	         $scope.changeordertype=function(index,item){//修改清单父级选项
	        	 $http.get('/i/warningMint/getWarningType',{params: {pid: item.wpid}}).success(function(data){
		    		 $scope.ordertype[index]=data;
		    		 item.wid=$scope.ordertype[index][0].id;
			  	 });
		     };
			$scope.cost=0.00;
			var watch =$scope.$watch('detailedList', function(){ $scope.cost=0; angular.forEach($scope.detailedList,function(obj,i){  $scope.cost+=obj.number*obj.price;}); },true);//监听
			$scope.$on('$destroy',function(){  watch;});
			//提交维修清单 
			$scope.addMaintenance=function(){
				var servertype="";
				var em_servertype=$("[name ='service']:checked");
				if(em_servertype.length>0){for(var i=0;i<em_servertype.length;i++){servertype += em_servertype[i].value +","; } servertype=servertype.substring(0,servertype.length-1);}
				var vo ={ 
						wids:$scope.wids,
						 rdcId:$rootScope.rdcId ,
						 maintid:$scope.maintid,
						 starttime:$("#begin").val(),
						 endtime:$("#end").val(),
						 phenomena:JSON.stringify($scope.faultmapper),
						 maintresult:JSON.stringify($scope.maintresult),
						 detaileds:JSON.stringify($scope.detailedList),
						 cost:$scope.cost,
						 note:$scope.note,
						 serverType:servertype
			  };
			  $http({ method:'POST', params: vo,  url:'/i/warningMint/addMaintConfirma' }).success(function(data){ 
				  alert(data?"提交成功！":"提交失败");
				  $state.go("maintenancenotice");
			  }) ;
			}; 
		}else{//查看
			  $http.get('/i/warningMint/getMaintconFirmaByMid',{params: {mid:$scope.maintid}}).success(function(data){
				if(data&&data.length>0){
					  $scope.maintconfirma=data[0];
					  $scope.cost=$scope.maintconfirma.cost;
					  $scope.note=$scope.maintconfirma.note;
					  $("#radio_service"+$scope.maintconfirma.serverType).attr("checked",true);
					  $("#begin").val( $scope.maintconfirma.starttime);
					  $("#end").val( $scope.maintconfirma.endtime);
					  $scope.phenomena=JSON.parse($scope.maintconfirma.phenomena);//实际现象
					  $scope.maintresult=JSON.parse($scope.maintconfirma.maintresult);//实际结果
					  if( $scope.maintresult.length>0){
						  angular.forEach( $scope.maintresult,function(obj,i){ 
							  $http.get('/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(req){
						    		 $scope.mwartype[i]=req;
							  	 });
						  });
					  }
				  }
			  });
			  //获得订单详情
			  $http.get('/i/warningMint/getMaintorderByMid',{params: {mid:$scope.maintid}}).success(function(data){
				  if(data.length>0){
					  angular.forEach(data,function(obj,i){ 
						  $http.get('/i/warningMint/getWarningType',{params: {pid: obj.wpid}}).success(function(req){
					    		 $scope.ordertype[i]=req;
						  	 });
					  });
					  $scope.detailedList=data;
				  }
			  });
			  $("#div_maintainRepair input").attr({"disabled":true});
			
			  if($scope.cuttstatus==6){
				  $('#star').raty({precision: true ,score: $scope.maintenance.score, size     : 24 });
				  $("#txt_evaluate").val($scope.maintenance.evaluate);
			  }else if($scope.cuttusertype){
					  $("#txt_evaluate").attr({"disabled":false});
					  $('#star').raty({precision: true ,score: 5, size     : 24, });
					  $scope.tol_advice=function(isreback,status,msg){
						  $http({method: 'POST',url: '/i/warningMint/rejectMaintconfirmaById',
							  params: {  isreback:isreback, wid:$scope.wids, mid:$scope.maintid, status:status, score :$("#star input").val(), evaluate:$("#txt_evaluate").val()}}).success(function (data) { 
								if(data){alert("维修完成！");}else{alert("提交失敗！流程已锁定！");}
								   $state.go("maintenancealarm", {'st': 1});
							});
						  
					  };
				  }
		}   
    };
	
});

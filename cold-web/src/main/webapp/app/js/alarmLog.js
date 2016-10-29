
/**
 * Created by maqiang34 on 16/10/18.
 * 计算压缩机剩余时间
 */
coldWeb.controller('baoyangReminder', function( $scope, $rootScope,$http ,$timeout) {
	$scope.smgroid=null;
	$scope.sytime=undefined;$scope.exqfn=false;
	$(".mainHeight").height( $(".content-wrapper").height());
	$scope.inintData=function(newValue,oldValue){//初始化冷库门
		   if($rootScope.compressorGroups!=undefined){
			   $scope.exqfn=true;
			   watch(); //销毁监听
			   var oid=[]; angular.forEach($rootScope.compressorGroups,function(item){ oid.push( item.id);  }); 
			   $scope.smgroid=oid.join(',');
			   $http.get('i/physicalController/getCompressorinfo', {params: {oids: $scope.smgroid}} ).success(function(data, status, headers, config) {   
				   $scope.sytime=data.entity;
				   angular.forEach($rootScope.compressorGroups,function(item){ 
					   angular.forEach(item.compressors,function(obj){ 
						   obj.sytm=   $scope.aredayTime(obj);
					 }); 
				   }); 
			   });
		   }
	 };
	 $scope.aredayTime = function(obj) {
		 if(obj.maintenancetime&&obj.lastMaintainTime){
			   var sytime= $scope.sytime[obj.id];  if(sytime<=0){   return '已超保养期'+sytime;} return "还剩  "+ parseInt(sytime)+"小时";
		 }else{
			 return "未设置保养时间"; 
		 }
      };
      $scope.chanvl=function(){
    	  $scope.inintData(null,null);
      };
      $scope.changerdc=function(){
    	  if($scope.exqfn){
    		  $scope.exqfn=false;
    		  $timeout($scope.chanvl,500);
    	  }
      };
      var watch =$scope.$watch('compressorGroups', $scope.inintData,true);//监听冷库变化
      $scope.$watch('rdcId', $scope.changerdc,true);//监听冷库变化
      
      
});
/**
 * 
 * 　　报警信息
 */
coldWeb.controller('alarmLog', function( $scope, $http,$timeout) {
	 //根据rdcid查询该rdc的报警信息
	$(".mainHeight").height( $(".content-wrapper").height());
		$scope.initData=function(){
			$http.get('/i/warlog/findWarningLogsByRdcID', {  params: { "rdcId": window.sessionStorage.smrdcId  } }).success(function (data) {
	            $scope.alarmMsgs = data;
	        });
		};
		$scope.inittable=function(){
			$("#alarmLog").DataTable();
		};
		$scope.initData();
		$timeout($scope.initData,60000);
//		$timeout($scope.inittable,800);
});


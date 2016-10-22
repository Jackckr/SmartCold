
/**
 * Created by maqiang34 on 16/10/18.
 * 计算压缩机剩余时间
 */
coldWeb.controller('baoyangReminder', function( $scope, $rootScope ) {
	$(".mainHeight").height( $(".content-wrapper").height());
	 $scope.aredayTime = function(time) {
			return "还剩"+ time+"小时";
      };
});
/**
 * 
 * 　　报警信息
 */
coldWeb.controller('alarmLog', function( $scope, $http,$timeout) {
	 //根据rdcid查询该rdc的报警信息
		$("#alarmLog").DataTable(); 
		$scope.initData=function(){
			$http.get('/i/warlog/findWarningLogsByRdcID', {  params: { "rdcId": window.sessionStorage.smrdcId  } }).success(function (data) {
	            $scope.alarmMsgs = data;
	        });
		};
		$timeout($scope.initData,10);
		$scope.initData();
        
});


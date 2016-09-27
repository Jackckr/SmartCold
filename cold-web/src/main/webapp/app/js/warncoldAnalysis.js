/**
 * 制冷告警统计
 */
coldWeb.controller('warncoldAnalysis', function ($scope, $stateParams, $http,$rootScope) {
	$scope.rdcid = $stateParams.rdcId;
	$scope.initdata=function(){
		$http.get('/i/warn/getWarncoldAnalysis',{params: {rdcId:$scope.rdcid}} ).success(function(data,status,headers,config){
			if(data.success){
				
				}else{
//					alert(data.message);
				}
		});
	};
	$scope.initdata();
});
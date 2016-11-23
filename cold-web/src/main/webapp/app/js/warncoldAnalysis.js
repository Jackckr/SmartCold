/**
 * Created by maqiang34 on 16/10/18.
 * 制冷告警统计
 */
coldWeb.controller('warncoldAnalysis', function ($scope, $stateParams, $http,$rootScope) {
	$scope.rdcid = $stateParams.rdcId;
	$scope.initdata=function(){
		$http.get('/i/warn/getWarncoldAnalysis',{params: {rdcId:$scope.rdcid}} ).success(function(data,status,headers,config){
			if(data.success){
				$scope.cuttdata=data.entity.cuttdata;
				$scope.lsttdata=data.entity.lsttdata;
				debugger;
				if($scope.cuttdata.length>0){
					
				}
				if($scope.lsttdata.length>0){
					
				}

				
				
				}
		});
	};
	$scope.initdata();
});
coldWeb.controller('waterCost', function($rootScope, $scope, $http,baseTools,$timeout) {
	$scope.load = function(){
		barCharts = echarts.init($('#bar')[0]);
		$http.get("/i/compressorGroup/getAllWaterCostByRdcId?rdcId=" + $rootScope.rdcId).success(
				function(data,status,headers,config){
					$scope.waterCosts = data;
					var xData = []
					var yData = []
					angular.forEach($scope.waterCosts,function(item){
						xData.push(item.compressorGroupName);
						yData.push(item.waterCost);
					})
					option = baseTools.getEchartSingleOption('日实时累积耗水量', xData, yData, '耗水量', 't', '耗水量', 'bar');
					barCharts.setOption(option);
				})
	}
	
	$timeout(function(){
		$scope.load();
	},0)
	clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);
});
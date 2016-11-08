/**
 * 旧的水耗  准备在2016-11后去掉
 */
coldWeb.controller('waterCost', function($rootScope, $scope, $http,baseTools,$timeout) {
	$scope.load = function(){
		barCharts = echarts.init($('#bar')[0]);
		$http.get("/i/compressorGroup/getAllWaterCostByRdcId?rdcId=" + $rootScope.rdcId).success(
				function(data,status,headers,config){
					$scope.waterCosts = data;
					var currentWaterCost = '';
	                if (data.length > 0) {
	                    currentWaterCost = data[data.length - 1] ? parseFloat(data[data.length - 1].waterCost).toFixed(2) : '';
	                };
	                $scope.currentWaterCost = currentWaterCost;
					var xData = [];
					var yData = [];
					angular.forEach($scope.waterCosts,function(item){
						xData.push(item.compressorGroupName);
						yData.push(item.waterCost);
					});
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
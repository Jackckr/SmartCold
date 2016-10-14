coldWeb.controller('cpswaterCost', function ($scope,$http, $location,$stateParams,baseTools,$rootScope) {
	$scope.groupID =  $stateParams.groupID;
	$scope.load = function(){	
		lineChart = echarts.init($('#line')[0]);
		endTime = baseTools.getFormatTimeString();
		startTime = baseTools.getFormatTimeString(-4 * 60 * 60 * 1000);
		url = "/i/baseInfo/getKeyValueDataByTime?type=3&oid=" + $scope.groupID
			  + "&key=WaterCost" + "&startTime=" + startTime + "&endTime=" + endTime;
		$http.get(url).success(function(data,status,headers,config){
			$scope.waterData = data;
			var xData = [];
			var yData = [];
			angular.forEach($scope.waterData,function(item){
				xData.unshift(baseTools.formatTimeToMinute(item.addtime));
				yData.unshift(item.value * powerSet.radio);
			});
			var currentPower = '';
            if (data.length > 0) {
                currentPower = data[data.length - 1] ? parseFloat(data[data.length - 1].value  * powerSet.radio).toFixed(1) : '';//
            };
            $scope.currentPower = currentPower;
			option = baseTools.getEchartSingleOption('累积水耗实时监控', xData, yData, '电量', 'kW.h', '电量', 'line', parseInt(yData[0]));
			lineChart.setOption(option);
		});
		
	};
	
	$scope.load();
	clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () { $scope.load(); }, 30000);
    $scope.$on('$destroy',function(){clearInterval($rootScope.timeTicket); });
});
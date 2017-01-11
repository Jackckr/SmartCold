/**
 * Created by maqiang34 on 16/10/18.
 * 水耗展示
 */
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
				yData.unshift(item.value);
			});
			var currentWater = '';
            if (data.length > 0) {
            	currentWater = data[0] ? parseFloat(data[0].value).toFixed(1) : '';//
            };
            $scope.currentWater = currentWater;
			option = baseTools.getEchartSingleOption('', xData, yData, '耗水量', 't', '耗水量', 'line', parseInt(yData[0]));
			lineChart.setOption(option);
		});
		
	};
	
	$scope.load();
	clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () { $scope.load(); }, 30000);
    $scope.$on('$destroy',function(){clearInterval($rootScope.timeTicket); });
});
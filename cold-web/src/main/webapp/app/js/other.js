coldWeb.controller('other', function ($scope, $location, $timeout, $http,$rootScope,baseTools) {
	$scope.load = function(){
		$scope.keyDescribleMap = {forkLift:"叉车日耗能",windScreen:"风幕机日耗能",
				pressurePlatform:"液压平台日耗能",chargingPile:"充电桩日耗能"}
		url = "/i/other/findOtherDeviceCosts?rdcId=" + $rootScope.rdcId + "&startTime=" 
		+ baseTools.getFormatTimeString(-30 * 24 * 60 * 60 * 1000) + "&endTime=" + baseTools.getFormatTimeString()
		$http.get(url).success(function(data,status,config,headers){
			$scope.otherInfos = data;
			angular.forEach(data,function(infos,key){
				var chartId = "#" + key + "Chart"
				var chart = echarts.init($(chartId).get(0));
				var xData = []
				var yData = []
				angular.forEach(infos,function(info){
					yData.push(info.cost)
					xData.push(baseTools.formatTime(info.time))
				})
				chart.setOption(baseTools.getEchartSingleOption($scope.keyDescribleMap[key], xData, yData, 
						"耗能", "kW.h", $scope.keyDescribleMap[key], "line"))
			})
		})
	}
	
	$timeout(function(){
		$scope.load();
	},0)
})
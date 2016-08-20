coldWeb.controller('power', function ($scope,$http, $location,$stateParams,baseTools) {
	
	$scope.load = function(){	
		lineChart = echarts.init($('#line')[0]);
		$scope.electricMap = {AU:null,BU:null,CU:null,AI:null,BI:null,CI:null};
		$scope.powerid = $stateParams.powerid;
		endTime = baseTools.getFormatTimeString();
		startTime = baseTools.getFormatTimeString(-1 * 60 * 60 * 1000);
		url = "/i/baseInfo/getKeyValueDataByTime?type=" + 10 + "&oid=" + $scope.powerid 
			  + "&key=PWC" + "&startTime=" + startTime + "&endTime=" + endTime;
		$http.get(url).success(function(data,status,headers,config){
			$scope.powerData = data;
			var xData = [];
			var yData = [];
			angular.forEach($scope.powerData,function(item){
				xData.push(baseTools.formatTime(item.addtime))
				yData.push(item.value)
			})
			option = baseTools.getEchartSingleOption('累积电量实时监控', xData, yData, '电量', 'kW.h', '电量', 'line');
			lineChart.setOption(option);
		})
		templateUrl = "/i/baseInfo/getKeyValueData?type=" + 10 + "&oid=" + $scope.powerid 
			  + "&nums=1" + "&key="
	    angular.forEach($scope.electricMap,function(item,key){
	    	$http.get(templateUrl + key).success(function(data,status,headers,config){
	    		$scope.electricMap[key] = data.length == 0 ? {value:null} : data[0];
	    	})
	    })
	}
	
	$scope.load();
});
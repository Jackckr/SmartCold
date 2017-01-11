coldWeb.controller('power', function ($scope,$http, $location,$stateParams,baseTools,$rootScope) {
	
	
	$scope.preLoad = function(){
		url = '/i/power/findById?id=' + $stateParams.powerid;
		$http.get(url).success(function(data,status,config,header){
			$scope.load(data);
		})
	}
	
	$scope.load = function(powerSet){	
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
				xData.unshift(baseTools.formatTimeToMinute(item.addtime))
				yData.unshift(item.value * powerSet.radio)
			})
			var currentPower = '';
            if (data.length > 0) {
                currentPower = data[data.length - 1] ? parseFloat(data[data.length - 1].value  * powerSet.radio).toFixed(1) : '';
            };
            $scope.currentPower = currentPower;
			option = baseTools.getEchartSingleOption('', xData, yData, '电量', 'kW.h', '电量', 'line', parseInt(yData[0]));
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
	
	$scope.preLoad();
	clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
    	$scope.preLoad();
    }, 30000);
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
});
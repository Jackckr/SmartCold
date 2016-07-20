coldWeb.controller('base', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	$rootScope.load = function () {
    }
	
	$scope.getDateTimeStringBefore = function(before){
		return new Date(new Date().getTime() - before*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,'');
	}
	
	$scope.load = function(){		
		$scope.startTime = $scope.getDateTimeStringBefore(3);
		$scope.endTime = $scope.getDateTimeStringBefore(0);
		$scope.picktime = $scope.startTime + ' - ' + $scope.endTime;
		$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
		$http.get("/i/coldStorageSet/findAllColdStorage").success(function(data,status,headers,config){
			$scope.coldStorages = data;
			$scope.choseStorage = data[0];
			$scope.loadData();
		})
	}
	
	function getOption(xData,temperature){
		return option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['温度']
				},
				calculable : true,
				xAxis : [
				         {
				        	 type : 'category',
				        	 data : xData
				         }
				         ],
				         yAxis : [
				                  {
				                	  type : 'value',
				                	  name : '温度',
				                	  axisLabel : {
				                		  formatter: '{value} °C'
				                	  }
				                  }
				                  ],
				                  series : [
				                            {
				                            	name:'温度',
				                            	type:'line',
				                            	data:temperature,
				                            }
				                            ]
		};
	}
	
	$scope.loadData = function(){
		var lineChart = echarts.init($('#temperature-chart')[0]);
		var lineChart2 = echarts.init($('#temperature-chart2')[0]);
		bothTime = $scope.picktime.split(" - ");
		$scope.startTime = bothTime[0];
		$scope.endTime = bothTime[1];
		$http.get("/i/findByTime?key=Temp&startTime=" + $scope.startTime + "&endTime=" + $scope.endTime).success(
				function(data,status,config,headers){
			xData = [];
			temperature = [];
			angular.forEach(data,function(item){
				xData.push(item.addtime);
				temperature.push(item.value);
			})
			option = getOption(xData,temperature);
			lineChart.setOption(option);
		})
		$http.get("/i/coldStorage/findInfoByIdTime?storageId=" + $scope.choseStorage.id + "&startTime=" + $scope.startTime + "&endTime=" + $scope.endTime).success(
				function(data,status,config,headers){
			xData2 = [];
			temperature2 = [];
			angular.forEach(data,function(item){
				xData2.push(item.addTime);
				temperature2.push(item.temperature);
			})
			option = getOption(xData2,temperature2);
			lineChart2.setOption(option);
		})
	}
    
	$rootScope.logout = function () {
    	$http.get('/i/user/logout');
    	$rootScope.user = null;
		window.location.pathname="";
		window.location.href = "/login.html";
		window.event.returnValue=false;
    }
    
    $scope.load();

    
});

coldWeb.controller('error', function ($scope, $location,rejection) {
	$scope.status = rejection.status;
	
	if(rejection.status == 401){
		$scope.message = rejection.data.errorMsg;
	}else{
		$scope.message = rejection.statusText;
	}
});

coldWeb.controller('about', function ($scope, $location,$http) {
});

coldWeb.controller('login', function ($scope, $location,$window) {
	
});
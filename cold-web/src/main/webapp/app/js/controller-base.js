coldWeb.controller('base', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	$rootScope.load = function () {
    }
	
//	$scope.getDateTimeStringBefore = function(before){
//		return new Date(new Date().getTime() - before*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,'');
//	}
//	
	$scope.load = function(){		
//		$scope.startTime = $scope.getDateTimeStringBefore(3);
//		$scope.endTime = $scope.getDateTimeStringBefore(0);
//		$scope.picktime = $scope.startTime + ' - ' + $scope.endTime;
//		$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
//		$http.get("/i/coldStorageSet/findAllColdStorage").success(function(data,status,headers,config){
//			$scope.coldStorages = data;
//			$scope.choseStorage = data[0];
//			$scope.loadData();
//		})
	}
//	
//	function getOption(xData,temperature){
//		return option = {
//				tooltip : {
//					trigger: 'axis'
//				},
//				legend: {
//					data:['温度']
//				},
//				calculable : true,
//				xAxis : [
//				         {
//				        	 type : 'category',
//				        	 data : xData
//				         }
//				         ],
//				         yAxis : [
//				                  {
//				                	  type : 'value',
//				                	  name : '温度',
//				                	  axisLabel : {
//				                		  formatter: '{value} °C'
//				                	  }
//				                  }
//				                  ],
//				                  series : [
//				                            {
//				                            	name:'温度',
//				                            	type:'line',
//				                            	data:temperature,
//				                            }
//				                            ]
//		};
//	}
//	
//	$scope.init_table = function(tableName,deviceid,key,startTime,endTime){
//		var lineChart = echarts.init($(tableName)[0]);
//		$http.get("/i/findByTime?deviceid=" + deviceid+ "&key=" + key + 
//				"&startTime=" + $scope.startTime + "&endTime=" + $scope.endTime).success(
//				function(data,status,config,headers){
//			xData = [];
//			temperature = [];
//			angular.forEach(data,function(item){
//				xData.push(item.addtime);
//				temperature.push(item.value);
//			})
//			option = getOption(xData,temperature);
//			lineChart.setOption(option);
//		})
//	}
//	
//	$scope.loadData = function(){
//		var lineChart = echarts.init($('#temperature-chart')[0]);
//		bothTime = $scope.picktime.split(" - ");
//		$scope.startTime = bothTime[0];
//		$scope.endTime = bothTime[1];
//		$http.get("/i/baseInfo/getKeyValueDataByTime?oid=" + $scope.choseStorage.id + "&startTime=" + 
//				$scope.startTime + "&endTime=" + $scope.endTime + "&type=1&key=temperature"
//				).success(
//				function(data,status,config,headers){
//			xData2 = [];
//			temperature2 = [];
//			angular.forEach(data,function(item){
//				xData2.push(item.addtime);
//				temperature2.push(item.temperature);
//			})
//			option = getOption(xData2,temperature2);
//			lineChart.setOption(option);
//		})
//		$scope.init_table('#temperature-chart1',1,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart2',2,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart3',3,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart5',5,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart7',7,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart8',8,"Temp",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart9',5,"PWC",$scope.startTime,$scope.endTime);
//		$scope.init_table('#temperature-chart10',8,"switch",$scope.startTime,$scope.endTime);
////		$http.get("/i/coldStorage/getTempByNums?oid=" + $scope.choseStorage.id + "&nums=1").success(
////				function(data,status,headers,config){
////					$scope.coldstorageTmp = data.temperature?data.temperature:null;
////				})
//		$scope.currentData = [{id:1,key:"Temp"},{id:2,key:"Temp"},{id:3,key:"Temp"},{id:5,key:"Temp"},
//		                      {id:7,key:"Temp"},{id:8,key:"Temp"},{id:5,key:"PWC"},{id:8,key:"switch"}]
//		angular.forEach($scope.currentData,function(item,index){
//			$http.get("/i/findLastNDataByApid?deviceid=" + item.id + "&key=" + item.key + "&n=1").success(
//					function(data,status,headers,config){
//						$scope.currentData[index].value = data[0]?data[0].value:null;
//					})
//		})
//	}
//    
	$rootScope.logout = function () {
    	$http.get('/i/user/logout');
    	$rootScope.user = null;
		window.location.pathname="";
		window.location.href = "/login.html";
		window.event.returnValue=false;
    }
//    
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
coldWeb.controller('search', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	
	$scope.search = function(){
		$location.path("/multi-query/" + $scope.key);
	}
	
});
coldWeb.controller('multi-query', function ($rootScope, $scope, $cookies, $http ,$location,$window, $stateParams) {
	$scope.key = $stateParams.key;
	
	$scope.load = function(){
		url = "/i/singleInfo/findByKey?key=" + $scope.key;
		$http.get(url).success(function(data,status,config,header){
			if(data.infos.length == 0){
				alert("没有查询到相应商品");
				$location.path('/search')
			}else{
				$scope.singleInfo = data;
				$scope.singleChart($scope.singleInfo);
			}
		})
	}
	
	$scope.dateToStr = function(datetime){ 
		 var year = datetime.getFullYear();
		 var month = datetime.getMonth()+1;//js从0开始取 
		 var date = datetime.getDate(); 
		 var hour = datetime.getHours(); 
		 var minutes = datetime.getMinutes(); 
		 var second = datetime.getSeconds();
		 
		 if(month<10){
		  month = "0" + month;
		 }
		 if(date<10){
		  date = "0" + date;
		 }
		 if(hour <10){
		  hour = "0" + hour;
		 }
		 if(minutes <10){
		  minutes = "0" + minutes;
		 }
		 if(second <10){
		  second = "0" + second ;
		 }
		 
		 var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second;
		 return time;
	}
	
	$scope.singleChart = function(data){
		var lineChart = echarts.init(document.getElementById("chart"));
	    // This will get the first returned node in the jQuery collection.
    	var time = [];
    	var temperature = [];
    	var warning = [];
    	angular.forEach(data.ananysis,function(item){
    		item.startTime = $scope.dateToStr(new Date(Date.parse(item.startTime)));
    		item.endTime = $scope.dateToStr(new Date(Date.parse(item.endTime)));
    	})
    	angular.forEach(data.infos,function(item){
    		item.time = $scope.dateToStr(new Date(Date.parse(item.time)))
    		time.push(item.time);
    		temperature.push(item.temperature);
    		warning.push(-9);
    	});
	    	option = {
				    tooltip : {
				        trigger: 'axis'
				    },
				    calculable : false,
				    legend: {
				        data:['温度']
				    },
				    xAxis : [
				        {
				            type : 'category',
				            splitLine: {
				                show: false
				            },
				            data : time
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            name : '温度',
				            axisLabel : {
				                formatter: '{value} °C'
				            },
				            splitLine: {
				                show: false
				            }
				        }
				    ],
				    series : [
				        {
				            name:'温度',
				            type:'line',
				            data:temperature,
				            itemStyle:{
				            	normal:{
					            	lineStyle: {  
				                        color:'green'  
				                    }
					            }
				            },
				        },
				        {
				            name: '警戒线',
				            type: 'line',
				            data:[-9],
				            itemStyle:{
				            	normal:{
					            	lineStyle: {  
				                        color:'red'  
				                    }
					            }
				            },
				            markLine : {
				            	itemStyle:{
					            	normal:{
						            	lineStyle: {  
					                        color:'#ff0000'  
					                    }
						            }
					            },
				                data : [
				                        {type : 'average', name : '警戒线'}
				                ]
				            }
				        }
				    ]
				};
			lineChart.setOption(option);
	  };
	  
	$scope.batchLoad = function(){
		$scope.batchInfo();
	}
	$scope.batchInfo = function(){
		url = "/i/singleInfo/findBatchByKey?key=" + $scope.key;
		$scope.warnings = 0;
		$http.get(url).success(function(data,status,config,headers){
			$scope.batchData = data;
			angular.forEach($scope.batchData,function(item){
				$scope.warnings += item.overTemperatureTimes >=1?1:0;
			})
			$scope.huosunChart();
		});
	}
	
	$scope.huosunChart = function(){
		var hsChart = echarts.init(document.getElementById("HSChart"));
		xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
		var temperature = [];
		var loss = [];
		for(i=0;i<12;i++){
			temperature.push(Math.random() * 10);
			loss.push(Math.random() * 100);
		}
		
		option = {
			    tooltip : {
			        trigger: 'axis'
			    },
			    calculable : true,
			    legend: {
			        data:['温度','货损量']
			    },
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
			        },
			        {
			            type : 'value',
			            name : '货损量',
			            axisLabel : {
			                formatter: '{value} kg'
			            }
			        }
			    ],
			    series : [
			        {
			            name:'货损量',
			            type:'bar',
			            yAxisIndex: 1,
			            data:loss
			        },
			        {
			            name:'温度',
			            type:'line',
			            data:temperature
			        }
			    ]
			};
		hsChart.setOption(option);
	}
	
	$scope.load();
});

coldWeb.controller('goods-list', function ($rootScope, $scope, $cookies, $http ,$location,$window, $stateParams) {
    $scope.key = $stateParams.key;
	
	$scope.load = function(){
		url = "/i/singleInfo/findBatchByKey?key=" + $scope.key;
		$scope.warnings = 0;
		$http.get(url).success(function(data,status,config,headers){
			$scope.batchData = data;
		});
	}
	
	$scope.load();
});

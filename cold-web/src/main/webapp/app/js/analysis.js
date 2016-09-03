coldWeb.controller('overTemperature', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'ChaoWenShiJian'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData = []
					var chartId = "#" + key + "Chart"
					var chart = echarts.init($(chartId).get(0));
					angular.forEach(storage['ChaoWenShiJian'],function(item){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData.unshift(item['value'])
					})
					chart.setOption(baseTools.getEchartSingleOption("", 
							xData, yData, "时间", "m", "超温时间", "bar"));
				},0)
			})
		})
	}
	
	$scope.load();
});

coldWeb.controller('overTemperatureYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'ChaoWenYinZi,MaxTemp'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){
					yData1 = []
					yData2 = []
					xData = []
					var chartId = "#" + key + "Chart"
					var chart = echarts.init($(chartId).get(0));
					angular.forEach(storage['ChaoWenYinZi'],function(item,index){
						yData1.unshift(storage['ChaoWenYinZi'][index]['value'])
						yData2.unshift(storage['MaxTemp'][index]['value'])
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
					})
					Option = {
	                tooltip : {
	                    trigger: 'axis'
	                },
	                toolbox: {
	                    show : false,
	                    feature : {
	                        mark : {show: true},
	                        dataView : {show: true, readOnly: false},
	                        magicType: {show: true, type: ['line', 'bar']},
	                        restore : {show: true},
	                        saveAsImage : {show: true}
	                    }
	                },
	                calculable : true,
	                legend: {
	                    data:['超温因子','最高温度']
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
	                        name : '超温因子',
	                        axisLabel : {
	                            formatter: '{value} %'
	                        }
	                    },
	                    {
	                        type : 'value',
	                        name : '最高温度',
	                        axisLabel : {
	                            formatter: '{value} °C'
	                        }
	                    }
	                ],
	                series : [
	                    {
	                        name:'超温因子',
	                        type:'bar',
	                        data:yData1
	                    },
	                    {
	                        name:'最高温度',
	                        type:'line',
	                        yAxisIndex: 1,
	                        data:yData2
	                    }
	                ]
	            };
					chart.setOption(Option);
				})
			},0)
		})
	}
	
	$scope.load();
});

coldWeb.controller('BWYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'BaoWenYinZi'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData = []
					var chartId = "#" + key + "Chart"
					var chart = echarts.init($(chartId).get(0));
					angular.forEach(storage['BaoWenYinZi'],function(item){
						xData.unshift(item['date'])
						yData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
					})
					chart.setOption(baseTools.getEchartSingleOption("", 
							xData, yData, "", "", "τ", "bar"));
				},0)
			})
		})
	}
	
	$scope.load();
});

coldWeb.controller('WDZQYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'JiangWenYinZi,ShengWenYinZi'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData1 = []
					yData2 = []
					var chartId = "#" + key + "Chart"
					var chart = echarts.init($(chartId).get(0));
					angular.forEach(storage['JiangWenYinZi'],function(item,index){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData1.unshift(storage['JiangWenYinZi'][index]['value'])
						yData2.unshift(storage['ShengWenYinZi'][index]['value'])
					})
					option = {
						tooltip : {
							trigger: 'axis'
						},
						toolbox: {
							show : false,
							feature : {
								mark : {show: true},
								dataView : {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore : {show: true},
								saveAsImage : {show: true}
							}
						},
						calculable : true,
						legend: {
							data:['降温因子','升温因子']
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
				                	  name : '降温因子',
				                	  axisLabel : {
				                		  formatter: '{value}'
				                	  }
				                  },
				                  {
				                	  type : 'value',
				                	  name : '升温因子',
				                	  axisLabel : {
				                		  formatter: '{value}'
				                	  }
				                  }
				                  ],
		                  series : [
		                            {
		                            	name:'降温因子',
		                            	type:'bar',
		                            	data:yData1
		                            },
		                            {
		                            	name:'升温因子',
		                            	type:'bar',
		                            	yAxisIndex: 1,
		                            	data:yData2
		                            }
		                            ]
					};
					chart.setOption(option);
				},0)
			})
		})
	}
	
	$scope.load();
});
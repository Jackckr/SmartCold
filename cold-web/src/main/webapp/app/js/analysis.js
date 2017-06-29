coldWeb.controller('overTemperature', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
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
					var chartId = key + "_Chart"
					var chart = echarts.init(document.getElementById(chartId));
					$scope.showMap[chartId] = storage['ChaoWenShiJian'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId]!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}
					/*添加动画*/
					angular.forEach(storage['ChaoWenShiJian'],function(item){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData.unshift(item['value'] / 60)
					})
					chart.setOption(baseTools.getEchartSingleOption("", 
							xData, yData, "时间", "m", "超温时间", "bar",0,1500));
				},0)
			})
		})
	}
	
	$scope.load();
});


coldWeb.controller('overTemperatureTime', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
   	$scope.load = function(){
   		$scope.rdcId = $stateParams.rdcId,  $scope.showMap=new Array();
		var endTime = new Date(),startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'OverTempL1Time,OverTempL2Time,OverTempL3Time'
            } 
		}).success(function(data,status,config,header){
				$scope.data = data;
				angular.forEach(data,function(storage,key){
					$timeout(function(){		
					xData = [],series = [], chartId = key + "_Chart";
					if(storage.OverTempL1Time&&storage.OverTempL2Time&&storage.OverTempL3Time){
						var L1=[],L2=[],L3=[],totaL1time=0,totaL2time=0,totaL3time=0;
						angular.forEach(storage.OverTempL1Time,function(item){xData.unshift(baseTools.formatTime(item['date']).split(" ")[0]);L1.unshift(item.value);totaL1time+=item.value;});
						angular.forEach(storage.OverTempL2Time,function(item){L2.unshift(item.value );totaL2time+=item.value;});
						angular.forEach(storage.OverTempL3Time,function(item){L3.unshift(item.value);totaL3time+=item.value;});
						series.push({name:'危险超温告警', type:'bar',  data:L1});
						series.push({name:'严重超温告警', type:'bar',  data:L2});
						series.push({name:'正常超温告警', type:'bar',  data:L3});
						$scope.showMap[key]=[totaL1time,totaL2time,totaL3time];
					}
	               var chart = echarts.init(document.getElementById(chartId));
						option = {
								legend: {data:['危险超温告警','严重超温告警','正常超温告警']},
							    tooltip : { trigger: 'axis' },
							    toolbox: {
							        show : true,
							        feature : {  dataView : {show: true, readOnly: false}, magicType : {show: true, type: ['line', 'bar']},restore : {show: true}, saveAsImage : {show: true}}
							    },
							    calculable : true,
							    xAxis  : [{ type : 'category', data : xData}],
							    yAxis  : [{type : 'value' }],
							    series : series
							};
						chart.setOption(option);
					},0);
				});
		});
	};
	$scope.load();
});

coldWeb.controller('overTemperatureCount', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
   	$scope.load = function(){
   		$scope.rdcId = $stateParams.rdcId,  $scope.showMap={};
		var endTime = new Date(), startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'OverTempL1Count,OverTempL2Count,OverTempL3Count'
            } 
		}).success(function(data,status,config,header){
				$scope.data = data;
				angular.forEach(data,function(storage,key){
					$timeout(function(){		
					xData = [],series = [], chartId = key + "_Chart";
					if(storage.OverTempL1Count&&storage.OverTempL2Count&&storage.OverTempL3Count){
						var L1=[],L2=[],L3=[],totaL1time=0,totaL2time=0,totaL3time=0;
						angular.forEach(storage.OverTempL1Count,function(item){
							xData.unshift(baseTools.formatTime(item['date']).split(" ")[0]);
							L1.unshift(item.value);
							totaL1time+=item.value;});
						angular.forEach(storage.OverTempL2Count,function(item){L2.unshift(item.value );totaL2time+=item.value;});
						angular.forEach(storage.OverTempL3Count,function(item){L3.unshift(item.value);totaL3time+=item.value;});
						series.push({name:'危险超温告警次数', type:'bar',  data:L1});
						series.push({name:'严重超温告警次数', type:'bar',  data:L2});
						series.push({name:'正常超温告警次数', type:'bar',  data:L3});
						$scope.showMap[key]=[totaL1time,totaL2time,totaL3time];
					}
	               var chart = echarts.init(document.getElementById(chartId));
						option = {
								legend: {data:['危险超温告警次数','严重超温告警次数','正常超温告警次数']},
							    tooltip : { trigger: 'axis' },
							    toolbox: {
							        show : true,
							        feature : {  dataView : {show: true, readOnly: false}, magicType : {show: true, type: ['line', 'bar']},restore : {show: true}, saveAsImage : {show: true}}
							    },
							    calculable : true,
							    xAxis  : [{ type : 'category', data : xData}],
							    yAxis  : [{type : 'value' }],
							    series : series
							};
						chart.setOption(option);
					},0);
				});
		});
	};
	$scope.load();
});


coldWeb.controller('overTemperatureYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
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
					var chartId = key + "Chart"
					var chart = echarts.init(document.getElementById(chartId));
					$scope.showMap[chartId] = storage['ChaoWenYinZi'].length || storage['MaxTemp'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId]!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}else{
						console.log($scope.showMap[chartId])
					}
					/*添加动画*/
					angular.forEach(storage['ChaoWenYinZi'],function(item,index){
						yData1.unshift(storage['ChaoWenYinZi'][index]['value'])
						yData2.unshift(storage['MaxTemp'][index]['value'])
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
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
	                        max : 100,
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
					chart.setOption(option);
				})
			},0)
		})
	}
	
	$scope.load();
});

coldWeb.controller('BWYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
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
					var chartId = key + "Chart"
					var chart = echarts.init(document.getElementById(chartId));
					$scope.showMap[chartId] = storage['BaoWenYinZi'].length;
					/*添加动画*/
					if($scope.showMap[chartId]!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}
					/*添加动画*/
					angular.forEach(storage['BaoWenYinZi'],function(item){
						yData.unshift(item['value'])
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						console.log(chartId)
					})
					chart.setOption(baseTools.getEchartSingleOption("", 
							xData, yData, "保温因子", "τ", "τ", "bar"));
					
				},0)
			})
		})
	}
	
	$scope.load();
});

coldWeb.controller('WDZQYZ', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
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
					var chartId = key + "Chart"
					var chart = echarts.init(document.getElementById(chartId));
					$scope.showMap[chartId] = storage['JiangWenYinZi'].length || storage['ShengWenYinZi'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId]!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}
					/*添加动画*/
					angular.forEach(storage['JiangWenYinZi'],function(item,index){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData1.unshift(0 - storage['JiangWenYinZi'][index]['value'])
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
				                	  name : '温度因子',
				                	  axisLabel : {
				                		  formatter: '{value}'
				                	  }
				                  }
				                  ],
		                  series : [
		                            {
		                            	name:'升温因子',
		                            	type:'bar',
		                            	itemStyle:{
		                            		normal:{
		                            			color: 'rgb(255,67,80)'
		                            		}
		                            	},
		                            	data:yData2
		                            },
		                            {
		                            	name:'降温因子',
		                            	type:'bar',
		                            	itemStyle:{
		                            		normal:{
		                            			color: 'rgb(135,206,250)'
		                            		}
		                            	},
		                            	data:yData1
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

coldWeb.controller('doorAnalysis', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'DoorTotalTime,DoorOpenTimes'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData1 = []
					yData2 = []
					yData3 = []
					var chartId = key + "Chart"
					var chart1 = echarts.init(document.getElementById(chartId + "1"));
					var chart2 = echarts.init(document.getElementById(chartId + "2"));
					$scope.showMap[chartId + '1'] = storage['DoorTotalTime'].length;
					$scope.showMap[chartId + '2'] = storage['DoorTotalTime'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId + '1']!=0 || $scope.showMap[chartId + '2']!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					};
					/*添加动画*/
					angular.forEach(storage['DoorTotalTime'],function(item,index){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData1.unshift((item['value'] / 60).toFixed(2))
						yData2.unshift(storage['DoorOpenTimes'][index].value)
						yData3.unshift(
								storage['DoorOpenTimes'][index].value == 0
								? 0 : 
									item['value'] / storage['DoorOpenTimes'][index].value / 60
									)
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
		                    data:['开门时长','开门次数']
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
		                        name : '开门时长(min)',
		                        max : 1500,
		                        axisLabel : {
		                            formatter: '{value}'
		                        }
		                    },
		                    {
		                        type : 'value',
		                        name : '开门次数',
		                        axisLabel : {
		                            formatter: '{value}'
		                        }
		                    }
		                ],
		                series : [
		                    {
		                        name:'开门时长',
		                        type:'bar',
		                        data:yData1
		                    },
		                    {
		                        name:'开门次数',
		                        type:'line',
		                        yAxisIndex: 1,
		                        data:yData2
		                    }
		                ]
		            };
					chart1.setOption(option)
					chart2.setOption(baseTools.getEchartSingleOption("", 
							xData, yData3, "平均开门时间", "min", "m", "bar"))
				},0)
			})
		})
	}
	
	$scope.load();
})
coldWeb.controller('goodsYzAnalysis', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys':'GoodsLiuTongYinZi'
            } 
		}).success(function(data,status,config,header){
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData = []
					var chartId = key + "Chart"
					var chart = echarts.init(document.getElementById(chartId));
					$scope.showMap[chartId] = storage['GoodsLiuTongYinZi'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId]!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					};
					/*添加动画*/
					angular.forEach(storage['GoodsLiuTongYinZi'],function(item){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData.unshift(item['value'])
					})
					chart.setOption(baseTools.getEchartSingleOption("", 
							xData, yData, "时间", "", "货物流通因子", "bar",0));
				},0)
			})
		})
	}
	
	$scope.load()
})

coldWeb.controller('runningAnalysis', function($rootScope, $scope,$timeout, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$scope.showMap = {}
		var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
		$http.get('/i/compressor/findAnalysisByRdcidKeysDate',{
            params: {
            	"startTime": baseTools.formatTime(startTime),
            	"endTime": baseTools.formatTime(endTime),
                "rdcId": $scope.rdcId,
                'keys':'RunningTime,RunningCount'
            } 
		}).success(function(data,status,config,header){
			$scope.compressorKeys = []
			angular.forEach(data,function(item,key){
				$scope.compressorKeys.push({name:key})
			})
			$scope.data = data;
			angular.forEach(data,function(storage,key){
				$timeout(function(){					
					xData = []
					yData1 = []
					yData2 = []
					yData3 = []
					var chartId = key + "Chart"
					var chart1 = echarts.init(document.getElementById(chartId + "1"));
					var chart2 = echarts.init(document.getElementById(chartId + "2"));
					$scope.showMap[chartId + '1'] = storage['RunningTime'].length;
					$scope.showMap[chartId + '2'] = storage['RunningTime'].length;
					/*添加动画2016-12-29*/
					if($scope.showMap[chartId + '1']!=0 || $scope.showMap[chartId + '2']!=0){
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}else{
						$('.animated:odd').addClass('bounceInLeft');
						$('.animated:even').addClass('bounceInRight');
					}
					/*添加动画*/
					angular.forEach(storage['RunningTime'],function(item,index){
						xData.unshift(baseTools.formatTime(item['date']).split(" ")[0])
						yData1.unshift((item['value'] / 60).toFixed(2))
						yData2.unshift(storage['RunningCount'][index].value)
						yData3.unshift(
								storage['RunningCount'][index].value == 0
								? 0 : 
									item['value'] / storage['RunningCount'][index].value / 60
									)
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
		                    data:['运行时长','运行次数']
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
		                        name : '运行时长',
		                        max : 1500,
		                        axisLabel : {
		                            formatter: '{value} m'
		                        }
		                    },
		                    {
		                        type : 'value',
		                        name : '运行次数',
		                        axisLabel : {
		                            formatter: '{value}'
		                        }
		                    }
		                ],
		                series : [
		                    {
		                        name:'运行时长',
		                        type:'bar',
		                        data:yData1
		                    },
		                    {
		                        name:'运行次数',
		                        type:'line',
		                        yAxisIndex: 1,
		                        data:yData2
		                    }
		                ]
		            };
					chart1.setOption(option)
					chart2.setOption(baseTools.getEchartSingleOption("", 
							xData, yData3, "平均运行时间", "m", "m", "bar"))
				},0)
			})
		})
	}
	
	$scope.load();	
})
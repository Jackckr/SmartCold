/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorPressure', function ($scope, $location, $stateParams, $http,$rootScope,$timeout) {
    $scope.groupId = $stateParams.compressorID;
    $scope.load = function () {
        var data = [];
		$http.get("/i/compressorGroup/findPressByNums", {
		    params: {
		        "compressorID": $stateParams.compressorID
		    }
		}).success(function (result) {
			$scope.pressMonitor(result);
		})
		$http.get("/i/compressorGroup/findCompressorState?compressorGroupId=" + $scope.groupId).success(
        		function(data,status,config,header){
        			$scope.compressors = data;
        			$scope.exTemp(data);
        		})
        $http.get("/i/evaporative/findInfoByGroupId?groupId=" + $scope.groupId).success(
        		function(data,status,config,header){
        			$scope.evaporative = data;
        		})
		
		$http.get('/i/baseInfo/getKeyValueData', {
            params: {
                "oid": $stateParams.compressorID,
                type:3,
                key:'liquidLevel',
                nums:1
            }
        }).success(function(data){
        	var liquidValue = data.length > 0?parseFloat(data[0].value.toFixed(1)):0;
        	$scope.liquidMonitor(liquidValue);
        })
    }
    
    $scope.exTemp = function(compressors){
    	var exTempChart = echarts.init($("#exTempChart").get(0));
    	var yData = {high:[],low:[],temp:[]}
    	var xData = []
    	
    	angular.forEach(compressors,function(compressor){
    		xData.push(compressor.name);
    		temp = [{key:'high',value:compressor.highTemp},
    		        {key:'low',value:compressor.lowTemp},
    		        {key:'temp',value:compressor.keyValues.exTemp}]
    		temp.sort(function(a,b){return b.value - a.value})
    		yData[temp[0].key].push(temp[0].value - temp[1].value)
    		yData[temp[1].key].push(temp[1].value - temp[2].value)
    		yData[temp[2].key].push(temp[2].value)
    	})
    	
    	option = {
    	    legend: {
    	        data: ['高温警戒线', '低温警戒线', '当前温度'],
    	        align: 'left',
    	        left: 10
    	    },
    	    title: {
                text: '排气温度监控',
                x: 'right',
                y: 'top',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 25,
                    fontWeight: 'bolder'
                }
            },
    	    tooltip: {},
    	    xAxis: {
    	        data: xData,
    	        name: '压缩机名',
    	        silent: false
    	    },
    	    yAxis: {
    	    	name:"温度(℃)",
    	        inverse: true,
    	        splitArea: {show: false}
    	    },
    	    series: [
	            {
	            	 name: '低温警戒线',
	            	 type: 'bar',
	            	 stack: 'one',
	            	 data: yData.low
	            },
    	        {
    	            name: '当前温度',
    	            type: 'bar',
    	            stack: 'one',
    	            data: yData.temp
    	        },
    	        {
    	            name: '高温警戒线',
    	            type: 'bar',
    	            stack: 'one',
    	            data: yData.high
    	        }
    	    ]
    	};
    	
    	exTempChart.setOption(option)
    }
    
    $scope.pressMonitor = function(data){
    	var lowPress = data.lowPress.length>0?data.lowPress[0].value:0;
    	var highPress = data.highPress.length>0?data.highPress[0].value:100;
        // 环形图表示压力监控
        var pressureChart = echarts.init($("#pressureChart").get(0));

        var dataStyle = {
            normal: {
                label: {show: false},
                labelLine: {show: false}
            }
        };
        var placeHolderStyle = {
            normal: {
                color: 'rgba(0,0,0,0)',
                label: {show: false},
                labelLine: {show: false}
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        var pressureOption = {
            title: {
                text: '压力监控',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 25,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                //formatter: "{a} <br/>{b} : {c} ({d}%)"
                formatter: "{b} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 30,
                y: 200,
                itemGap: 12,
                data: ['高压' + parseFloat(highPress).toFixed(0)+'kpa', '低压' + parseFloat(lowPress).toFixed(0)+'kpa']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            series: [
                {
                    name: '高压压力',
                    type: 'pie',
                    clockWise: false,
                    radius: [70, 90],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(highPress / 20),
                            name: '高压' + parseFloat(highPress).toFixed(0)+'kpa'
                        },
                        {
                            value: 100 - parseInt(highPress / 20),
                            name: '高压可用:' + (2000 - parseInt(highPress))+'kpa',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '低压压力',
                    type: 'pie',
                    clockWise: false,
                    radius: [50, 70],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(lowPress / 20),
                            name: '低压' + parseFloat(lowPress).toFixed(0)+'kpa'
                        },
                        {
                            value: 100 - parseInt(lowPress / 20),
                            name: '高压可用:' + (2000 - parseInt(lowPress).toFixed(0)+'kpa'),
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };
        pressureChart.setOption(pressureOption);
    }
    
    $scope.getArrValue = function(arr){
    	if(!arr || arr.length<1)
    		return -1;
    	return arr[0].value;
    }
    
    $scope.liquidMonitor = function(liquid){
        // 液位计
        $(function () {
            $('#floatPressureChart').highcharts({
                chart: {
                    type: 'column',
                    margin: [50, 50, 50, 80],
                    backgroundColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                        stops: [
                            [0, 'rgb(210, 214, 222)'],
                            [1, 'rgb(210, 214, 222)']
                        ]
                    },
                    borderColor: '#d2d6de',
                    borderWidth: 2,
                    className: 'dark-container',
                    plotBackgroundColor: 'rgba(210, 214, 222, .1)',
                    plotBorderColor: '#d2d6de',
                    plotBorderWidth: 1
                },
                title: {
                    text: '液位',
                    itemGap: 20,
                    y: 15,
                    style: {
                        color: 'rgba(30,144,255,0.8)',
                        fontFamily: '微软雅黑',
                        fontSize: 25,
                        fontWeight: 'bolder'
                    }
                },
                xAxis: {
                    categories: [
                        '液位'
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Level (mm)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Level is: <b>{point.y:.1f} mm</b>',
                },
                credits: {
                    enabled: false // 禁用版权信息
                },
                series: [{
                    name: 'Level',
                    data: [liquid],
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        x: 4,
                        y: 10,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            textShadow: '0 0 3px black'
                        }
                    }
                }]
            });
        });
    }
    
    $timeout(function(){
    	$scope.load();
    },0)
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
});

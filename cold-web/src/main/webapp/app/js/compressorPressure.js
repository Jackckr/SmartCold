/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorPressure', function ($scope, $location, $stateParams, $http,$rootScope) {
    console.log($stateParams.compressorID);
    $scope.load = function () {
        var data = [];
        $http.get('/i/baseInfo/getKeyValueData', {
            params: {
                "oid": $stateParams.compressorID,
                type:3,
                key:'Current'
            }
        }).success(function (result) {
            for (var i = 0; i < result.length; i++) {
                var val = Date.parse(result[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: result[i].value
                });
//                if(i == 0){
//                    result[0].liquidLevel = parseFloat(result[0].liquidLevel).toFixed(1);
//                }
            }
            $scope.drawPower(data);
        })
		$http.get("/i/compressorGroup/findPressByNums", {
		    params: {
		        "compressorID": $stateParams.compressorID
		    }
		}).success(function (result) {
			$scope.pressMonitor(result);
		})
		
		$http.get("/i/compressor/findLoad",{
        	params: {
		        "groupId": $stateParams.compressorID
		    }
		}).success(function (result) {
			$scope.runMonitor(result);
		})
		
		$http.get('/i/baseInfo/getKeyValueData', {
            params: {
                "oid": $stateParams.compressorID,
                type:3,
                key:'liquidLevel',
                nums:1
            }
        }).success(function(data){
        	var liquidValue = parseFloat(data[0].value.toFixed(1));
        	$scope.liquidMonitor(liquidValue);
        })
    }
    $scope.load();
    
    /*  电量实时图 —— 折线图  */
    $scope.drawPower = function(data){
    	Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        var chart;
        $('#powerChart').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
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
                text: '电量实时监控'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
            },
            yAxis: {
                title: {
                    text: 'Power(kw)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
                    /*               , {
                     color:'red',           //线的颜色，定义为红色
                     dashStyle:'solid',     //默认值，这里定义为实线
                     value:18,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                     width:2,
                     label:{
                     text:'', //标签的内容
                     align:'right',                //标签的水平位置，水平居左,默认是水平居中center
                     x:10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                     }//标示线的宽度，2px
                     }*/
                ]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false // 禁用版权信息
            },
            series: [{
                name: 'Power',
                markPoint: {
                    data: [
                        {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                data: (function () {
                    return data;
                })()
            }]
        });
    }
    
    $scope.pressMonitor = function(data){
    	var lowPress = data.lowPress[0].value;
    	var highPress = data.highPress[0].value;
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
                data: ['高压' + parseFloat(highPress).toFixed(0), '低压' + parseFloat(lowPress).toFixed(0)]
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
                            name: '高压' + parseFloat(highPress).toFixed(0)
                        },
                        {
                            value: 100 - parseInt(highPress / 20),
                            name: '高压可用:' + (2000 - parseInt(highPress)),
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
                            name: '低压' + parseFloat(lowPress).toFixed(0)
                        },
                        {
                            value: 100 - parseInt(lowPress / 20),
                            name: '高压可用:' + (2000 - parseInt(lowPress).toFixed(0)),
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
    $scope.runMonitor = function(data){
    	var compressor1 = $scope.getArrValue(data.compressor1);
    	var compressor2 = $scope.getArrValue(data.compressor2);
    	var compressor3 = $scope.getArrValue(data.compressor3);
    	var compressor4 = $scope.getArrValue(data.compressor4);
    	var compressor5 = $scope.getArrValue(data.compressor5);
    	var compressor6 = $scope.getArrValue(data.compressor6);
    	// 环形图表示运行监控
        var runChart = echarts.init($("#runChart").get(0));

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
        var runOption = {
            title: {
                text: '运行监控',
                //subtext: 'From SmartCold',
                //sublink: 'http://www.baidu.com/',
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
                x: 0,
                y: 200,
                itemGap: 12,
                data: ['1号' + (parseInt(compressor1) === -1 ? 0 : parseInt(compressor1)), '2号' + (parseInt(compressor2) === -1 ? 0 : parseInt(compressor2)), '3号' + (parseInt(compressor3) === -1 ? 0 : parseInt(compressor3))]
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
                    name: '1',
                    type: 'pie',
                    clockWise: false,
                    radius: [51, 64],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor1) === -1 ? 0 : parseInt(compressor1) * 5,
                            name: '1号' + (parseInt(compressor1) === -1 ? 0 : parseInt(compressor1))
                        },
                        {
                            value: parseInt(compressor1) === -1 ? 100 : 100 - parseInt(compressor1) * 5,
                            name: '1号可用' + (parseInt(compressor1) === -1 ? 20 : 20 - parseInt(compressor1)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '2',
                    type: 'pie',
                    clockWise: false,
                    radius: [64, 77],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor2) === -1 ? 0 : parseInt(compressor2)* 5,
                            name: '2号' + (parseInt(compressor2) === -1 ? 0 : parseInt(compressor2))
                        },
                        {
                            value: parseInt(compressor2) === -1 ? 100 : 100 - parseInt(compressor2)* 5,
                            name: '2号可用' + (parseInt(compressor2) === -1 ? 20 : 20 - parseInt(compressor2)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '3',
                    type: 'pie',
                    clockWise: false,
                    radius: [77, 90],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor3) === -1 ? 0 : parseInt(compressor3)* 5,
                            name: '3号' + (parseInt(compressor3) === -1 ? 0 : parseInt(compressor3))
                        },
                        {
                            value: parseInt(compressor3) === -1 ? 100 : 100 - parseInt(compressor3)* 5,
                            name: '3号可用' + (parseInt(compressor3) === -1 ? 20 : 20 - parseInt(compressor3)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };
        runChart.setOption(runOption);

        // 环形图表示运行监控2
        var runChart2 = echarts.init($("#runChart2").get(0));

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
        var runOption2 = {
            title: {
                text: '运行监控',
                //subtext: 'From SmartCold',
                //sublink: 'http://www.baidu.com/',
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
                x: 0,
                y: 200,
                itemGap: 12,
                data: ['4号' + (parseInt(compressor4) === -1 ? 0 : parseInt(compressor4)), '5号' + (parseInt(compressor5) === -1 ? 0 : parseInt(compressor5)), '6号' + (parseInt(compressor6) === -1 ? 0 : parseInt(compressor6))]
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
                    name: '1',
                    type: 'pie',
                    clockWise: false,
                    radius: [51, 64],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor4) === -1 ? 0 : parseInt(compressor4)* 5,
                            name: '4号' + (parseInt(compressor4) === -1 ? 0 : parseInt(compressor4))
                        },
                        {
                            value: parseInt(compressor4) === -1 ? 100 : 100 - parseInt(compressor4)* 5,
                            name: '4号可用' + (parseInt(compressor4) === -1 ? 20 : 20 - parseInt(compressor4)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '2',
                    type: 'pie',
                    clockWise: false,
                    radius: [64, 77],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor5) === -1 ? 0 : parseInt(compressor5)* 5,
                            name: '5号' + (parseInt(compressor5) === -1 ? 0 : parseInt(compressor5))
                        },
                        {
                            value: parseInt(compressor5) === -1 ? 100 : 100 - parseInt(compressor5)* 5,
                            name: '5号可用' + (parseInt(compressor5) === -1 ? 20 : 20 - parseInt(compressor5)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '3',
                    type: 'pie',
                    clockWise: false,
                    radius: [77, 90],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: parseInt(compressor6) === -1 ? 0 : parseInt(compressor6)* 5,
                            name: '6号' + (parseInt(compressor6) === -1 ? 0 : parseInt(compressor6))
                        },
                        {
                            value: parseInt(compressor6) === -1 ? 100 : 100 - parseInt(compressor6)* 5,
                            name: '6号可用' + (parseInt(compressor6) === -1 ? 20 : 20 - parseInt(compressor6)),
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };
        runChart2.setOption(runOption2);

        
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
                        text: 'Level (mL)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Level is: <b>{point.y:.1f} mL</b>',
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
    
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);

});

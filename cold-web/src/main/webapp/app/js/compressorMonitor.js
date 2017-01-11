/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorMonitor', function ($scope, $location, $stateParams) {
    console.log($stateParams.storageID);
    $scope.load = function () {

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
                //subtext: 'From SmartCold',
                //sublink: 'http://www.baidu.com/',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: $("#pressureChart").get(0).offsetWidth / 2 + 20,
                y: 8,
                itemGap: 12,
                data: ['高压压力', '低压压力', '出水压力']
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
                    radius: [125, 150],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 68,
                            name: '高压压力'
                        },
                        {
                            value: 32,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '2',
                    type: 'pie',
                    clockWise: false,
                    radius: [100, 125],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 29,
                            name: '低压压力'
                        },
                        {
                            value: 71,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '3',
                    type: 'pie',
                    clockWise: false,
                    radius: [75, 100],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 12,
                            name: '出水压力'
                        },
                        {
                            value: 88,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };
        pressureChart.setOption(pressureOption);


        // 环形图表示温度监控
        var compressorTemperChart = echarts.init($("#compressorTemperChart").get(0));

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
        var compressorTemperOption = {
            title: {
                text: '温度监控',
                //subtext: 'From SmartCold',
                //sublink: 'http://www.baidu.com/',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 30,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: $("#compressorTemperChart").get(0).offsetWidth / 2 + 20,
                y: 8,
                itemGap: 12,
                data: ['排气温度', '油冷出口温度', '油份内部温度', '吸气温度', '出水温度']
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
                    radius: [125, 150],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 68,
                            name: '排气温度'
                        },
                        {
                            value: 32,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '2',
                    type: 'pie',
                    clockWise: false,
                    radius: [100, 125],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 29,
                            name: '油冷出口温度'
                        },
                        {
                            value: 71,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '3',
                    type: 'pie',
                    clockWise: false,
                    radius: [75, 100],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 12,
                            name: '油份内部温度'
                        },
                        {
                            value: 88,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '4',
                    type: 'pie',
                    clockWise: false,
                    radius: [50, 75],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 10,
                            name: '吸气温度'
                        },
                        {
                            value: 90,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: '5',
                    type: 'pie',
                    clockWise: false,
                    radius: [25, 50],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: 5,
                            name: '出水温度'
                        },
                        {
                            value: 95,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };
        compressorTemperChart.setOption(compressorTemperOption);


    }
    $scope.load();
});

/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageTemper', function ($scope, $location, $stateParams, $http,$rootScope) {
    console.log($stateParams.storageID);
    $scope.load = function () {
        var data = [];
        $http.get('/i/coldStorage/getTempByNums', {
            params: {
                "oid": $stateParams.storageID,
                'key':'temperature'
            }
        }).success(function (result) {
        	var list = result.list
            for (var i = 0; i < list.length; i++) {
                var val = Date.parse(list[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: list[i].value
                });
            }

            // 温度实时图——仪表盘
/*            var temper = parseFloat(result[0].temperature);
            var myChart = echarts.init(document.getElementById('temperatureNowChart'));
            var option = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {show: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '冷库实时温度',
                        type: 'gauge',
                        min: -30,
                        max: 30,
                        detail: {formatter: '{value}℃'},
                        textStyle: {
                            color: 'auto',
                            fontSize: 30
                        },
                        data: [{value: temper, name: '冷库温度'}]
                    }
                ]
            };
            myChart.setOption(option);*/


            //温度实时图——环形图
            var temper = parseFloat(list[0].value).toFixed(1);
            $scope.curtemper = temper;
/*            var pressureChart = echarts.init($("#temperatureNowChart").get(0));

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
                    text: '实时温度' + temper,
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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
    /!*            legend: {
                    orient: 'horizontal',
                    x: 30,
                    y: 200,
                    itemGap: 12,
                    data: ['实时温度']
                },*!/
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
                        name: '实时温度',
                        type: 'pie',
                        clockWise: false,
                        radius: [70, 90],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(temper),
                                name: '实时温度'
                            },
                            {
                                value: 100 - parseInt(temper),
                                name: '温度可用',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            };
            pressureChart.setOption(pressureOption);*/

            // 折线图
            var startTemperature = parseFloat(result.startTemperature);
            $(function () {
                $(document).ready(function () {
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    $('#temperatureChart').highcharts({
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
                            text: '冷库温度实时监控'
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 150,
                        },
                        yAxis: {
                            title: {
                                text: 'Temperature(℃)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }, {
                                color: 'red',           //线的颜色，定义为红色
                                dashStyle: 'solid',     //默认值，这里定义为实线
                                value: startTemperature,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                width: 2,
                                label: {
                                    text: '启动温度(' + startTemperature + '℃)', //标签的内容
                                    align: 'right',                //标签的水平位置，水平居左,默认是水平居中center
                                    x: 0                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                }//标示线的宽度，2px
                            }]
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
                            name: 'Temperature',
                            markPoint: {
                                data: [
                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                ]
                            },
                            data: (function () {
                                /* // generate an array of random data
                                 var data = [],
                                 time = (new Date()).getTime(),
                                 i;

                                 for (i = -19; i <= 0; i++) {
                                 data.push({
                                 x: time + i * 5000,
                                 y: Math.random() * (40) - 20
                                 });
                                 }*/
                                return data;
                            })()
                        }]
                    });
                });

            });
        });
    }

    $scope.load();

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);

});

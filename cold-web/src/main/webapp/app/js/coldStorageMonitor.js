/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageMonitor', function ($scope, $location, $stateParams, $http) {
    console.log($stateParams.storageID);
    $http.get('/i/coldStorage/findColdStorageById',{
        params: {
            "storageID":$stateParams.storageID,
            "npoint":2
        }
    }).success(function(data){
        console.log("data:"+data);
        for (var i=0;i<data.length;i++){
        console.log("data:"+data[i].temperature);
        }

    });

    $scope.load = function () {


        // 温度实时图——仪表盘
        var temper;
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
                    data: [{value: -20, name: '冷库温度'}]
                }
            ]
        };

        clearInterval(timeTicket);
        var timeTicket = setInterval(function () {
            option.series[0].data[0].value = temper;
            myChart.setOption(option, true);
        }, 2000);

        myChart.setOption(option);


        /*  温度实时图 —— 折线图  */
        $(function () {
            $(document).ready(function () {
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                var chart;
                $('#temperatureChart').highcharts({
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {

                                // set up the updating of the chart each second
                                var series = this.series[0];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = (Math.random() * (-30)).toFixed(2) - 0;
                                    temper = y;
                                    series.addPoint([x, y], true, true);
                                }, 1000);
                                var series1 = this.series[1];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = -4;
                                    series1.addPoint([x, y], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: '冷库温度实时监控'
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Temperature(℃)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
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
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 1000,
                                    y: Math.random() * (-20)
                                });
                            }
                            return data;
                        })()
                    },{
                        name:'Stable Temperature',
                        color: '#FF0000',
                        data: (function() {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 1000,
                                    y: -4
                                });
                            }
                            return data;
                        })()
                    }]
                });
            });

        });

        /*  能耗实时图----暂时放这，此页面不需要  */
        $(function () {
            $(document).ready(function () {
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                var chart;
                $('#energyChart').highcharts({
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {
                                // set up the updating of the chart each second
                                var series = this.series[0];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.random() * (-30);
                                    series.addPoint([x, y], true, true);
                                }, 3000);

                                var series1 = this.series[1];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.random() * (-30);
                                    series1.addPoint([x, y], true, true);
                                }, 3000);

                                var series2 = this.series[2];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.random() * (-30);
                                    series2.addPoint([x, y], true, true);
                                }, 3000);

                                var series3 = this.series[3];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.random() * (-30);
                                    series3.addPoint([x, y], true, true);
                                }, 3000);
                            }
                        }
                    },
                    title: {
                        text: '冷库能耗实时监控'
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Temperature(℃)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
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
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 0
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false // 禁用版权信息
                    },
                    series: [{
                        name: '风机',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 3000,
                                    y: Math.random() * (-30)
                                });
                            }
                            return data;
                        })()
                    }, {
                        name: '空调',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 3000,
                                    y: Math.random() * (-30)
                                });
                            }
                            return data;
                        })()
                    }, {
                        name: '齿轮',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 3000,
                                    y: Math.random() * (-30)
                                });
                            }
                            return data;
                        })()
                    }, {
                        name: '分项',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 3000,
                                    y: Math.random() * (-30)
                                });
                            }
                            return data;
                        })()
                    }]
                });
            });

        });

        // 冷库的进货量、发货量、温度
        var barChart = echarts.init($("#barChart").get(0));
        barOption = {
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
                data:['进货量','发货量','平均温度']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '货物量',
                    axisLabel : {
                        formatter: '{value} ml'
                    }
                },
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
                    name:'进货量',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name:'发货量',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name:'平均温度',
                    type:'line',
                    yAxisIndex: 1,
                    data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        barChart.setOption(barOption);


        // 冷库门开关监控
        $(function () {
            $(document).ready(function () {
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                $('#storageDoorChart').highcharts({
                    chart: {
                        type: 'column',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {

                                // set up the updating of the chart each second
                                var series = this.series[0];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = Math.round(Math.random());
                                    temper = y;
                                    series.addPoint([x, y], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: '冷库门开关监控'
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 0
                    },
                    yAxis: {
                        title: {
                            text: 'DoorState(0关1开)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function () {
                            var state = undefined;
                           if (this.y === 1){
                               state = '冷库处于开门状态';
                            } else {
                               state = '冷库处于关门状态';
                            }

                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                state;
                                //Highcharts.numberFormat(this.y, 2);
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
                        name: 'DoorState',
                        pointPadding: 0, //数据点之间的距离值
                        groupPadding: 0, //分组之间的距离值
                        borderWidth: 0,
                        shadow: false,
                        pointWidth:50, //柱子之间的距离值
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 1000,
                                    y: Math.round(Math.random())
                                });
                            }
                            return data;
                        })()
                    }]
                });
            });

        });

    }
    $scope.load();
});

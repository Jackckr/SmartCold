/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageTemper', function ($scope, $location, $stateParams, $http) {
    console.log($stateParams.storageID);

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
                    data: [{value: 18, name: '冷库温度'}]
                }
            ]
        };

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

/*                                // set up the updating of the chart each second
                                var series = this.series[0];

                                setInterval(function () {
                                    $http.get('/i/coldStorage/findColdStorageById', {
                                        params: {
                                            "storageID": $stateParams.storageID,
                                            "npoint": 2
                                        }
                                    }).success(function (data) {
                                        console.log("data:" + data);
                                        for (var i = 0; i < data.length; i++) {
                                            console.log("data:" + data[i].temperature);
                                        }
                                        //TODO 修改为时间和温度根据后台传过来的数据,可能在时间窗内有多个点
                                        var temper2 = data[data.length - 1].temperature;
                                        var x = (new Date()).getTime(), // current time
                                            y = (Math.random() * (40) - temper2).toFixed(2) - 0;
                                        temper = y;
                                        series.addPoint([x, y], true, true);
                                    });
                                }, 1000);*/
                                // set up the updating of the chart each second
                                var series = this.series[0];

                                setInterval(function () {
                                        var x = (new Date()).getTime(), // current time
                                            y = (Math.random() * (40) - 20).toFixed(2) - 0;
                                        temper = y;
                                        series.addPoint([x, y], true, true);
                                }, 5000);
                            }
                        }
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
                            color:'red',           //线的颜色，定义为红色
                            dashStyle:'solid',     //默认值，这里定义为实线
                            value:18,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                            width:2,
                            label:{
                                text:'启动温度', //标签的内容
                                align:'right',                //标签的水平位置，水平居左,默认是水平居中center
                                x:10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
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
                        markPoint : {
                            data : [
                                {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i++) {
                                data.push({
                                    x: time + i * 5000,
                                    y: Math.random() * (40) - 20
                                });
                            }
                            return data;
                        })()
                    }]
                });
            });

        });

        // 控制仪表盘的图
        clearInterval(timeTicket);
        var timeTicket = setInterval(function () {
            option.series[0].data[0].value = temper;
            myChart.setOption(option, true);
        }, 5000);

    }
    $scope.load();
});

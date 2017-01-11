/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('rdcPower', function ($scope, $location, $stateParams, $http,$rootScope) {
    console.log($stateParams.rdcId);
    $scope.load = function () {
        var data = [];
        $http.get('/i/rdcPower/findByRdcId', {
            params: {
                "rdcID": $stateParams.rdcId,
                "npoint": 480
            }
        }).success(function (result) {
            console.log("result:" + result);
            for (var i = 0; i < result.length; i++) {
                console.log("result:" + result[i].addTime + ",powerCosume: " + parseFloat(result[i].powerCosume));
                var val = Date.parse(result[i].addTime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: parseFloat(result[i].powerCosume)
                });
            }
            console.log("data.length:"+data.length)

            /*  电量实时图 —— 折线图  */
            $(function () {
                $(document).ready(function () {
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    $('#rdcPowerChart').highcharts({
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
                });

            });

        })

    }
    $scope.load();

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);
});

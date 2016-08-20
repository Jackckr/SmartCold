var app = angular.module('app', []);
app.controller('cold360', function ($scope, $location, $http,$rootScope) {
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
    var storageID = 2;

    var formatTime = function(timeString){
        if (typeof(timeString) == "string"){
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
        }else{
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
        }
    }

    $scope.load = function () {
        var data = [];
        var startData = [];
        var datumTempData = [];
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
        $http.get(ER.coldroot+'/i/coldStorage/getTempByTime', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "oid": storageID,
                'key':'Temp'
            }
        }).success(function (result) {
            var list = result.list
            var startTemperature = parseFloat(result.startTemperature);
            var tempDiff = parseFloat(result.tempdiff);
            var datumTemp = startTemperature + 0.5 * tempDiff;
            for (var i = 0; i < list.length; i++) {
                var val = Date.parse(list[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: list[i].value
                });
            }
            if(data.length > 0){
                startData.push({
                    x: data[0].x,
                    y: startTemperature
                });
                datumTempData.push({
                    x: data[0].x,
                    y: datumTemp
                });
            }else{
                data.push({x:startTime.getTime(),y:null})
                data.push({x:endTime.getTime(),y:null})
                startData.push({x:endTime.getTime(),y:startTemperature})
                datumTempData.push({x:endTime.getTime(),y:datumTemp})
            }

            //温度实时图——环形图
            var temper = list[0]?parseFloat(list[0].value).toFixed(1):null;
            $scope.curtemper = temper;

            // 折线图
            $(function () {
                $(document).ready(function () {
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    $('#main').highcharts({
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
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 150,
                        },
                        yAxis: {
                            title: {
                                text: '温度(℃)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            },{
                                color: 'red',           //线的颜色，定义为红色
                                dashStyle: 'solid',     //默认值，这里定义为实线
                                value: startTemperature,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                width: 2,
                                label: {
                                    text: '设定温度(' + startTemperature + '℃)', //标签的内容
                                    align: 'right',                //标签的水平位置，水平居左,默认是水平居中center
                                    x: 0                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                }//标示线的宽度，2px
                            },
                                {
                                    color: 'red',           //线的颜色，定义为红色
                                    dashStyle: 'solid',     //默认值，这里定义为实线
                                    value: datumTemp,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                    width: 2,
                                    label: {
                                        text: '基准温度(' + datumTemp + '℃)', //标签的内容
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
                            name: '温度',
                            markPoint: {
                                data: [
                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                ]
                            },
                            data: (function () {
                                return data;
                            })()
                        },
                            {
                                name: '设定温度',
                                color: 'red',
                                dashStyle: 'solid',
                                marker: {
                                    symbol: 'circle'
                                },
                                data: (function () {
                                    return startData;
                                })()
                            },
                            {
                                name: '基准温度',
                                color: 'red',
                                dashStyle: 'solid',
                                marker: {
                                    symbol: 'circle'
                                },
                                data: (function () {
                                    return datumTempData;
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

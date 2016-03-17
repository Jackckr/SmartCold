/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageDoor', function ($scope, $location, $stateParams, $http) {
    console.log($stateParams.storageID);
    $http.get('/i/coldStorage/findColdStorageById',{
        params: {
            "storageID":$stateParams.storageID,
            "npoint":2
        }
    }).success(function(data){
        console.log("data:"+data);
        for (var i=0;i<data.length;i++){
            console.log("data:"+data[i].Temperature);
        }

    });

    $scope.load = function () {

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

/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageDoor', function ($scope, $location, $stateParams, $http,$rootScope) {
    console.log($stateParams.storageID);

    $scope.load = function () {
        $http.get('/i/coldStorageDoor/findByStorageId?storageID=' + $stateParams.storageID).success(
        		function(data,status,config,header){
        			if(data.length > 0){
        				$scope.drawDoor(data[0].id);
        			}
        		});
    };
    
    $scope.drawDoor = function(doorid){
    	$http.get('/i/baseInfo/getKeyValueData', {
            params: {
                "oid": doorid,
                type:2,
                key:'Switch'
            }
        }).success(function (result) {
        	var data = [];
            for (var i = 0; i < result.length; i++) {
                var val = Date.parse(result[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: result[i].value
                });
            }

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
/*                            events: {
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
                            },*/
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
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
                            text: '冷库门开关监控'
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval:  200,
                        },
                        yAxis: {
                            allowDecimals: false,
                            labels: {
                                formatter:function(){
                                    if(this.value===0) {
                                        return "关";
                                    }else if(this.value===1) {
                                        return "开";
                                    }
                                }
                            },
                            title: {
                                text: 'DoorState(0关1开)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }],
                            max:1,
                            min:0,
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
                            pointWidth:5, //柱子之间的距离值
                            data: (function () {
                               /* // generate an array of random data
                                var data = [],
                                    time = (new Date()).getTime(),
                                    i;

                                for (i = -19; i <= 0; i++) {
                                    data.push({
                                        x: time + i * 1000,
                                        y: Math.round(Math.random())
                                    });
                                }*/
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
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
});

checkLogin();
var app = angular.module('app', []);
app.controller('facility', function ($scope, $location, $http, $rootScope) {
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    //if (window.user.roleid == 3); 超管特殊处理
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            $scope.viewStorage($scope.storages[0].id);
        }
    });

    $scope.viewStorage = function (rdcId) {
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.load($scope.mystorages[i]);
                }
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;
    $scope.load = function (storage) {
        var storageID = storage.id;
        $scope.mystorageName = storage.name;

        $http.get(ER.coldroot + '/i/coldStorageDoor/findByStorageId?storageID=' + storageID).success(function (data) {
            if (data.length > 0) {
                $scope.drawDoor(storage, data[0].id)
            } else {
                var mainId = 'defalt' + $scope.defaltswiper;
                if ($scope.swiper < $scope.mystorages.length){
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">'+storage.name+'</p>' +
                        '<div id='+mainId+'></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.defaltswiper +=1;
                    $scope.swiper +=1;
                }
            }
        })
    }

    $scope.drawDoor = function(storage, doorId){

        $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
            params: {
                "oid": doorId,
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

                    var mainId = 'main' + doorId;
                    if ($scope.swiper < $scope.mystorages.length){
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">'+storage.name+'</p>' +
                            '<div id='+mainId+'></div> ';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper +=1;
                    }

                    $('#' + mainId).highcharts({
                        chart: {
                            type: 'column',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 10,
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
                            pointWidth:48, //柱子之间的距离值
                            data: (function () {
                                return data;
                            })()
                        }]
                    });
                });

            });

        });
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        for (var i = 0; i < $scope.mystorages.length; i++) {
            $scope.load($scope.mystorages[i]);
        }
    }, 30000);

});

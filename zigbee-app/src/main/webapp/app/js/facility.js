checkLogin();
var app = angular.module('app', []);
app.controller('facility', function ($scope, $location, $http, $rootScope, $sce) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    //if (window.user.roleid == 3); 超管特殊处理
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            $scope.rdcId = $scope.storages[0].id;
            $scope.viewStorage($scope.rdcId);
        }
    });

    $scope.viewStorage = function (rdcId) {
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.drawDoor($scope.mystorages[i]);
                }
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawDoor = function (storage) {

        $http.get(ER.coldroot + '/i/coldStorageDoor/findByStorageId?storageID=' + storage.id).success(function (data) {
            if (data.length > 0) {
                var doorId = data[0].id;
                $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
                    params: {
                        "oid": doorId,
                        type: 2,
                        key: 'Switch'
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

                            var mainId = 'door' + doorId;
                            if ($scope.swiper < $scope.mystorages.length) {
                                var innerHTML = '<div class="swiper-slide">' +
                                    '<p class="actually">' + storage.name + '</p>' +
                                    '<div id=' + mainId + '></div> ';
                                $("#chartView").last().append(innerHTML);
                                $scope.swiper += 1;
                            }

                            $('#' + mainId).highcharts({
                                chart: {
                                    type: 'column',
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
                                    text: '冷库门开关监控'
                                },
                                xAxis: {
                                    type: 'datetime',
                                    tickPixelInterval: 200,
                                },
                                yAxis: {
                                    allowDecimals: false,
                                    labels: {
                                        formatter: function () {
                                            if (this.value === 0) {
                                                return "关";
                                            } else if (this.value === 1) {
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
                                    max: 1,
                                    min: 0,
                                },
                                tooltip: {
                                    formatter: function () {
                                        var state = undefined;
                                        if (this.y === 1) {
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
                                    pointWidth: 48, //柱子之间的距离值
                                    data: (function () {
                                        return data;
                                    })()
                                }]
                            });
                        });

                    });

                });
            } else {
                var mainId = 'defalt' + $scope.defaltswiper;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.defaltswiper += 1;
                    $scope.swiper += 1;
                }
            }
        })
    }

    $scope.drawFlatform = function (storage) {
        $http.get(ER.coldroot + '/i/coldStorageDoor/findByStorageId?storageID=' + storage.id).success(function (data) {
            if (data.length > 0) {
                var doorId = data[0].id;
                $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
                    params: {
                        "oid": doorId,
                        type: 11,
                        key: 'Switch'
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

                    $(function () {
                        $(document).ready(function () {

                            Highcharts.setOptions({
                                global: {
                                    useUTC: false
                                }
                            });

                            var mainId = 'platform' + doorId;
                            if ($scope.swiper < $scope.mystorages.length) {
                                var innerHTML = '<div class="swiper-slide">' +
                                    '<p class="actually">' + storage.name + '</p>' +
                                    '<div id=' + mainId + '></div> ';
                                $("#chartView").last().append(innerHTML);
                                $scope.swiper += 1;
                            }

                            $('#' + mainId).highcharts({
                                chart: {
                                    type: 'column',
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
                                    text: '月台门开关监控'
                                },
                                xAxis: {
                                    type: 'datetime',
                                    tickPixelInterval: 200,
                                },
                                yAxis: {
                                    allowDecimals: false,
                                    labels: {
                                        formatter: function () {
                                            if (this.value === 0) {
                                                return "关";
                                            } else if (this.value === 1) {
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
                                    max: 1,
                                    min: 0,
                                },
                                tooltip: {
                                    formatter: function () {
                                        var state = undefined;
                                        if (this.y === 1) {
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
                                    pointWidth: 48, //柱子之间的距离值
                                    data: (function () {
                                        return data;
                                    })()
                                }]
                            });
                        });

                    });

                })
            } else {
                var mainId = 'defalt' + $scope.defaltswiper;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.defaltswiper += 1;
                    $scope.swiper += 1;
                }
            }
        })
    }

    $scope.drawOther = function () {

        var keyDescribleMap = {
            forkLift: "叉车日耗能", windScreen: "风幕机日耗能",
            pressurePlatform: "液压平台日耗能", chargingPile: "充电桩日耗能"
        }
        url = ER.coldroot + "/i/other/findOtherDeviceCosts?rdcId=" + $scope.rdcId + "&startTime="
            + getFormatTimeString(-30 * 24 * 60 * 60 * 1000) + "&endTime=" + getFormatTimeString()
        $http.get(url).success(function (data) {
            $scope.otherInfos = data;
            angular.forEach(data, function (infos, key) {
                var mainId = key + "Chart";
                var chartId = "#" + mainId;
                if ($scope.swiper < 4) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + keyDescribleMap[key] + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }

                var chart = echarts.init($(chartId).get(0));
                var xData = []
                var yData = []
                angular.forEach(infos, function (info) {
                    yData.push(info.cost)
                    xData.push(formatTime(info.time))
                })
                chart.setOption($scope.creatOption(keyDescribleMap[key], xData, yData,
                    "耗能", "kW.h", keyDescribleMap[key], "line"))
            })
        })
    }

    $scope.activeEnergy = 'storageDoor';
    $scope.storageDoorFacility = function () {
        clearSwiper();
        $scope.activeEnergy = 'storageDoor';

        for (var i = 0; i < $scope.mystorages.length; i++) {
            $scope.drawDoor($scope.mystorages[i]);
        }
    }

    $scope.platformDoorFacility = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'platformDoor';
        for (var i = 0; i < $scope.mystorages.length; i++) {
            $scope.drawFlatform($scope.mystorages[i]);
        }
    }

    $scope.otherFacilityFacility = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'otherFacility';
        $scope.drawOther();
    }

    function clearSwiper() {
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
    }

    var getFormatTimeString = function (delta) {
        delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
    }

    var formatTime = function (timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type) {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title,
                x: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#333'          // 主标题文字颜色
                },
            },
            calculable: true,
            grid: {
                x: 55,
                y: 60,
                x2: 75,
                /*y2: 60,*/
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yName + "(" + yUnit + ")"
                }
            ],
            series: [
                {
                    name: lineName,
                    type: type,
                    data: yData,
                }
            ]
        };
        return option
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'storageDoor') {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawDoor($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'platformDoor') {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawFlatform($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'otherFacility') {
            $scope.drawOther();
        }
    }, 30000);

});

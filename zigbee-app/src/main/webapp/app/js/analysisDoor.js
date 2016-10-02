checkLogin();
var app = angular.module('app', []);
app.controller('analysisDoor', function ($scope, $location, $http, $rootScope, $timeout) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var rootRdcId = $.getUrlParam('storageID');
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            if (rootRdcId == undefined || rootRdcId == null) {
                $scope.currentRdc = $scope.storages[0];
                $scope.rdcId = $scope.storages[0].id;
                $scope.rdcName = $scope.storages[0].name;
                $scope.viewStorage($scope.storages[0].id);
            } else {
                $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
                    $scope.currentRdc = data[0];
                    $scope.rdcName = data[0].name;
                    $scope.rdcId = data[0].id;
                    $scope.viewStorage($scope.rdcId);
                });
            }
        }
    });

    $scope.viewStorage = function (rdcId) {
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                $scope.drawDoor();
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    }
    $scope.changeRdc = function (rdc) {
        clearSwiper();
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
    }

    //TODO 替换为分析的跳转
    $scope.goTemperature = function () {
        window.location.href = 'analysis.html?storageID=' + $scope.rdcId;
    }
    $scope.goLight = function () {
        //window.location.href = 'analusisLight.html?storageID=' + $scope.rdcId;
    }
    $scope.goOther = function () {
        //window.location.href = 'analysiOther.html?storageID=' + $scope.rdcId;
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawDoor = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'DoorTotalTime,DoorOpenTimes'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                xData = []
                yData1 = []
                yData2 = []
                yData3 = []

                var mainIdAll = 'doorAll' + key;
                var mainIdAvg = 'doorAvg' + key;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + mainIdAll + ' style="min-height:10rem;"></div> ' +
                        '<div id=' + mainIdAvg + ' style="height: 10rem;"></div>' +
                        '</div>';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                var chart1 = echarts.init($('#' + mainIdAll).get(0));
                var chart2 = echarts.init($('#' + mainIdAvg).get(0));
                angular.forEach(storage['DoorTotalTime'], function (item, index) {
                    xData.unshift(formatTime(item['date']).split(" ")[0])
                    yData1.unshift((item['value'] / 60).toFixed(2))
                    yData2.unshift(storage['DoorOpenTimes'][index].value)
                    yData3.unshift(
                        storage['DoorOpenTimes'][index].value == 0
                            ? 0 :
                        item['value'] / storage['DoorOpenTimes'][index].value / 60
                    )
                })
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    legend: {
                        data: ['开门时长', '开门次数']
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
                            name: '开门时长',
                            max: 1500,
                            axisLabel: {
                                formatter: '{value} m'
                            }
                        },
                        {
                            type: 'value',
                            name: '开门次数',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '开门时长',
                            type: 'bar',
                            data: yData1
                        },
                        {
                            name: '开门次数',
                            type: 'line',
                            yAxisIndex: 1,
                            data: yData2
                        }
                    ]
                };
                chart1.setOption(Option);
                chart2.setOption($scope.getEchartSingleOption("", xData, yData3, "平均开门时间", "m", "m", "bar"));
            })
        })
    }

    $scope.goDoor = function () {
        clearSwiper();
        $scope.drawDoor();
    }

    function clearSwiper() {
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
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
            backgroundColor: '#D2D6DE',
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

    $scope.getEchartSingleOption = function (title, xData, yData, yName, yUnit, lineName, type, yMin) {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yName + "(" + yUnit + ")",
                    min: yMin ? yMin : 0
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
        return option;
    }
});

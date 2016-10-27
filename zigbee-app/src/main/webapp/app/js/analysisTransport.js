checkLogin();
var app = angular.module('app', []);
app.controller('analysisTransport', function ($scope, $location, $http, $rootScope, $timeout) {
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
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {params: {
            "rdcId": rdcId
        }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
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

    $scope.goTemperature = function () {
        window.location.href = 'analysis.html?storageID=' + $scope.rdcId;
    }
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }
    $scope.goQuery = function () {
        window.location.href = 'analysisQuery.html?storageID=' + $scope.rdcId;
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
                        '<div id=' + mainIdAll + ' style="min-height:14rem;margin-bottom:.3rem;"></div> ' +
                        '<div id=' + mainIdAvg + ' style="height: 14rem;"></div>' +
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
                    backgroundColor: '#D2D6DE',
                    title: {
                        text: '近30日冷库日累积开门总时长及日累积开门次数',
                        textStyle: {
                            fontSize: 13,
                            fontWeight: 'normal'
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 12      // 主标题文字颜色
                        },
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
                        data: ['开门时长', '开门次数'],
                        y: 'bottom'
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
                            name: '开门时长(min)',
                            max: 1500,
                            axisLabel: {
                                formatter: '{value}'
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
                    grid: {
                        x: 45,
                        y: 50,
                        width: '75%'
                    },
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
                chart1.setOption(option);
                chart2.setOption($scope.getEchartSingleOption("近30日冷库日平均单次开门时长", xData, yData3, "平均开门时间", "min", "m", "bar"));
            })
        })
    }

    $scope.drawGoodsYZAnalysis = function () {

        $scope.showMap = {}
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'GoodsLiuTongYinZi'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                $timeout(function () {
                    xData = []
                    yData = []

                    var mainId = 'goodsYz' + key;
                    if ($scope.swiper < $scope.mystorages.length) {
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">' + key + '</p>' +
                            '<div id=' + mainId + ' style="height:300px"></div> ';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper += 1;
                    }

                    var chart = echarts.init($('#' + mainId).get(0));
                    $scope.showMap[mainId] = storage['GoodsLiuTongYinZi'].length
                    angular.forEach(storage['GoodsLiuTongYinZi'], function (item) {
                        xData.unshift(formatTime(item['date']).split(" ")[0])
                        yData.unshift(item['value'] / 60)
                    })
                    chart.setOption($scope.getEchartSingleOption("货物流通因子",
                        xData, yData, "时间", "", "货物流通因子", "bar", 0));
                }, 0)
            })
        })
    }

    $scope.drawHotAnalysis = function () {
        var mainId1 = 'hotPie';
        var mainId2 = 'hotColumn';
        if ($scope.swiper < $scope.mystorages.length) {
            var innerHTML = '<div class="swiper-slide">' +
                '<div id=' + mainId1 + ' style="height:250px"></div>' +
                '<div id=' + mainId2 + ' style="height:250px"></div>' +
                '</div>';
            $("#chartView").last().append(innerHTML);
            $scope.swiper += 1;
        }
        $('#' + mainId1).highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: '最新热量分布图'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                itemDistance: 10
            },
            plotOptions: {
                pie: {
                    depth: 40,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    },
                    showInLegend: true
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'pie',
                name: '占比',
                data: [['货物', 20.0], ['化霜', 26.8], ['叉车', 12.8], ['照明', 8.5], ['开门', 6.9], ['保温', 10], ['冷风机风扇', 15.0]]
            }]
        });

        $('#' + mainId2).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '近30日热量分布图'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',],
                labels: {
                    format: '{value} 日'
                },
                max: 30
            },
            yAxis: {
                min: 0,
                text: null
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: '货物',
                data: [2, 2, 4, 2, 3, 6, 1, 2, 2, 4, 2, 3, 6, 1, 2, 2, 4, 2, 3, 6, 1, 2, 2, 4, 2, 3, 3, 1, 2, 2, 4, 2, 3, 6, 1]
            }, {
                name: '化霜',
                data: [1, 1.5, 3, 2, 1, 5, 6, 3, 1.5, 3, 2, 1, 5, 6, 3, 1.5, 3, 2, 1, 5, 3, 3, 1.5, 3, 2, 1, 5, 6, 3, 1.5, 3, 2, 1, 2, 2]
            }, {
                name: '叉车',
                data: [1.5, 1.5, 4, 2, 5, 6, 1, 2, 1.5, 4, 2, 5, 6, 1, 2, 1.5, 4, 2, 5, 6, 1, 2, 1.5, 4, 2, 5, 3, 1, 2, 1.5, 4, 2, 5, 1]
            }, {
                name: '照明',
                data: [1, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 2, 3, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 2]
            }, {
                name: '开门',
                data: [1.5, 2, 4, 2, 5, 6, 1, 2, 2, 4, 2, 3, 1, 1, 2, 2, 4, 2, 5, 6, 1, 2, 2, 4, 2, 3, 6, 1, 2, 2, 4, 2, 5, 2, 1]
            }, {
                name: '保温',
                data: [2, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 3, 3, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 6, 3, 1, 3, 2, 1, 5, 1]
            }, {
                name: '冷风机风扇',
                data: [1, 1, 4, 2, 5, 6, 1, 2, 1, 4, 2, 5, 1, 1, 2, 1, 4, 2, 5, 6, 1, 2, 1, 4, 2, 5, 2, 1, 2, 1, 4, 2, 5, 6, 1]
            }]
        });
    }

    $scope.goDoorRunAnalysis = function () {
        clearSwiper();
        $scope.drawDoor();
    }

    $scope.goGoodsYZAnalysis = function () {
        clearSwiper();
        $scope.drawGoodsYZAnalysis();
    }

    $scope.goHotAnalysis = function () {
        clearSwiper();
        $scope.drawHotAnalysis();
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
                trigger: 'axis',
                textStyle: {
                    fontSize: 12      // 主标题文字颜色
                }
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
        angular.forEach(yData, function (item, index) {
            yData[index] = yData[index].toFixed(2);
        })
        var option = {
            backgroundColor: '#D2D6DE',
            title: {
                text: title,
                textStyle: {
                    fontSize: 13,
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal'
                },
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
            grid: {
                x: 50,
                y: 50,
                width: '80%'
            },
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
